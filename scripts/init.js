const fs = require('fs')
const initialized = fs.existsSync('../../config/config.js') && fs.existsSync('../../cms/main.js') && fs.existsSync('../../cms/vue_router.js')

if (!initialized) {
  fs.mkdirSync('../../config')
  fs.mkdirSync('../../cms')
  fs.mkdirSync('../../cms/components')
  fs.mkdirSync('../../cms/views')

  fs.copyFileSync('./config/config.template.js', '../../config/config.js')
  fs.copyFileSync('./src/main.template.js', '../../cms/main.js')
  fs.copyFileSync('./src/router/index.template.js', '../../cms/vue_router.js')
  fs.copyFileSync('./src/components/UserDefinedViewsLinks.template.js', '../../cms/CustomRoutes.js')
  fs.copyFileSync('./modules/custom_routes.template.js', '../../cms/api_routes.js')
  fs.copyFileSync('./scripts/files/index.template.js', '../../index.js')
  fs.copyFileSync('./scripts/files/postbacks.template.js', '../../postbacks.js')
  fs.copyFileSync('./scripts/files/api.template.js', '../../cms/api.js')
  fs.copyFileSync('./scripts/files/nginx.conf', '../../config/nginx.conf')
  fs.copyFileSync('./scripts/files/boxfile.yml', '../../boxfile.yml')
  fs.copyFileSync('./scripts/files/Procfile', '../../Procfile')
  fs.copyFileSync('./scripts/files/.nanoignore', '../../.nanoignore')

  fs.writeFileSync('../../.gitignore', 'node_modules/', 'utf8')
  fs.writeFileSync('../../cms/components/.gitkeep', '', 'utf8')
  fs.writeFileSync('../../cms/views/.gitkeep', '', 'utf8')
} else {
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
}

// Fix PostCSS config lack in vue-material module
if (fs.existsSync('../flexboxgrid/')) fs.copyFileSync('./scripts/files/postcss.config.js', '../flexboxgrid/dist/postcss.config.js')

// Fix webpack watchpack not wathing symlinks
if (fs.existsSync('../watchpack/')) fs.copyFileSync('./scripts/files/DirectoryWatcher.js', '../watchpack/lib/DirectoryWatcher.js')

fs.symlinkSync('../../../config/config.js', './config/config.js')
fs.symlinkSync('../../../cms/main.js', './src/main.js')
fs.symlinkSync('../../../../cms/vue_router.js', './src/router/index.js')
fs.symlinkSync('../../../cms/api_routes.js', './modules/custom_routes.js')
fs.symlinkSync('../../../../cms/CustomRoutes.js', './src/components/UserDefinedViewsLinks.js')
