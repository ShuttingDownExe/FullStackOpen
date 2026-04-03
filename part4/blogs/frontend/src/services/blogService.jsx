import axios from "axios"

const baseUrl = 'http://localhost:3001/api/blogs'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getOne = (id) => {
    const request = axios.get(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const create = createBlog => {
    const request = axios.post(baseUrl, createBlog)
    return request.then(response => response.data)
}

const update = (id, newObject) => {
    const request = axios.patch(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

const remove = id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

export default { getAll, getOne, create, update, remove }