const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return value.length > 5;
      },
      message: 'Title must be at least 6 characters long',
    },
  },
  author: {
    name: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          return value.length > 3;
        },
        message: 'Author name must be at least 4 characters long',
      },
    },
    title: {
      type: String,
      required: true,
      validate: {
        validator: (value) => {
          return value.length > 5;
        },
        message: 'Author title must be at least 6 characters long',
      },
    },  
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return value.length > 10;
      },
      message: 'URL must be at least 11 characters long',
    },
  },
  likes: {
    type: Number,
    default: 0,
    validate: {
      validator: (value) => {
        return value >= 0;
      },
      message: 'Likes must be a non-negative number',
    },
  },
  summary: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return value.length <= 200 && value.length > 0;
      },
      message: 'Summary must be between 1 and 200 characters long',
    },
  }
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Blog', blogSchema);