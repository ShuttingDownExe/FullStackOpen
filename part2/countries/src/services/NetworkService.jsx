import axios from "axios";


const baseUrlAll = "https://studies.cs.helsinki.fi/restcountries/api/all"
const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/name/"

const getAll = () => {
    const request = axios.get(baseUrlAll)
    return request.then(response => response.data)
}

export default {getAll}