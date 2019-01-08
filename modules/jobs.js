const cron = require('cron')
const CronJob = require('cron').CronJob
const Stats = require('./models/Stats')
const logger = require('./logger')

const stats = new Stats()
let mediumResolutionStatsSave = new CronJob(`0 */10 * * * *`, async function () {
  try {
    logger.debug('Starting medium resolution statistics data save job.')
    await stats.saveMediumResolutionData()
    logger.debug('Medium resolution data saved.')
  } catch (e) {
    logger.error('An error occured during medium resolution statistics data save')
    console.error(e)
  }
}, null, true);

let dailyResolutionStatsSave = new CronJob(`0 0 0 * * *`, async function () {
  try {
    logger.info('Starting daily statistics data save job.')
    await stats.saveDailyResolutionData()
    logger.debug('Daily data saved.')
  } catch (e) {
    logger.error('An error occured during daily statistics data save')
    console.error(e)
  }
}, null, true);

let weeklyResolutionStatsSave = new CronJob(`0 0 0 * * 0`, async function () {
  try {
    logger.info('Starting weekly statistics data save job.')
    await stats.saveWeeklyResolutionData()
    logger.debug('Weekly data saved.')
  } catch (e) {
    logger.error('An error occured during weekly statistics data save')
    console.error(e)
  }
}, null, true);

function start() {

}

module.exports = {
  start
}
