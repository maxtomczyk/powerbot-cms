const CronJob = require('cron').CronJob
const Stats = require('./models/Stats')
const dbDumper = require('./db_dump')
const logger = require('./logger')
const config = require('../config/config')

const cronTimezone = config.settings.statsCollectorTimezone || 'Europe/London'

const stats = new Stats()

function start () {
  let mediumResolutionStatsSave = new CronJob(`0 */10 * * * *`, async function () {
    try {
      logger.silly('Starting medium resolution statistics data save job.')
      await stats.saveMediumResolutionData()
      logger.silly('Medium resolution data saved.')
    } catch (e) {
      logger.error('An error occured during medium resolution statistics data save')
      console.error(e)
    }
  }, null, true, cronTimezone)

  let dailyResolutionStatsSave = new CronJob(`0 0 0 * * *`, async function () {
    try {
      logger.info('Starting daily statistics data save job.')
      await stats.saveDailyResolutionData()
      logger.info('Daily data saved.')
    } catch (e) {
      logger.error('An error occured during daily statistics data save')
      console.error(e)
    }
  }, null, true, cronTimezone)

  let weeklyResolutionStatsSave = new CronJob(`0 0 0 * * 1`, async function () {
    try {
      logger.info('Starting weekly statistics data save job.')
      await stats.saveWeeklyResolutionData()
      logger.info('Weekly data saved.')
    } catch (e) {
      logger.error('An error occured during weekly statistics data save')
      console.error(e)
    }
  }, null, true, cronTimezone)

  let monthlyResolutionStatsSave = new CronJob(`0 0 0 1 * *`, async function () {
    try {
      logger.info('Starting monthly statistics data save job.')
      await stats.saveMonthlyResolutionData()
      logger.info('Monthly data saved.')
    } catch (e) {
      logger.error('An error occured during monthly statistics data save')
      console.error(e)
    }
  }, null, true, cronTimezone)

  let dbDump = new CronJob(config.settings.dbDumpCron, async function () {
    try {
      await dbDumper.start()
    } catch (e) {
      console.error(e)
    }
  }, null, true, cronTimezone)


  logger.silly(`Medium resolution stats collector cron job status: ${mediumResolutionStatsSave.running}`)
  logger.silly(`Daily stats collector cron job status: ${dailyResolutionStatsSave.running}`)
  logger.silly(`Weekly stats collector cron job status: ${weeklyResolutionStatsSave.running}`)
  logger.silly(`Montlhy resolution stats collector cron job status: ${monthlyResolutionStatsSave.running}`)
  logger.silly(`Automatic database dump to S3 cron job status: ${dbDump.running}`)
}

module.exports = {
  start
}
