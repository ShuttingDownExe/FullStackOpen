const {test,after,beforeEach} = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./helper')
const Blog = require('../models/blog');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('correct number of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 5)
})

test('the identifier is \'id\' and not \'_id\'', async () => {
    const response = await api.get('/api/blogs')
    const first = response.body[0]
    assert.notStrictEqual(first.id, undefined)
    assert.strictEqual(first._id, undefined)
})

test('POST to the endpoint creates a new blog', async () => {
    const blog = {
    "author": {
      "name": "Ethan Wintoers",
      "title": "#1 Dad"
    },
    "title": "I ❤️ my daughter",
    "url": "www.ifixitdads.com",
    "likes": 132,
    "summary": "I would do anything for my daughter. Even put myself back like legos",
  }

  const response = await api.post('/api/blogs').send(blog).expect(201)
  const allblogs = await api.get('/api/blogs')
  const summaries = allblogs.body.map(blog => blog.summary)
  assert.strictEqual(allblogs.body.length, helper.initialBlogs.length+1)
  assert(summaries.includes('I would do anything for my daughter. Even put myself back like legos'))
})

test('POST without the likes will set the default value to 0', async () => {
    const blog = {
    "author": {
      "name": "Ethan Wintoers",
      "title": "#1 Dad"
    },
    "title": "I ❤️ my daughter",
    "url": "www.ifixitdads.com",
    "summary": "I would do anything for my daughter. Even put myself back like legos"
  }

  const response = await api.post('/api/blogs').send(blog).expect(201)
  assert.strictEqual(response.body.likes,0)
})

test('POST with missing title or url will return status 400', async () => {
    const blog_no_url = {
    "author": {
      "name": "Ethan Wintoers",
      "title": "#1 Dad"
    },
    "title": "I ❤️ my daughter",
    "summary": "I would do anything for my daughter. Even put myself back like legos"
  }
    const blog_no_title = {
    "author": {
      "name": "Ethan Wintoers",
      "title": "#1 Dad"
    },
    "url": "www.ifixitdads.com",
    "summary": "I would do anything for my daughter. Even put myself back like legos"
  }

  const response_no_url = await api.post('/api/blogs').send(blog_no_url).expect(400)
  const response_no_title = await api.post('/api/blogs').send(blog_no_title).expect(400)

  assert.strictEqual(response_no_url.body.error, "Title, author, URL, and summary are required")
  assert.strictEqual(response_no_title.body.error, "Title, author, URL, and summary are required")
})

after(async () => {
    await mongoose.connection.close()
})