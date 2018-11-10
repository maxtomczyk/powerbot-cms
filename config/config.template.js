let config = {}

config.facebook = {}
config.database = {}
config.jwt = {}
config.app = {}
config.redis = {}
config.features = {}

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
  postbacksTable: process.env.RT_POSTBACKS || 15
}

config.features.registerUnknownPhrases = true || process.env.FEATURE_REGISTER_UNKNOWN_PHRASES

module.exports = config
