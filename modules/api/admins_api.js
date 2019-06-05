const argon2 = require('argon2')
const knex = require('../knex.js')
const validator = require('../validators')
const apiLogger = require('../api_logger')

async function list (req, res) {
  try {
    let admins = await knex('admins').select('id', 'name', 'login', 'owner', 'email', 'chat_requests_notifications', 'weekly_email_reports', 'monthly_email_reports').orderBy('id', 'asc')
    res.json(admins)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function create (req, res) {
  try {
    let body = req.body
    if (!validator.admin_account(body).valid) return res.sendStatus(400)
    if (body.password !== body.password_repeat) return res.sendStatus(400)
    delete body.password_repeat

    body.password = await argon2.hash(body.password)
    let [created] = await knex('admins').insert(body).returning('*')
    let adminId = created.id
    delete body.password

    body = created
    body.id = adminId
    apiLogger.info(`Created new admin account with login '${body.login}'.`, req)
    res.json(body)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function changePassword (req, res) {
  try {
    let body = req.body
    if (!validator.admin_password(body).valid) return res.sendStatus(400)
    if (body.new_password !== body.new_password_repeat) return res.sendStatus(400)

    let admin = await knex('admins').where('id', req.user.id).first()
    if (!await argon2.verify(admin.password, body.password)) return res.sendStatus(401)

    let newHash = await argon2.hash(body.new_password)
    await knex('admins').update('password', newHash).where('id', admin.id)
    apiLogger.info(`Changed password of account.`, req)
    res.sendStatus(200)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function deleteAdmin (req, res) {
  try {
    let id = req.body.id
    let owner = await knex('admins').where('id', req.user.id).andWhere('owner', true).first()
    let toDelete = await knex('admins').where('id', id).andWhere('owner', false).first()

    if (!owner || !toDelete) return res.sendStatus(401)
    await knex('admins').where('id', id).del()
    apiLogger.info(`Removed admin account with id '${id}'.`, req)
    res.sendStatus(200)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

async function accountSettings (req, res) {
  try {
    const id = req.body.id
    delete req.body.id
    delete req.body.login
    delete req.body.password
    delete req.body.owner
    const [updated] = await knex('admins').update(req.body).where('id', id).returning('*')
    apiLogger.info(`Changed admin account settings of account with id '${id}'.`, req)
    res.json(updated)
  } catch (e) {
    apiLogger.error(e)
    res.sendStatus(500)
  }
}

module.exports = {
  list,
  create,
  changePassword,
  deleteAdmin,
  accountSettings
}
