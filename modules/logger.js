const winston = require('winston')

const config = require('../config/config')

let logger = winston.createLogger({
    level: config.app.logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            if (info.response && info.response.data && info.response.data.error) {
                return `${info.timestamp} [${config.app.logPrefix}][${info.level}]: ${info.message} - ${info.response.data.error.message}`
            }
            return `${info.timestamp} [${config.app.logPrefix}][${info.level}]: ${info.message}`;
        })
    ),
    exitOnError: false,
    transports: [
        new winston.transports.Console({
            handleExceptions: true
        })
    ]
})


module.exports = logger;
