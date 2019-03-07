const winston = require('winston')
const S3StreamLogger = require('s3-streamlogger').S3StreamLogger

const config = require('../config/config')

let transports = [
  new winston.transports.Console({
    handleExceptions: true
  })
]

if (config.s3.streamLogs) {
  const s3Stream = new S3StreamLogger({
    bucket: config.s3.bucketName,
    folder: config.s3.logsCatalog,
    access_key_id: config.s3.accessKeyId,
    secret_access_key: config.s3.secretAccessKey,
    name_format: '%Y-%m-%d_%H:%M:%S:%L.log',
    rotate_every: 108000000 // 30 hours
  })

  transports.push(
    new (winston.transports.File)({
      stream: s3Stream
    }))
}

let logger = winston.createLogger({
  level: config.app.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      if (info.response && info.response.data && info.response.data.error) {
        return `${info.timestamp} [${config.app.logPrefix}][${info.level}]: ${info.message} - ${info.response.data.error.message}`
      }
      return `${info.timestamp} [${config.app.logPrefix}][${info.level}]: ${info.message}`
    })
  ),
  exitOnError: false,
  transports
})

module.exports = logger
