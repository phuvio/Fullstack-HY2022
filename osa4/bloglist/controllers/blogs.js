const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: request.user._id
  })

  const savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === request.user._id.toString()) {
    const result = await Blog.findByIdAndRemove(request.params.id)
    response.status(204).send(result)
  } else {
    response.status(403).json({ error: 'user does not have permission' })
  }
})

blogRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog)
})

blogRouter.put('/:id', async (request, response) => {
  const savedBlog = await Blog.findByIdAndUpdate(request.params.id, { $inc: { likes: 1 } })
  response.status(200).send(savedBlog)
})

module.exports = blogRouter