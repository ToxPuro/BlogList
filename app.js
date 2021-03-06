const express = require('express')
const app = express()
require('express-async-errors')
const mongoose = require("mongoose")
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const logger = require('./utils/logger')
const morgan = require('morgan')
const middleware = require('./utils/middleware')

const url= config.MONGODB_URL
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan('tiny',{
  skip: function (req) {return req.method === 'POST'}
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body',{
  skip: function (req) { return req.method !== 'POST'}
}))

app.use(cors())
app.use(middleware.tokenExtractor)
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.errorHandler)


module.exports = app