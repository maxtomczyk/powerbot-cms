const Email = require('email-templates')
const path = require('path')

const config = require('../config/config')

const root = path.join(__dirname, '..', 'emails')

const email = new Email({
  message: {
    from: config.email.sender
  },
  views: {
    root
  },
  send: true,
  transport: {
    // host: process.env.MAIL_HOST,
    // port: process.env.MAIL_PORT,
    // auth: {
    //   user: process.env.MAIL_USERNAME,
    //   pass: process.env.MAIL_PASSWORD
    // }
    jsonTransport: true
  },
  juice: true,
  juiceResources: {
    preserveImportant: true,
    webResources: {
      relativeTo: path.join(__dirname, '..', 'emails')
    }
  }
});

async function send(name, data) {
  let mailData = {}
  Object.assign(mailData, data)

  mailData.app_name = config.email.app_name
  mailData.cms_url = config.settings.cmsUrl
  email
    .send({
      template: `../emails/${name}`,
      message: {
        to: 'm.tomczyk.dev@gmail.com'
      },
      locals: mailData
    })
    .then(console.log)
    .catch(console.error);
}

module.exports = {
  send
}
