const { test, expect } = require('@jest/globals')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const initialBlogs = [ { id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7},
 { id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5},
  { id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12},
    { id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10 }, 
    { id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0}, 
    { id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2}
]

const blog = {
    title: 'Max Recipes',
    author: 'Max Italiano',
    url: 'http://MaxRecipesforyou.com',
    likes: 5
}

const blogWithNoLikes = {
    title: 'Max Recipes',
    author: 'Max Italiano',
    url: 'http://MaxRecipesforyou.com'
}

const blogWithNoUrl = {
    title: 'Max Recipes',
    author: 'Max Italiano',
    likes: 5
}

const blogWithNoTitle = {
    author: 'Max Italiano',
    url: 'http://MaxRecipesforyou.com',
    likes: 5
}

beforeEach(async ()=>{
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('Correct number of notes', async ()=>{
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
})

test('toJSON id is correct', async ()=>{
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('Can add correct blog', async ()=>{
    await api.post('/api/blogs').send(blog).expect(200).expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length+1)
    titles = response.body.map(blog => blog.title)
    expect(titles).toContainEqual('Max Recipes')
})

test('If no likes are given default is zero', async ()=>{

    await api.post('/api/blogs').send(blogWithNoLikes).expect(200).expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    noLikeBlog = response.body.find(blog => blog.title === 'Max Recipes')
    expect(noLikeBlog.likes).toBe(0)
})

test('No url sends 400 error', async ()=>{
    await api.post('/api/blogs').send(blogWithNoUrl).expect(400)
})

test('No title sends 400 error', async ()=>{
    await api.post('/api/blogs').send(blogWithNoTitle).expect(400)
})

test('Blog gets deleted', async()=>{
    const firstresponse = await api.get('/api/blogs')
    const blogToDelete=firstresponse.body[0]
    console.log(blogToDelete)
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    let response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length-1)
    titles = response.body.map(blog => blog.title)
    expect(titles).not.toContainEqual(blogToDelete.title)

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    response = await api.get('/api/blogs')
    expect(response.body.length).toBe(initialBlogs.length-1)


})

test('Modifying likes works', async()=>{
    let response = await api.get('/api/blogs')
    let blogToUpdate = response.body[0]
    const newBlog ={
        title: blogToUpdate.title,
        url: blogToUpdate.url,
        author: blogToUpdate.url,
        likes: blogToUpdate.likes+1
    }
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(200)

    response = await api.get('/api/blogs')
    expect(response.body[0].likes).toBe(blogToUpdate.likes+1)



})



afterAll(()=>{
    mongoose.connection.close()
})