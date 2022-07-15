const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connecting to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MonggoDB:', error.message)
  })

app.use(express.json())

app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use(middleware.requestLogger)
app.use(cors())
app.use(express.json())

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app