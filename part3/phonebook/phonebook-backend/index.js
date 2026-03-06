require('dotenv').config()

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const Person = require('./modules/person')


const app = express()

app.use(express.json())
app.use(cors())


app.use(morgan(function (tokens, req, res) {
    let body = null
    if(req.method === "POST"){
        body = JSON.stringify(req.body)
    }
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        `${body ? body : ""}`
  ].join(' ')
}))

app.get("/info", (_, response, next) => {
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

app.get("/api/persons", (_, response) => {
    Person.find({}).then(persons => {
        console.log(persons)
        response.json(persons)
    }).catch(error => next(error))
})

app.get("/api/persons/:id", (request, response) => {
    const personId = request.params.id

    Person.findById(personId)
    .then(person => {
        if(!person) return response.status(404).json({"Error": "Person not found"})
        return response.json(person)
    })
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response) => {
    const personId = request.params.id

    Person.findByIdAndDelete(personId)
    .then(person => {
        if(!person) return response.status(404).json({"Error":"Person not found"})
        return response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response) => {
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
        response.status(400).json({"Error": "Empty Details"})
    }
})

app.put("/api/persons/:id", (request, response) => {
    const personId = request.params.id
    const body = request.body

    Person.findByIdAndUpdate(
        personId,
        {
            name: body.name,
            number: body.number
        },
        {new: true}
    )
    .then(updatedPerson => {
        if(!updatedPerson) return response.status(404).json({"Error": "Person not found"})
        return response.json(updatedPerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (_, response) => {
    response.status(404).send({error: "Unkown Endpoint"})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({ error: 'duplicate value' })
  }

  return res.status(500).json({ error: 'internal server error' })
}

app.use(errorHandler)

if(process.env.NODE_ENV === "production"){
    app.use(express.static("dist"))

    app.get("*", (_, response) => {
        response.sendFile(__dirname + "/dist/index.html")
    })
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`)
})