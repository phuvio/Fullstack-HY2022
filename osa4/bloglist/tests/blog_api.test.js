const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObject = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObject.map(blog => blog.save())
  await Promise.all(promiseArray)

  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salainen', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('basic tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map(r => r.title)

    expect(title).toContain('Go To Statement Considered Harmful')
  })

  test('returned blogs have id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('can log in', async () => {
    const newUser = {
      username: 'testi',
      password: 'salasana'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
    await api
      .post('/api/login')
      .send(newUser)
      .expect(200)
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added when logged in', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newUser = {
      username: 'testi',
      password: 'salasana'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const loggedInUser = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)

    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      user: loggedInUser._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `bearer ${loggedInUser.body.token}` })
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(r => r.title)

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)
    expect(titles).toContain('First class tests')
  })

  test('a valid blog cannot be added when not logged in', async () => {
    const user = await User.findOne({ username: 'root' })

    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      user: user._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('new blog saved without likes equals new blog with 0 likes', async () => {
    const newUser = {
      username: 'testi',
      password: 'salasana'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const loggedInUser = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)

    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      user: loggedInUser._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `bearer ${loggedInUser.body.token}` })
      .expect(201)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(r => r.title)
    const likes = blogsAtEnd.map(r => r.likes)
    expect(titles).toContain('Canonical string reduction')
    expect(likes).toContain(0)
  })

  test('blog without title is not added', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newUser = {
      username: 'testi',
      password: 'salasana'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const loggedInUser = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)

    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 1,
      user: loggedInUser._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `bearer ${loggedInUser.body.token}` })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('blog without url is not added', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newUser = {
      username: 'testi',
      password: 'salasana'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const loggedInUser = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)

    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      likes: 2,
      user: loggedInUser._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `bearer ${loggedInUser.body.token}` })
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('remove single blog', () => {
  test('remove a single blog', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newUser = {
      username: 'testi',
      password: 'salasana'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const loggedInUser = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)

    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      user: loggedInUser._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `bearer ${loggedInUser.body.token}` })
      .expect(201)

    let blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    const find = await Blog.findOne({ title: 'Type wars' })
    await api
      .delete(`/api/blogs/${find.id}`)
      .set({ Authorization: `bearer ${loggedInUser.body.token}` })

    blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain('Type wars')
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
})

describe('change information of a single blog', () => {
  test('increase likes by 1 of a single blog', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newUser = {
      username: 'testi',
      password: 'salasana'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)

    const loggedInUser = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)

    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      user: loggedInUser._id
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: `bearer ${loggedInUser.body.token}` })
      .expect(201)

    let blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    let find = await Blog.findOne({ title: 'Type wars' })
    await api.put(`/api/blogs/${find.id}`)

    find = await Blog.findOne({ title: 'Type wars' })

    expect(find.likes).toBe(3)
  })
})

afterAll(() => {
  mongoose.connection.close()
})