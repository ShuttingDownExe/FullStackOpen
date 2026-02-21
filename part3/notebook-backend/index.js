const express = require("express")
const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`)
})