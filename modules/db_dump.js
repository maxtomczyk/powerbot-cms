const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn
const config = require('../config/config')
const logger = require('./logger')

const S3 = new AWS.S3()

process.env.AWS_ACCESS_KEY_ID = config.s3.accessKeyId
process.env.AWS_SECRET_ACCESS_KEY = config.s3.secretAccessKey

function w (n) {
  n = n.toString()
  if (n.length === 1) return `0${n}`
  else return n
}

function start () {
  if (!config.s3.autoDbDump) return
  logger.info('Running database dump process...')
  const date = new Date()
  const fileName = `${config.database.name}_${date.getFullYear()}-${w(date.getMonth() + 1)}-${w(date.getDate())}_${w(date.getHours())}:${w(date.getMinutes())}:${w(date.getSeconds())}.sql`

  let filePath = fileName
  let command = null
  if (process.env.DATABASE_URL) command = `pg_dump --dbname=${process.env.DATABASE_URL} --file=${filePath} --format=c`
  else command = `pg_dump --dbname=postgresql://${config.database.user}:${config.database.password}@${config.database.host}/${config.database.name} --file=${filePath} --format=c`

  command = command.split(' ')
  const firstCmd = command[0]
  command.splice(0, 1)
  let pgDumpChild = spawn(firstCmd, command)

  pgDumpChild.on('exit', function (code) {
    if (code !== 0) {
      logger.error('An error occured when running pg_dump command.')
      throw new Error(`pg_dump: Bad exit code - ${code})`)
    }
    S3.putObject({
      Bucket: config.s3.bucketName,
      Key: `${path.join(config.s3.dumpsCatalog, fileName)}`,
      ACL: 'private',
      Body: fs.createReadStream(filePath)
    }, function handlePutObject (err, data) {
      if (err) {
        logger.error('An error occured when tried to upload database dump to S3.')
        throw err
      } else {
        logger.info(`Database dump ${fileName} is now safe on S3 instance.`)
      }
      fs.unlinkSync(filePath)
    })
  })
}

module.exports = { start }
