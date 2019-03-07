const fs = require('fs')

if (!fs.existsSync('../../config')) fs.mkdirSync('../../config')
if (!fs.existsSync('../../cms')) fs.mkdirSync('../../cms')
if (!fs.existsSync('../../cms/components')) fs.mkdirSync('../../cms/components')
if (!fs.existsSync('../../cms/views')) fs.mkdirSync('../../cms/views')
if (!fs.existsSync('../../migrations')) fs.mkdirSync('../../migrations')

if (!fs.existsSync('../../config/config.js')) fs.copyFileSync('./config/config.template.js', '../../config/config.js')
if (!fs.existsSync('../../cms/main.js')) fs.copyFileSync('./src/main.template.js', '../../cms/main.js')
if (!fs.existsSync('../../cms/vue_router.js')) fs.copyFileSync('./src/router/index.template.js', '../../cms/vue_router.js')
if (!fs.existsSync('../../cms/CustomRoutes.js')) fs.copyFileSync('./src/components/UserDefinedViewsLinks.template.js', '../../cms/CustomRoutes.js')
if (!fs.existsSync('../../cms/api_routes.js')) fs.copyFileSync('./modules/custom_routes.template.js', '../../cms/api_routes.js')
if (!fs.existsSync('../../index.js')) fs.copyFileSync('./scripts/files/index.template.js', '../../index.js')
if (!fs.existsSync('../../postbacks.js')) fs.copyFileSync('./scripts/files/postbacks.template.js', '../../postbacks.js')
if (!fs.existsSync('../../cms/api.js')) fs.copyFileSync('./scripts/files/api.template.js', '../../cms/api.js')
if (!fs.existsSync('../../config/nginx.conf')) fs.copyFileSync('./scripts/files/nginx.conf', '../../config/nginx.conf')
if (!fs.existsSync('../../boxfile.yml')) fs.copyFileSync('./scripts/files/boxfile.yml', '../../boxfile.yml')
if (!fs.existsSync('../../Procfile')) fs.copyFileSync('./scripts/files/Procfile', '../../Procfile')
if (!fs.existsSync('../../.nanoignore')) fs.copyFileSync('./scripts/files/.nanoignore', '../../.nanoignore')
if (!fs.existsSync('../../knexfile.js')) fs.copyFileSync('./scripts/files/knexfile.js', '../../knexfile.js')
if (!fs.existsSync('../../nlp.js')) fs.copyFileSync('./scripts/files/nlp.js', '../../nlp.js')
if (!fs.existsSync('../../nodemon.json')) fs.copyFileSync('./scripts/files/nodemon.json', '../../nodemon.json')

if (!fs.existsSync('../../.gitignore')) fs.writeFileSync('../../.gitignore', 'node_modules/\n.yarn/\ngapi_key.json', 'utf8')
if (!fs.existsSync('../../cms/components/.gitkeep')) fs.writeFileSync('../../cms/components/.gitkeep', '', 'utf8')
if (!fs.existsSync('../../cms/views/.gitkeep')) fs.writeFileSync('../../cms/views/.gitkeep', '', 'utf8')
if (!fs.existsSync('../../migrations/.gitkeep')) fs.writeFileSync('../../migrations/.gitkeep', '', 'utf8')

const views = fs.readdirSync('../../cms/views')
const components = fs.readdirSync('../../cms/components')

for (const view of views) {
  if (view === '.gitkeep') continue
  fs.symlinkSync(`../../../../cms/views/${view}`, `./src/views/${view}`)
}

for (const component of components) {
  if (component === '.gitkeep') continue
  fs.symlinkSync(`../../../../cms/components/${component}`, `./src/components/${component}`)
}

// Fix PostCSS config lack in vue-material module
if (fs.existsSync('../flexboxgrid/')) fs.copyFileSync('./scripts/files/postcss.config.js', '../flexboxgrid/dist/postcss.config.js')

// Fix webpack watchpack not wathing symlinks
if (fs.existsSync('../watchpack/')) fs.copyFileSync('./scripts/files/DirectoryWatcher.js', '../watchpack/lib/DirectoryWatcher.js')

if (!fs.existsSync('./config/config.js')) fs.symlinkSync('../../../config/config.js', './config/config.js')
if (!fs.existsSync('./src/main.js')) fs.symlinkSync('../../../cms/main.js', './src/main.js')
if (!fs.existsSync('./src/router/index.js')) fs.symlinkSync('../../../../cms/vue_router.js', './src/router/index.js')
if (!fs.existsSync('./modules/custom_routes.js')) fs.symlinkSync('../../../cms/api_routes.js', './modules/custom_routes.js')
if (!fs.existsSync('./src/components/UserDefinedViewsLinks.js')) fs.symlinkSync('../../../../cms/CustomRoutes.js', './src/components/UserDefinedViewsLinks.js')

if (fs.existsSync('../../package.json')) {
  let packageData = JSON.parse(fs.readFileSync('../../package.json', 'utf-8'))
  packageData.scripts.start = 'GOOGLE_APPLICATION_CREDENTIALS=./gapi_key.json node index.js'
  packageData.scripts.dev = 'GOOGLE_APPLICATION_CREDENTIALS=./gapi_key.json nodemon index.js'
  fs.writeFileSync('../../package.json', JSON.stringify(packageData, null, 2), 'utf-8')
}