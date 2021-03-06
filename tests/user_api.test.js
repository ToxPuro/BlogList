const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach( async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('salainen', 10)
  const user = new User({ username: 'root', name: 'superUser',passwordHash })

  await user.save()

})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('`username` to be unique')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

test('creation fails with proper statuscode and message if username length less than 3', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'ro',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('is shorter than the minimum allowed length (3)')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

test('username required', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('Path `username` is required.')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

test('password is required', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    name: 'Superuser'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('password is required')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

test('password needs to be at least 3 characters', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    name: 'Superuser',
    password: 'pa'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('password needs to be atleast 3 characters long')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toHaveLength(usersAtStart.length)
})


afterAll( async ()=>{
  mongoose.connection.close()
})