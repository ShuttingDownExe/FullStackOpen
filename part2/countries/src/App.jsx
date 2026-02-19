import { useEffect, useState } from "react"

import NetworkService from './services/NetworkService'

const SearchBar = ({onChange}) => {
  return (
    <input onChange={onChange}></input>
  )
}

const Filter = ({Countries}) => {
  if (Countries.length >= 10){
    return(
      <p>Too many matches, Specify another filter</p>
    )
  }

  return (
    <ul>
      {Countries.map(c => <li key={c}>{c}</li>)}
    </ul>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    NetworkService
      .getAll()
      .then(response => {
        setCountries(response.map(c => c.name.common))
      })
  },[])

  const onChange = (event) => {
    var input = event.target.value.toLowerCase()
    setFilteredCountries(countries.filter(c => c.toLowerCase().includes(input)))
    console.log(event.target.value)
  }

  return (
    <div>
      <SearchBar onChange={onChange}/>
      <Filter Countries={filteredCountries}/>
    </div>
  )
}

export default App
