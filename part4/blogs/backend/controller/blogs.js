const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (_, response, next) => {
  try{
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {next(error)}
});

blogRouter.get('/:id', async(request, response, next) => {
  try{
    const blog = await Blog.findById(request.params.id)
    if(blog) response.json(blog)
    else response.status(404).json({error: 'blog not found'})
  } catch(error) {next(error)}
});

blogRouter.post('/', async (request, response, next) => {
    if(request.body.title === undefined 
      || request.body.author === undefined 
      || request.body.url === undefined 
      || request.body.summary === undefined) {
        return response.status(400).json({ error: 'Title, author, URL, and summary are required' });
    }

    const { title, author, url, likes, summary } = request.body;
    const blog = new Blog({ title, author, url, likes, summary });

    try {
      const result = await blog.save()
      response.status(201).json(result)
    } catch(error) {next(error)}
});

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(request.params.id)
    if (blog) {response.status(204).end()}
    else if (blog == null) {response.status(404).end()}
  } catch (error) {next(error)}
});

blogRouter.patch('/:id', async (request, response, next) => {
  const { title, author, url, likes, summary } = request.body;
  const updatedBlog = {};

  if (title !== undefined) updatedBlog.title = title;
  if (author !== undefined) updatedBlog.author = author;
  if (url !== undefined) updatedBlog.url = url;
  if (likes !== undefined) updatedBlog.likes = likes;
  if (summary !== undefined) updatedBlog.summary = summary;

  try {
    const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {new: true, runValidators: true})

    if (result){response.json(result)}
    else {response.status(404).json({error: 'blog not found'})}
  } catch (error) {next(error)}
});



module.exports = blogRouter;