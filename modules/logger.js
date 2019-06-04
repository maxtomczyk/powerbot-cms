const winston = require('winston')
const S3StreamLogger = require('s3-streamlogger').S3StreamLogger

const config = require('../config/config')

let transports = [
  new winston.transports.Console({
    handleExceptions: true
  })
]

let errorTransports = []

if (process.env.NODE_ENV !== 'production') {
  errorTransports.push(new winston.transports.Console({
    handleExceptions: true
  }))
}

if (config.s3.streamLogs) {
  const s3Stream = new S3StreamLogger({
    bucket: config.s3.bucketName,
    folder: `${config.s3.logsCatalog}chatbot/`,
    access_key_id: config.s3.accessKeyId,
    secret_access_key: config.s3.secretAccessKey,
    name_format: '%Y-%m-%d_%H:%M:%S:%L.log',
    rotate_every: 108000000 // 30 hours
  })

  const s3ErrorStream = new S3StreamLogger({
    bucket: config.s3.bucketName,
    folder: `${config.s3.logsCatalog}errors/`,
    access_key_id: config.s3.accessKeyId,
    secret_access_key: config.s3.secretAccessKey,
    name_format: '%Y-%m-%d_%H:%M:%S:%L.log',
    rotate_every: 108000000 // 30 hours
  })

  transports.push(
    new (winston.transports.Stream)({
      stream: s3Stream
    }))

  errorTransports.push(
    new (winston.transports.Stream)({
      stream: s3ErrorStream
    }))
}

let errorLogger = winston.createLogger({
  level: config.app.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      if (info instanceof Error && info.stack) {
        return `${info.timestamp} [${config.app.logPrefix}][${info.level}]: ${info.message}\n${info.stack}\n`
      }
      return ''
    })
  ),
  exitOnError: false,
  transports: errorTransports
})

let logger = winston.createLogger({
  level: config.app.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      if (info.response && info.response.data && info.response.data.error) {
        return `${info.timestamp} [${config.app.logPrefix}][${info.level}]: ${info.message} - ${info.response.data.error.message}`
      }
      if (info instanceof Error && info.stack) {
        errorLogger.error(info)
        if (process.env.NODE_ENV !== 'production') return ''
      }
      return `${info.timestamp} [${config.app.logPrefix}][${info.level}]: ${info.message}`
    })
  ),
  exitOnError: false,
  transports
})

module.exports = logger
