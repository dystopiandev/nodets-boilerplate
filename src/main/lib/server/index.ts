import config from 'config'
import { APP_ROUTES } from './routes'
import { session } from './session'
import express = require('express')
const app:any = express()

// register body parser MW
app.use(express.json())

// register session MW
app.use(session)

// register all application routes
APP_ROUTES.forEach(route => {
  const routePath = `/${config.get('api.prefix')}/${route.path}`.replace(/\/+/g, '/')
  let mw:any[]

  if (route.middleware) mw = route.middleware
  else mw = []
  
  app[route.method](
    routePath,
    ...mw,
    route.action
  )
})

module.exports = {
  http: app
}
