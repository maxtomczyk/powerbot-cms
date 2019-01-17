let config = {}

config.facebook = {}
config.database = {}
config.jwt = {}
config.app = {}
config.redis = {}
config.features = {}
config.settings = {}
config.email = {}

config.facebook.access_token = process.env.FB_ACCESS || ''

config.database.host = process.env.DB_HOST || 'localhost'
config.database.user = process.env.DB_USER || 'postgres'
config.database.password = process.env.DB_PASSWORD || ''
config.database.name = process.env.DB_NAME || ''

config.jwt.secret = process.env.JWT_SECRET || 'jwt_secret'

config.app.logLevel = process.env.LOG_LEVEL || 'silly'
config.app.logPrefix = process.env.LOG_PREFIX || 'incredbot-cms'

config.redis.url = process.env.REDIS_URL || ''
config.redis.prefix = process.env.REDIS_PREFIX || 'incredbot-cms::'
config.redis.timeouts = {
  messages: process.env.RT_MESSAGES || 15,
  regexTable: process.env.RT_REGEX || 15,
  postbacksTable: process.env.RT_POSTBACKS || 15,
  defaultLanguage: process.env.RT_DEF_LANG || 15,
  attachments: process.env.RT_ATTACHMENTS || 15
}

config.features.registerUnknownPhrases = true || process.env.FEATURE_REGISTER_UNKNOWN_PHRASES

config.settings.defaultGender = process.env.DEFAULT_GENDER || 'male'
config.settings.usersAdditionalData = process.env.USERS_DATA || ''
config.settings.statsCollectorTimezone = process.env.STATS_COLLECTOR_TIMEZONE || 'Europe/Warsaw'
config.settings.useModeratorHours = process.env.USE_MODERATOR_HOURS || false
config.settings.cmsUrl = process.env.CMS_URL || 'http://localhost:3000'
config.settings.chatRequestEmail = process.env.CHAT_REQUEST_EMAIL || false

config.email.host = process.env.EMAIL_HOST || ''
config.email.port = process.env.EMAIL_PORT || ''
config.email.sender = process.env.EMAIL_SENDER || ''
config.email.login = process.env.EMAIL_LOGIN || ''
config.email.password = process.env.EMAIL_PASSWORD || ''
config.email.app_name = process.env.EMAIL_APP_NAME || ''

module.exports = config
