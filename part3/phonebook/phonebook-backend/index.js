require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./modules/person')

const app = express()

app.use(express.json())
app.use(cors())

app.use(morgan(function (tokens, req, res) {
  let body = null
  if(req.method === 'POST'){
    body = JSON.stringify(req.body)
  }
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    `${body ? body : ''}`
  ].join(' ')
}))

app.get('/info', (_, response, next) => {
  const currDate = new Date()

  Person.countDocuments({})
    .then(totalCount => {
      response.send(
        `<p>Phonebook has info for ${totalCount} people</p>`+
            `<p>${currDate.toString()}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons', (_, response, next) => {
  Person.find({}).then(persons => {
    console.log(persons)
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const personId = request.params.id

  Person.findById(personId)
    .then(person => {
      if(!person) {
        const err = new Error()
        err.name = 'NotFound'
        return next(err)
      }
      return response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const personId = request.params.id

  Person.findByIdAndDelete(personId)
    .then(person => {
      if(!person) {
        const err = new Error()
        err.name = 'NotFound'
        return next(err)
      }
      return response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  console.log(request.body)
  if(request.body.name && request.body.number) {
    const body = request.body
    const person = new Person({
      name: body.name,
      number: body.number
    })
    person.save()
      .then(savedPerson => response.json(savedPerson))
      .catch(error => next(error))
  } else {
    const err = new Error()
    err.name = 'ValidationError'
    return next(err)
  }
})

app.put('/api/persons/:id', (request, response, next) => {
  if (request.body.name && request.body.number) {
    const personId = request.params.id
    const body = request.body

    const person = {
      name: body.name,
      number: body.number
    }

    Person.findByIdAndUpdate(personId, person, { new: true, runValidators: true, context: 'query' })
      .then(updatedPerson => {
        if(!updatedPerson) {
          const err = new Error()
          err.name = 'NotFound'
          return next(err)
        }
        return response.json(updatedPerson)
      })
      .catch(error => next(error))
  } else {
    const err = new Error()
    err.name = 'ValidationError'
    return next(err)
  }
})

if(process.env.NODE_ENV === 'production'){
  app.use(express.static('dist'))

  app.get('/{*splat}', (_, response) => {
    response.sendFile(__dirname + '/dist/index.html')
  })
}

const unknownEndpoint = (_, response) => {
  response.status(404).send({ error: 'Unknown Endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, _, res) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if(error.name === 'NotFound') {
    return res.status(404).json({ error: 'Resource not found' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: 'Invalid Input', message: error.message })
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({ error: 'duplicate value' })
  }
  return res.status(500).json({ error: 'internal server error' })
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})