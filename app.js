const express = require('express')
const app = express()
const mongoose = require("mongoose")
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const morgan = require('morgan')

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
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app