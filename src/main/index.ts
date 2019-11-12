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
const { http }: {http: Express} = require('./server')

createConnection({
  ...config.get('database'),
  synchronize: true,
  entities: [`${__dirname}/database/entity/*`]
}).then(async () => {
  console.info(`Established database connection...`)

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

  http.listen(port, () => {
    console.info(`HTTP server is running on port ${port}`)
  })
}).catch(err => console.error('Database connection error:', err))