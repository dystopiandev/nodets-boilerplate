import 'reflect-metadata'
import path from 'path'
import { Express } from 'express'
import { createConnection } from 'typeorm'
let cfgPaths = path.join(__dirname, '..', 'config')
cfgPaths += path.delimiter
cfgPaths += path.join(__dirname, '..', '..')
process.env['NODE_CONFIG_DIR'] = cfgPaths
const config = require('config')
const port:number = config.get('server').port
const { http }: {http: Express} = require('./lib/server')

createConnection({
  ...config.get('database'),
  synchronize: true,
  entities: [`${__dirname}/db/entity/*`]
}).then(() => {
  console.info(`Established database connection...`)

  http.listen(port, () => {
    console.info(`HTTP server is running on port ${port}`)
  })
}).catch(err => console.error('Database connection error:', err))