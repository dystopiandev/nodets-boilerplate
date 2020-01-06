import 'reflect-metadata'
import path from 'path'
import { Express } from 'express'
import { createConnection } from 'typeorm'
import gracefulShutdown from 'http-graceful-shutdown'
let cfgPaths = path.join(__dirname, '..', 'config')
cfgPaths += path.delimiter
cfgPaths += path.join(__dirname, '..', '..')
process.env['NODE_CONFIG_DIR'] = cfgPaths
const config = require('config')
const isMasterProcess = require('is-master-process')
const port:number = config.get('server').port
const { http }: {http: Express} = require('./lib/server')

createConnection({
  ...config.get('database'),
  synchronize: true,
  entities: [`${__dirname}/database/entity/*`]
}).then(async () => {
  console.info(`Established database connection...`)

  if (isMasterProcess) {
    const seedConn = await createConnection({
      ...config.get('database'),
      name: 'seed',
      synchronize: true,
      entities: [`${__dirname}/database/entity/*`],
      migrations: [`${__dirname}/database/seeds/*`]
    })
    
    await seedConn.runMigrations({
      transaction: false
    })
    await seedConn.close()
  }

  http.listen(port, () => {
    console.info(`HTTP server is running on port ${port}`)
  })

  gracefulShutdown(http,
    {
      signals: 'SIGINT SIGTERM',
      timeout: 30000,
      development: false,
      finally: function () {
        console.info('Server gracefully shutdown...')
      }
    }
  )
}).catch(err => console.error('Database connection error:', err))