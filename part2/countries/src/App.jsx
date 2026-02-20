import { useEffect, useState } from "react"

import NetworkService from './services/NetworkService'

const SearchBar = ({onChange}) => {
  return (
    <input onChange={onChange}></input>
  )
}

const Filter = ({Countries}) => {
  const [countryJson, setCountryJson] = useState(null)

  useEffect(() => {
    if (Countries.length ==1) {
      NetworkService.getOne(Countries[0]).then(
        data => {
          setCountryJson(data)
        }
      )
    } else {
      setCountryJson(null)
    }
  },[Countries])

  if (Countries.length >= 10){
    return(
      <pre>Too many matches, Specify another filter</pre>
    )
  }

  if (Countries.length == 1){
    if(countryJson) {
      const Name = countryJson.name.common
      const Capital = countryJson.capital
      const Area = countryJson.area
      const Languages = countryJson.languages
      const imgUrl = countryJson.flags.png

      return (
        <div>
          <h1>{Name}</h1>
          <p>Capital {Capital}</p>
          <p>Area {Area}</p>
          <h1>Languages</h1>
          <ul>
            {
              Object.values(Languages).map((lang) => (
                <li key={lang}>{lang}</li>
              ))
            }
          </ul>
          <img src={imgUrl}/>
        </div>
      )
    } else {
      return(
      <p>
        Loading...
      </p>
    )
    }
  }

  return (
    <ul>
      {Countries.map(c => <li key={c}>{c}<button>show</button></li>)}
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
