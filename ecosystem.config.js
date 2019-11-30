const { name } = require('./package.json')

module.exports = {
  apps: [{
    name,
    script: './dist/main/index.js',
    env: {
      NODE_ENV: 'production'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    instances: 0,
    autorestart: true,
    watch: false
  }]
}