const {test, after, beforeEach, describe} = require('node:test');
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

describe('GET Endpoints', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('the identifier is \'id\' and not \'_id\'', async () => {
    const response = await api.get('/api/blogs')
    const first = response.body[0]
    assert.notStrictEqual(first.id, undefined)
    assert.strictEqual(first._id, undefined)
  })

  test('a specific blog is returned', async() => {
    const response = await api.get('/api/blogs')
    const first = response.body[0]

    const result = await api
      .get(`/api/blogs/${first.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.title, first.title)
    assert.strictEqual(result.body.url, first.url)
    assert.strictEqual(result.body.summary, first.summary)
    assert.deepStrictEqual(result.body.author, first.author)
  })

  test('every returned blog has the required fields', async () => {
    const response = await api.get('/api/blogs').expect(200)

    response.body.forEach(blog => {
      assert.notStrictEqual(blog.id, undefined)
      assert.notStrictEqual(blog.title, undefined)
      assert.notStrictEqual(blog.author, undefined)
      assert.notStrictEqual(blog.url, undefined)
      assert.notStrictEqual(blog.summary, undefined)
      assert.notStrictEqual(blog.likes, undefined)
    })
  })

  test('returned blogs contain the expected initial blog titles', async () => {
    const response = await api.get('/api/blogs').expect(200)
    const titles = response.body.map(blog => blog.title)

    helper.initialBlogs.forEach(blog => {
      assert(titles.includes(blog.title))
    })
  })

  test('a non existing id returns 404', async() => {
    const nonExistingId = await helper.nonExistantId()
    await api.get(`/api/blogs/${nonExistingId}`).expect(404)
  })

  test('malformatted id returns 400', async() => {
    await api.get('/api/blogs/12345').expect(400)
  })
})

describe('POST Endpoints', () => {
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

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const allblogs = await api.get('/api/blogs')
    const summaries = allblogs.body.map(blog => blog.summary)

    assert.strictEqual(allblogs.body.length, helper.initialBlogs.length + 1)
    assert(summaries.includes('I would do anything for my daughter. Even put myself back like legos'))
  })

  test('POST returns the created blog with an id', async () => {
    const blog = {
      "author": {
        "name": "Miles Morales",
        "title": "Friendly Neighborhood Spider-Man"
      },
      "title": "Leap of Faith",
      "url": "www.spiderverse.com",
      "likes": 1610,
      "summary": "Anyone can wear the mask."
    }

    const response = await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.notStrictEqual(response.body.id, undefined)
    assert.strictEqual(response.body.title, blog.title)
    assert.deepStrictEqual(response.body.author, blog.author)
    assert.strictEqual(response.body.url, blog.url)
    assert.strictEqual(response.body.likes, blog.likes)
    assert.strictEqual(response.body.summary, blog.summary)
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
    assert.strictEqual(response.body.likes, 0)
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

  test('POST without author will return status 400', async () => {
    const blog = {
      "title": "No Author Blog",
      "url": "www.noauthor.com",
      "summary": "This should not be saved."
    }

    const response = await api.post('/api/blogs').send(blog).expect(400)
    assert.strictEqual(response.body.error, "Title, author, URL, and summary are required")
  })

  test('POST without summary will return status 400', async () => {
    const blog = {
      "author": {
        "name": "Ethan Wintoers",
        "title": "#1 Dad"
      },
      "title": "Missing Summary",
      "url": "www.missingsummary.com"
    }

    const response = await api.post('/api/blogs').send(blog).expect(400)
    assert.strictEqual(response.body.error, "Title, author, URL, and summary are required")
  })

  test('invalid blog is not added to the database', async () => {
    const blog = {
      "author": {
        "name": "Ethan Wintoers",
        "title": "#1 Dad"
      },
      "summary": "This should fail because title and url are missing."
    }

    await api.post('/api/blogs').send(blog).expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

describe('PATCH Endpoints', () => {
  test('PATCH updates one field of an existing blog', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedSummary = {
      summary: 'Updated summary from patch request'
    }

    const response = await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedSummary)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.summary, updatedSummary.summary)
    assert.strictEqual(response.body.title, blogToUpdate.title)
    assert.strictEqual(response.body.url, blogToUpdate.url)
  })

  test('PATCH updates multiple fields of an existing blog', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedFields = {
      title: 'Updated Blog Title',
      likes: 999,
      url: 'www.updated-blog.com'
    }

    const response = await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedFields)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, updatedFields.title)
    assert.strictEqual(response.body.likes, updatedFields.likes)
    assert.strictEqual(response.body.url, updatedFields.url)
    assert.deepStrictEqual(response.body.author, blogToUpdate.author)
    assert.strictEqual(response.body.summary, blogToUpdate.summary)
  })

  test('PATCH persists the updated blog in the database', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    await api
      .patch(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 42 })
      .expect(200)

    const updatedBlog = await api.get(`/api/blogs/${blogToUpdate.id}`).expect(200)
    assert.strictEqual(updatedBlog.body.likes, 42)
  })

  test('PATCH with a non existing id returns 404', async () => {
    const nonExistingId = await helper.nonExistantId()

    await api
      .patch(`/api/blogs/${nonExistingId}`)
      .send({ likes: 100 })
      .expect(404)
  })

  test('PATCH with a malformatted id returns 400', async () => {
    await api
      .patch('/api/blogs/12345')
      .send({ likes: 100 })
      .expect(400)
  })
})

describe('DELETE Endpoints', () => {
  test('DELETE removes an existing blog', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    const ids = blogsAtEnd.body.map(blog => blog.id)

    assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length - 1)
    assert(!ids.includes(blogToDelete.id))
  })

  test('DELETE does not remove other blogs', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]
    const blogToKeep = blogsAtStart.body[1]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const response = await api.get(`/api/blogs/${blogToKeep.id}`).expect(200)
    assert.strictEqual(response.body.title, blogToKeep.title)
  })

  test('DELETE with a non existing id returns 404', async () => {
    const nonExistingId = await helper.nonExistantId()

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(404)
  })

  test('DELETE with a malformatted id returns 400', async () => {
    await api
      .delete('/api/blogs/12345')
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})