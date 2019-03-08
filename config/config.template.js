let config = {}

config.facebook = {}
config.database = {}
config.jwt = {}
config.app = {}
config.redis = {}
config.features = {}
config.settings = {}
config.email = {}
config.hosting = {}
config.dialogflow = {}
config.googleAuth = {}
config.s3 = {}

config.facebook.access_token = process.env.FB_ACCESS || ''

config.database.host = process.env.DB_HOST || process.env.DATA_POSTGRES_HOST || 'localhost'
config.database.user = process.env.DB_USER || process.env.DATA_POSTGRES_USER || 'postgres'
config.database.password = process.env.DB_PASSWORD || process.env.DATA_POSTGRES_PASS || ''
config.database.name = process.env.DB_NAME || process.env.DATA_POSTGRES_NAME || ''

config.jwt.secret = process.env.JWT_SECRET || 'jwt_secret'

config.app.logLevel = process.env.LOG_LEVEL || 'silly'
config.app.logPrefix = process.env.LOG_PREFIX || 'powerbot-cms'

config.redis.url = process.env.REDIS_URL || process.env.DATA_REDIS_HOST || ''
config.redis.prefix = process.env.REDIS_PREFIX || 'powerbot-cms::'
config.redis.timeouts = {
  messages: process.env.RT_MESSAGES || 15,
  regexTable: process.env.RT_REGEX || 15,
  postbacksTable: process.env.RT_POSTBACKS || 15,
  defaultLanguage: process.env.RT_DEF_LANG || 15,
  attachments: process.env.RT_ATTACHMENTS || 15
}

config.features.registerUnknownPhrases = process.env.FEATURE_REGISTER_UNKNOWN_PHRASES || true

config.settings.defaultGender = process.env.DEFAULT_GENDER || 'male'
config.settings.usersAdditionalData = process.env.USERS_DATA || ''
config.settings.statsCollectorTimezone = process.env.STATS_COLLECTOR_TIMEZONE || 'Europe/Warsaw'
config.settings.useModeratorHours = process.env.USE_MODERATOR_HOURS || false
config.settings.cmsUrl = process.env.CMS_URL || 'http://localhost:3000'
config.settings.useChatInProgressMessage = process.env.CHAT_IN_PROGRESS_MSG || false
config.settings.dbDumpCron = process.env.DB_DUMP_CRON_EXPRESSION || '0 30 4 * * 2,5'
config.settings.extendedSummary = process.env.EXTENDED_STARTUP_SUMMARY || false

config.email.host = process.env.EMAIL_HOST || ''
config.email.port = process.env.EMAIL_PORT || ''
config.email.sender = process.env.EMAIL_SENDER || ''
config.email.login = process.env.EMAIL_LOGIN || ''
config.email.password = process.env.EMAIL_PASSWORD || ''
config.email.app_name = process.env.EMAIL_APP_NAME || ''

config.hosting.provider = process.env.HOSTING_PROVIDER || ''

config.dialogflow.enable = process.env.DIALOGFLOW_ENABLED || false
config.dialogflow.sessionTimeout = process.env.DIALOGFLOW_SESSION_TIMEOUT || 1200
config.dialogflow.projectId = process.env.DIALOGFLOW_PROJECT_ID || ''
config.dialogflow.language = process.env.DIALOGFLOW_LANGUAGE || 'en-US'

config.googleAuth.type = process.env.GAUTH_TYPE || ''
config.googleAuth.project_id = process.env.GAUTH_PROJECT_ID || ''
config.googleAuth.private_key_id = process.env.GAUTH_PRIVATE_KEY_ID || ''
config.googleAuth.private_key = process.env.GAUTH_PRIVATE_KEY || ''
config.googleAuth.client_email = process.env.GAUTH_CLIENT_EMAIL || ''
config.googleAuth.client_id = process.env.GAUTH_CLIENT_ID || ''
config.googleAuth.auth_uri = process.env.GAUTH_AUTH_URI || ''
config.googleAuth.token_uri = process.env.GAUTH_TOKEN_URI || ''
config.googleAuth.auth_provider_x509_cert_url = process.env.GAUTH_AUTH_PROVIDER_X509_CERT_URL || ''
config.googleAuth.client_x509_cert_url = process.env.GAUTH_CLIENT_X509_CERT_URL || ''

config.s3.bucketName = process.env.S3_BUCKET_NAME || ''
config.s3.accessKeyId = process.env.S3_ACCESS_KEY_ID || ''
config.s3.secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || ''
config.s3.streamLogs = process.env.S3_STREAM_LOGS || false
config.s3.autoDbDump = process.env.S3_AUTO_DB_DUMP || false
config.s3.logsCatalog = process.env.S3_LOGS_CATALOG || ''
config.s3.dumpsCatalog = process.env.S3_DUMPS_CATALOG || ''

module.exports = config
