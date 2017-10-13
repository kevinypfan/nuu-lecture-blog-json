const config = require('./config.json')
var env = process.env.NODE_ENV || 'development';

if (env == 'development') {
  var envConfig = config[env]
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  })
}

if (env == 'product') {
  var envConfig = config[env]
  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  })
}
