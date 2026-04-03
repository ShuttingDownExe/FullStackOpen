const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controller/blogs')

mongoose
    .connect(config.MONGODB_URL, { family: 4 })
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app