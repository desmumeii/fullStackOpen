const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

test('users are returned as json', async () => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/users')
  assert.strictEqual(response.status, 200)
  assert.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
  assert.ok(Array.isArray(response.body))
  assert.strictEqual(response.body.length, helper.initialUsers.length)
})

test('a valid user can be added', async () => {
  const newUser = {
    username: "newuser",
    name: "New User",
    password: "securepassword"
  }
  
  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
  assert.ok(usersAtEnd.find(u => u.username === newUser.username))
})

test('user creation fails with proper statuscode and message if username already taken', async () => {
  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
  assert.strictEqual(result.status, 400)
  assert.ok(result.body.error.includes('username must be unique'))
})


test ('user creation fails with proper statuscode and message if password is invalid', async () => {
  const newUser = {
    username: 'shortpass',
    name: 'Short Pass',
    password: 'ab',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
  
  assert.strictEqual(result.status, 400)
  assert.ok(result.body.error.includes('invalid password'))
})

after(async () => {
  await mongoose.connection.close()
})