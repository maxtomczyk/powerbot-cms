const CronJob = require('cron').CronJob
const Stats = require('./models/Stats')
const logger = require('./logger')
const config = require('../config/config')

const cronTimezone = config.settings.statsCollectorTimezone || 'Europe/London'

const stats = new Stats()

function start () {
  let mediumResolutionStatsSave = new CronJob(`0 */10 * * * *`, async function () {
    try {
      logger.debug('Starting medium resolution statistics data save job.')
      await stats.saveMediumResolutionData()
      logger.debug('Medium resolution data saved.')
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

  logger.debug(`Medium resolution stats collector cron job started: ${mediumResolutionStatsSave.running}`)
  logger.debug(`Daily stats collector cron job started: ${dailyResolutionStatsSave.running}`)
  logger.debug(`Weekly stats collector cron job started: ${weeklyResolutionStatsSave.running}`)
  logger.debug(`Montlhy resolution stats collector cron job started: ${monthlyResolutionStatsSave.running}`)
}

module.exports = {
  start
}
