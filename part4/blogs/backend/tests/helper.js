const Blog = require('../models/blog')

const initialBlogs = [
  {
    "author": {
      "name": "Albert Wesker",
      "title": "Professional World Dominator"
    },
    "title": "Why punching boulders is overrated",
    "url": "www.ouroboros.com",
    "likes": 123,
    "summary": "A deep dive into the dark world of boulders and their impact on our lives.",
  },
  {
    "author": {
      "name": "Chris Redfield",
      "title": "Global Hunk"
    },
    "title": "These Residents are becoming Evil. What do you do next?",
    "url": "www.boulders.com",
    "likes": 9821,
    "summary": "What do you do when you are trapped in a city with zombies? Do you run, hide, or fight? Chris Redfield has been through it all and has some advice for you.",
  },
  {
    "author": {
      "name": "Leon Scott Kennedy",
      "title": "Special Agent, Quipmaster"
    },
    "title": "You've GOT to learn backflips!",
    "url": "www.i<3ada.com",
    "likes": 95,
    "summary": "When 2 women lunge at you with chainsaws, you don't ask questions. You just do what you gotta do to survive. And if that means learning how to do backflips, then so be it.",
  },
  {
    "author": {
      "name": "Jill Valentine",
      "title": "Tube Top, Fictional Crush"
    },
    "title": "A Carlos-less world isn't so bad",
    "url": "www.ifckednemesis.com",
    "likes": 8,
    "summary": "What if I never met Carlos? Meh, I don't think it would be that bad. I mean, sure, he's a great guy and all, but I think I could find someone else to fill his shoes. Plus, I wouldn't have to deal with his constant need for attention and validation.",
  },
  {
    "author": {
      "name": "Claire Redfield",
      "title": "Special Agent Simp"
    },
    "title": "I have a crush, and its bad",
    "url": "www.single4lyf.com",
    "likes": 95,
    "summary": "I have a crush on a special agent, but he keeps making jokes and quips. I think he is into asians anyway. AMA",
  }
]

const nonExistantId = async() => {
    const blog = new Blog({content: 'willdelete'})
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

const notesInDb = async() => {
    const notes = await Blog.find({})
    return notes.map(note => note.toJSON())
}

module.exports = {
    initialBlogs, nonExistantId, notesInDb
}