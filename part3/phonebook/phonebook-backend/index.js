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

app.get("/info", async (_, response) => {
    const currDate = new Date()
    const totalCount = await Person.countDocuments({})
    response.send(
        `<p>Phonebook has info for ${totalCount} people</p>`+
        `<p>${currDate.toString()}</p>`
    )
})

app.get("/api/persons", (_, response) => {
    Person.find({}).then(persons => {
        console.log(persons)
        response.json(persons)
    })
})

app.get("/api/persons/:id", async (request, response) => {
    try {
        const personId = request.params.id
        const person = await Person.findById(personId)
        if(!person) return response.status(404).json({"Error": "Person not found"})
        response.json(person)
    } catch (error) {
        console.log(error)
    }
})

app.delete("/api/persons/:id", async (request, response) => {
    try {
        const personId = request.params.id
        const person = await Person.findByIdAndDelete(personId)
        if(!person) return response.status(404).json({"Error":"Person not found"})
        return response.status(204).end()
    } catch (error) {
        console.log(error)
    }
})

app.post("/api/persons", (request, response) => {
    console.log(request.body)
    if(request.body.name && request.body.number) {
        const body = request.body
        const person = new Person({
            name: body.name,
            number: body.number
        })
        person.save().then(savedNote => response.json(savedNote))
    } else {
        response.status(400).json({"Error": "Empty Details"})
    }
})

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