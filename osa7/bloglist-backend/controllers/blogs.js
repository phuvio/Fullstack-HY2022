const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const blogToReturn = await Blog
    .findById(savedBlog._id)
    .populate('user', { username: 1, name: 1 })
  response.status(201).json(blogToReturn)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blogToDelete = await Blog.findById(request.params.id)

  if (!blogToDelete) {
    return response.status(204).end()
  }

  if (blogToDelete.user && blogToDelete.user.toString() === request.user.id) {
    const result = await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).send(result)
  }

  response.status(401).json({ error: 'only the creator can delete a blog' })
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogRouter.put('/:id', async (request, response) => {
  const blog = request.body
  const savedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    )
    .populate('user', { username: 1, name: 1 })

  response.status(200).send(savedBlog)
})

module.exports = blogRouter