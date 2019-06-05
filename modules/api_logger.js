const winston = require('winston')
const S3StreamLogger = require('s3-streamlogger').S3StreamLogger

const logger = require('./logger')
const config = require('../config/config')

let transports = [
  new winston.transports.Console({
    handleExceptions: true
  })
]

if (config.s3.streamLogs) {
  const s3Stream = new S3StreamLogger({
    bucket: config.s3.bucketName,
    folder: `${config.s3.logsCatalog}api`,
    access_key_id: config.s3.accessKeyId,
    secret_access_key: config.s3.secretAccessKey,
    name_format: '%Y-%m-%d_%H:%M:%S:%L.log',
    rotate_every: 108000000 // 30 hours
  })

  transports.push(
    new (winston.transports.Stream)({
      stream: s3Stream
    }))
}

let apiLogger = winston.createLogger({
  level: config.app.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      if (info instanceof Error && info.stack) {
        logger.error(info)
        if (process.env.NODE_ENV !== 'production') return ''
      }
      if (info.response && info.response.data && info.response.data.error) {
        return `${info.timestamp} [${config.app.logPrefix}][${info.level}]: ${info.message} - ${info.response.data.error.message}`
      }
      return `${info.timestamp} [${config.app.logPrefix}][${info.level}]: ${info.message}`
    })
  ),
  exitOnError: false,
  transports
})

function log (lvl, msg, req) {
  if (req) {
    const ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(/, /)[0] : req.connection.remoteAddress
    if (ip) msg = `(${ip}) ${msg}`
    if (req.user && req.user.id) msg = `(${req.user.id})${msg}`
  }

  switch (lvl) {
    case 'silly':
      apiLogger.silly(msg)
      break
    case 'debug':
      apiLogger.debug(msg)
      break
    case 'info':
      apiLogger.info(msg)
      break
    case 'warn':
      apiLogger.warn(msg)
      break
    case 'error':
      apiLogger.error(msg)
      break
  }
}

module.exports = {
  silly: (msg, req) => log('silly', msg, req),
  debug: (msg, req) => log('debug', msg, req),
  info: (msg, req) => log('info', msg, req),
  warn: (msg, req) => log('warn', msg, req),
  error: (msg, req) => log('error', msg, req)
}
