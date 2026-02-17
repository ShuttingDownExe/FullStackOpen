import { useState, useEffect } from 'react'
import axios from 'axios'

const Persons = ({persons}) => {
  return (
    <ul>
      {
        persons.map(p => 
          <li key={p.id}>{p.name} : {p.number}</li>
        )
      }
    </ul>
  )
}

const Filter = ({filterQuery, handleFilterChange, filteredPersons}) => {
  return (
    <form>
      <div>
        <input onChange={handleFilterChange} value={filterQuery}/>
      </div>
      <div>
        <Persons persons={filteredPersons}/>
      </div>
    </form>
  )
}

const PersonForm = ({newName, newPhone, handlePersonTextChange, handlePhoneTextChange, onClick}) => {
  return (
    <form>
      <div>
        name: <input onChange={handlePersonTextChange} value={newName}/>
      </div>
      <div>
        phone no: <input onChange={handlePhoneTextChange} value={newPhone}/>
      </div>
      <div>
        <button type="submit" onClick={onClick}>add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])


    useEffect(() => {
        console.log("Use Effect Triggered")
        axios.get('http://localhost:3001/persons').then(
            response => {
                console.log("Getting data")
                console.log(response.data)
                setPersons(response.data)
                console.log("Got data")
            }
        )
    }, []);

  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterQuery, setFilterQuery] = useState('')

  const onClick = (event) => {
    event.preventDefault()
    const blank = newName === "" || newPhone === "";
    if (blank) {
      alert("Blank details!")
      return
    }
    const personObject = {
      name: newName,
      number: newPhone,
      id: Date.now()
    }
    const exists = persons.some(p => p.name === newName)
    if (!exists) {
      setPersons(persons.concat(personObject))
      setNewName("")
      setNewPhone("")
    } else alert(`${newName} is already added to the phonebook`)
  }

  const handlePersonTextChange = (event) => {
    console.log('name change:', event.target.value)
    setNewName(event.target.value)
  }

  const handlePhoneTextChange = (event) => {
    console.log('phone change:', event.target.value)
    setNewPhone(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log('filter change:', event.target.value)
    setFilterQuery(event.target.value)
  }

  const filteredPersons = persons.filter((person) => person.name.includes(filterQuery))

  

  return (
    <div>
      <h1>Phonebook</h1>
      <h3>Filter</h3>
      <Filter filterQuery={filterQuery} handleFilterChange={handleFilterChange} filteredPersons={filteredPersons} />
      <h3>Form</h3>
      <PersonForm newName={newName} newPhone={newPhone} handlePersonTextChange={handlePersonTextChange} handlePhoneTextChange={handlePhoneTextChange} onClick={onClick} />
      <h2>Numbers</h2>
      <Persons persons={persons}/>
      <div>debug: {newName}</div>
    </div>
  )
}

export default App