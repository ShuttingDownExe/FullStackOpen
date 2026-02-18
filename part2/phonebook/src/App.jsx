import { useState, useEffect } from 'react'
import personService from './services/personService'
import Notification from './components/Notifications'

const Persons = ({persons, isFilter, onDelete}) => {
  return (
    <ul>
      {
        persons.map(p => 
          <li key={p.id}>{p.name} : {p.number} 
          {
            isFilter ? 
            "" : 
            <button onClick={() => onDelete(p.id)}>delete</button>
          }</li>
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
        <Persons persons={filteredPersons} isFilter={true}/>
      </div>
    </form>
  )
}

const PersonForm = ({newName, newPhone, 
        handlePersonTextChange, handlePhoneTextChange, onClick}) => {
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

  const hook = () => {
    personService
      .getAll()
      .then(
        response => {
          setPersons(response)
        }
      )
  }

  useEffect(hook,[])

  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState("info")

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
      id: String(Date.now())
    }
    const exists = persons.find(p => p.name === newName)
    if (!exists) {
      personService.create(personObject).then(
        () => {
          setPersons(persons.concat(personObject))
          setNewName("")
          setNewPhone("")
        }
      )
      setMessageType('info')
      setMessage(`${personObject.name} has been added`)
    } else {
      if (window.confirm(`${newName} is already added to the phonebook. 
        Replace the old number with a new one?`))
      {
        personService.update(exists.id, personObject).then(
          response => {
            setPersons(persons.map(person => 
              person.id !== exists.id ? person : response
            ))
            setNewName("")
            setNewPhone("")
            setMessageType('info')
            setMessage(`${personObject.name} has been modified`)
          }
        )
        .catch(
          error => {
            if (error?.response?.status == 404){
              setMessageType('error')
              setMessage(`${personObject.name} does not exist`)
            }
          }
        )
      }
    }
  }

  const onDelete = (id) => {
    if (window.confirm(`Delete ${persons.find(p => p.id === id).name} ?`)){
      personService.remove(id).then(() => {
        setPersons(() => {
          return persons.filter(p => p.id !== id)
        })}
        ).catch(error => {
        alert(`Unexpected Error: ${error}`)
      })
    }
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
      <Notification message={message} type={messageType}/>
      <h3>Filter</h3>
      <Filter 
        filterQuery={filterQuery} 
        handleFilterChange={handleFilterChange} 
        filteredPersons={filteredPersons} 
      />
      <h3>Form</h3>
      <PersonForm 
        newName={newName} 
        newPhone={newPhone} 
        handlePersonTextChange={handlePersonTextChange} 
        handlePhoneTextChange={handlePhoneTextChange} 
        onClick={onClick}
      />
      <h2>Numbers</h2>
      <Persons 
        persons={persons} 
        onDelete={onDelete}
      />
      <div>debug: {newName}</div>
    </div>
  )
}

export default App