const Blog = require("../models/blog")
const User = require("../models/user")
const blogsRouter = require('express').Router()
const config = require('../utils/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response) => {
  if(!request.body.likes){
    request.body.likes=0
  }
  const token = request.token
  const decodedToken = jwt.verify(token, config.SECRET)
  if(!token || !decodedToken.id){
    return response(401).json({ error: 'token missing or invalid'})
  }
  const user = await User.findById(decodedToken.id)
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: user._id
  })
  result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(200).json(result)
})

blogsRouter.delete('/:id', async (request,response)=>{
  const token = request.token
  const decodedToken = jwt.verify(token, config.SECRET)
  if(!token || !decodedToken.id){
    return response(401).json({ error: 'token missing or invalid'})
  }
  const blog = await Blog.findById(request.params.id)
  if(!blog){
    response.status(204).end()
  }
  if(blog.user.toString() !== decodedToken.id){
    return response.status(401).json({ error: 'wrong user'})
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})


blogsRouter.put('/:id', async (request,response)=>{
  const blog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes
  }
  updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true})
  response.json(updatedBlog)
})

blogsRouter.get('/:id', async(request, response) =>{
  blog = await Blog.findById(request.params.id)
  response.json(blog)
})


module.exports=blogsRouter