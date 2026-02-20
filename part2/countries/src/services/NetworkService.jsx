import axios from "axios";


const baseUrlAll = "https://studies.cs.helsinki.fi/restcountries/api/all"
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/name"

const weatherApi = import.meta.env.VITE_WEATHER_API
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather"


const getAll = () => {
    const request = axios.get(baseUrlAll)
    return request.then(response => response.data)
}

const getOne = (country) => {
    const request = axios.get(`${baseUrl}/${encodeURIComponent(country)}`)
    return request.then(response => response.data)
}

const getWeather = (lat, lng) => {
    const request = axios.get(
        `${weatherUrl}?lat=${lat}&lon=${lng}&units=metric&appid=${weatherApi}`
    )
    return request.then(response => response.data)
}

export default {getAll, getOne, getWeather}