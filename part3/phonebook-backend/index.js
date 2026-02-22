const express = require("express")
const morgan = require("morgan")
const cors = require("cors")


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

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/info", (_, response) => {
    const currDate = new Date()
    response.send(
        `<p>Phonebook has info for ${people.length} people</p>`+
        `<p>${currDate.toString()}</p>`
    )
})

app.get("/api/persons", (_, response) => {
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const personId = request.params.id
    const person = persons.find(p => p.id === personId)
    if (!person) {
        response.status(404).json(
            {
                "Error": "Person with ID not found"
            }
        )
    } else {
        response.json(person)
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const personId = request.params.id
    persons = persons.filter(p => p.id !== personId)
    response.status(204).end()
})

const generateId = () => {
    let id
    do {
        id = String(Math.floor(Math.random() * 100))
    } while (persons.find(p => p.id === id))
    return id
}

app.post("/api/persons", (request, response) => {
    if (request.body) {
        const body = request.body
        if(!body.name){
            return response.status(400).json(
                {
                    "Error": "name is not set"
                }
            )
        }
        if (!body.number){
            return response.status(400).json(
                {
                    "Error": "number is not set"
                }
            )
        }
        if (persons.find(p => p.name == body.name)){
            return response.status(400).json(
                {
                    "Error": "name already Exists"
                }
            )
        }
        const person = {
            id: generateId(),
            name: body.name,
            number: body.number
        }
        persons = persons.concat(person)
        response.json(person)
    }else {
        return response.status(400).json(
            {
                "Error": "Empty Body"
            }
        )
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`)
})