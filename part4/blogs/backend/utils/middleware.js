const logger = require('./logger')
const util = require('node:util')

const prettyBody = (body) => {
  if(body == undefined || body == null) return body
  if (typeof body == 'string') {
    try {
      return JSON.stringify(JSON.parse(body), null, 2)
    } catch {
      return body
    }
  }
  return util.inspect(body, {depth:null, colors:false})
}

const requestLogger = (request, response, next) => {
  logger.info('Request')
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', prettyBody(request.body))

  response.on('finish', () => {
    logger.info('---')
    logger.info('Response')
    logger.info('Status:', response.statusCode)
    logger.info('Body:  ', prettyBody(response.body))
    logger.info('---')
  })

  const oldSend = response.send.bind(response)
  response.send = (body) => {
    response.body = body
    return oldSend(body)
  }

  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'SyntaxError' && error.status === 400 && 'body' in error) {
    return response.status(400).json({ error: 'invalid JSON' })
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    return response.status(400).json({ error: 'duplicate key error' })
  }

  return response.status(500).json({ error: 'internal server error' })
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}