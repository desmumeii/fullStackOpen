const lodash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (prev, curr) => {
    return (prev.likes > curr.likes) ? prev : curr
  }
  return blogs.reduce(reducer, 0)
}

const mostBlogs = (blogs) => {
    const blogsByAuthor = lodash(blogs)
        .countBy('author')
        .map((blogs, author) => ({
            author,
            blogs
        }))
        .value()
    return lodash.maxBy(blogsByAuthor, 'blogs')
    
    
}

const mostLikes = (blogs) => {
    const likesByAuthor = lodash(blogs)
        .groupBy('author')
        .map((items, author) => ({
            author,
            likes: lodash.sumBy(items, 'likes')
        }))
        .value()
    return lodash.maxBy(likesByAuthor, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}