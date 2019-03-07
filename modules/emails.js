const Email = require('email-templates')
const nodemailer = require('nodemailer')
const inlineBase64 = require('nodemailer-plugin-inline-base64')
const path = require('path')
const knex = require('./knex')
const logger = require('./logger')

const config = require('../config/config')

const root = path.join(__dirname, '..', 'emails')

let mailTransport = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  auth: {
    user: config.email.login,
    pass: config.email.password
  }
})
mailTransport.use('compile', inlineBase64());

const email = new Email({
  message: {
    from: config.email.sender
  },
  views: {
    root
  },
  send: true,
  transport: mailTransport,
  juice: true,
  juiceResources: {
    preserveImportant: true,
    webResources: {
      relativeTo: path.join(__dirname, '..', 'emails')
    }
  }
});

async function broadcastChatRequestMail(data) {
  try {
    let mailData = {}
    const admins = await knex('admins').where('chat_requests_notifications', true).andWhereNot('email', null)
    Object.assign(mailData, data)

    logger.debug('Broadcasting chat request e-mail notification')

    for (admin of admins) {
      if (admin.email.length < 5) continue;
      mailData.app_name = config.email.app_name
      mailData.cms_url = config.settings.cmsUrl
      mailData.admin_name = admin.name.split(' ')[0]

      let emailConfig = {
        template: `../emails/new_chat_request`,
        message: {
          to: admin.email
        },
        locals: mailData
      }
      await email.send(emailConfig)
    }
  } catch (e) {
    logger.error(e)
  }
}

async function broadcastWeeklyStats(data) {
  try {
    let mailData = {}
    const admins = await knex('admins').where('weekly_email_reports', true).andWhereNot('email', null)
    Object.assign(mailData, data)

    mailData.formed_date = new Date(data.start).toLocaleDateString()

    logger.info('Broadcasting weekly stats e-mail notification')

    for (admin of admins) {
      if (admin.email.length < 5) continue;
      mailData.app_name = config.email.app_name
      mailData.cms_url = config.settings.cmsUrl
      mailData.admin_name = admin.name.split(' ')[0]
      if (mailData.all_users) mailData.active_users = (Math.round((data.unique_users / data.all_users) * 100) * 100) / 100
      else mailData.active_users = 0

      let emailConfig = {
        template: `../emails/weekly_report`,
        message: {
          to: admin.email
        },
        locals: mailData
      }
      await email.send(emailConfig)
    }
  } catch (e) {
    console.error(e)
  }
}

async function broadcastMonthlyStats(data) {
  try {
    let mailData = {}
    const admins = await knex('admins').where('monthly_email_reports', true).andWhereNot('email', null)
    Object.assign(mailData, data)

    mailData.formed_date = new Date(data.start).toLocaleDateString()

    logger.info('Broadcasting monthly stats e-mail notification')

    for (admin of admins) {
      if (admin.email.length < 5) continue;
      mailData.app_name = config.email.app_name
      mailData.cms_url = config.settings.cmsUrl
      mailData.admin_name = admin.name.split(' ')[0]
      if (mailData.all_users) mailData.active_users = (Math.round((data.unique_users / data.all_users) * 100) * 100) / 100
      else mailData.active_users = 0

      let emailConfig = {
        template: `../emails/monthly_report`,
        message: {
          to: admin.email
        },
        locals: mailData
      }
      await email.send(emailConfig)
    }
  } catch (e) {
    console.error(e)
  }
}


module.exports = {
  broadcastChatRequestMail,
  broadcastWeeklyStats,
  broadcastMonthlyStats
}
