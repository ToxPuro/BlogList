const Blog = require("../models/blog")
const User = require("../models/user")
const testRouter = require('express').Router()

testRouter.post('/reset', async (request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()

  })
  
module.exports = testRouter