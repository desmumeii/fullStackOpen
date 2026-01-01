const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')
const blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = (user.blogs || []).concat(savedBlog._id)
  await user.save()

  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'invalid user id' })
  }

  const blog = await Blog.findById(request.params.id)
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete a blog' })
  }

  const { id } = request.params
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const body = request.body

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  let result = await Blog.findByIdAndUpdate(id, updatedBlog, { 
    new: true,
    runValidators: true,
  })
  
  result = await result.populate('user', { username: 1, name: 1 })
  response.json(result)
})

blogRouter.post('/:id/comments', async (request, response) => {
  const { comment } = request.body
  const { id } = request.params
  if (!comment) {
    return response.status(400).json({ error: 'comment is required' })
  }
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  blog.comments = blog.comments.concat(comment)
  const updatedBlog = await blog.save()

  const populatedBlog = await Blog
    .findById(updatedBlog._id)
    .populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

module.exports = blogRouter