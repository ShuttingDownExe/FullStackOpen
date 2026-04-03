const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', (_, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogRouter.get('/:id', (request, response) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog);
      } else {
        response.status(404).json({ error: 'blog not found' });
      }
    })
    .catch((_) => {
      response.status(400).json({ error: 'malformatted id' });
    });
});

blogRouter.post('/', (request, response) => {
    if(request.body.title === undefined || request.body.author === undefined || request.body.url === undefined || request.body.summary === undefined) {
        return response.status(400).json({ error: 'Title, author, URL, and summary are required' });
    }

  const { title, author, url, likes, summary } = request.body;
    const blog = new Blog({ title, author, url, likes, summary });

    blog.save().then((result) => {
        response.status(201).json(result);
    }).catch((error) => {
        response.status(400).json({ error: error.message });
    });
});

blogRouter.delete('/:id', (request, response) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((_) => {
      response.status(400).json({ error: 'malformatted id' });
    });
});

blogRouter.patch('/:id', (request, response) => {
  const { title, author, url, likes, summary } = request.body;
  const updatedBlog = {};

  if (title !== undefined) updatedBlog.title = title;
  if (author !== undefined) updatedBlog.author = author;
  if (url !== undefined) updatedBlog.url = url;
  if (likes !== undefined) updatedBlog.likes = likes;
  if (summary !== undefined) updatedBlog.summary = summary;

  Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true, runValidators: true })
    .then((result) => {
      if (result) {
        response.json(result);
      } else {
        response.status(404).json({ error: 'blog not found' });
      }
    })
    .catch((error) => {
      response.status(400).json({ error: error.message });
    });
});



module.exports = blogRouter;