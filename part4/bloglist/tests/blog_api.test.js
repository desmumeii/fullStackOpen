const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.status, 200)
  assert.match(response.headers['content-type'], /application\/json/)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  const ids = response.body.map(blog => blog.id)
  for (const id of ids) {
    assert.ok(id)
  }
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "Async/Await simplifies making async calls",
    author: "John Doe",
    url: "http://example.com/async-await",
    likes: 15
  }
  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(blog => blog.title)
  assert.ok(titles.includes(newBlog.title))
})

test('if likes property is missing, it will default to 0', async () => {
  const newBlog = {
    title: "No Likes Property",
    author: "Jane Doe",
    url: "http://example.com/no-likes"
  }


    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
          
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    assert.strictEqual(blogsAtEnd[blogsAtEnd.length - 1].likes, 0)
})

test('blog without title and url is not added', async () => {
  const newBlog = {
    author: "Jane Doe",
    likes: 5
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
          
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test.only('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
  assert.ok(!blogsAtEnd.map(blog => blog.id).includes(blogToDelete.id))
})

test.only('a blog can be updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedBlogData = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1,
  }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  assert.ok(blogsAtEnd.map(blog => blog.id).includes(blogToUpdate.id))
  assert.strictEqual(blogsAtEnd.find(blog => blog.id === blogToUpdate.id).likes, updatedBlogData.likes)
})

after(async () => {
  await mongoose.connection.close()
})