
const Blog = require("../models/blog")
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response) => {
  console.log(request.body)
  if(!request.body.likes){
    request.body.likes=0
  }
  const blog = new Blog(request.body)
  result = await blog.save()
  response.status(200).json(result)
})

blogsRouter.delete('/:id', async (request,response)=>{
  await Blog.findByIdAndDelete(request.params.id)
  console.log("Deleted")
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

module.exports=blogsRouter