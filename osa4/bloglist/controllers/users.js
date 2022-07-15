const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password === undefined || password.length < 3) {
    return response.status(400).json({ error: 'incorrect password' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
  const user = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(user)
})

module.exports = userRouter