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

app.get("/info", (_, response) => {
    const currDate = new Date()
    Person.countDocuments({}).then(totalCount => {
        response.send(
        `<p>Phonebook has info for ${totalCount} people</p>`+
        `<p>${currDate.toString()}</p>`
    )   
    }).catch(error=> {
        console.log(error)
        response.status(500).end()
    })
    
})

app.get("/api/persons", (_, response) => {
    Person.find({}).then(persons => {
        console.log(persons)
        response.json(persons)
    })
})

app.get("/api/persons/:id", (request, response) => {
    const personID = request.params.id
    Person.findById(personID).then(person => {
        if(!person) response.status(404).json({error: "Person not found"})
        response.json(person)
    }).catch(error => {
        console.error(error)
        response.status(500).end()
    })
})

app.delete("/api/persons/:id", (request, response) => {
    const personID = request.params .id
    Person.findByIdAndDelete(personID).then(_ => {
        response.status(204).end()
    })
    .catch(error => {
        console.error(error)
        response.status(500).end()
    })
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