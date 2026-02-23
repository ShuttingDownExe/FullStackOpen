import { useEffect, useState } from "react"

import NetworkService from './services/NetworkService'

const SearchBar = ({onChange}) => {
  return (
    <input onChange={onChange}></input>
  )
}

const Filter = ({Countries, onShowCountry}) => {
  const [countryJson, setCountryJson] = useState(null)
  const [weatherJson, setWeatherJson] = useState(null)

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

  useEffect(() => {
    if(countryJson?.latlng){
      const [lat, lng] = countryJson.latlng
      NetworkService.getWeather(lat,lng).then(
        data => {
          setWeatherJson(data)
        }
      )
    } else {
      setWeatherJson(null)
    }
  },[countryJson])

  if (Countries.length >= 10){
    return(
      <pre>Too many matches, Specify another filter</pre>
    )
  }

  if (Countries.length === 1){
    if(countryJson && weatherJson) {
      const Name = countryJson.name.common
      const Capital = countryJson.capital?.[0] ?? "N/A"
      const Area = countryJson.area
      const Languages = countryJson.languages
      const imgUrl = countryJson.flags.png

      console.log(weatherJson)

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
          <h1>Weather in {Capital}</h1>
          <p>Temparature {weatherJson.main.temp}</p>
          <img src={`https://openweathermap.org/img/wn/${weatherJson.weather[0].icon}@2x.png`}/>
          <p>wind {weatherJson.wind.speed}</p>
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
      {Countries.map(c => <li key={c}>{c}<button onClick={() => onShowCountry(c)}>show</button></li>)}
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

  const onShowCountry = (countryName) => {
    setFilteredCountries([countryName])
  }

  return (
    <div>
      <SearchBar onChange={onChange}/>
      <Filter Countries={filteredCountries} onShowCountry={onShowCountry}/>
    </div>
  )
}

export default App  