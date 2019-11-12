import config from 'config'
import expressSession from 'express-session'
const RedisStore = require('connect-redis')(expressSession)
import Redis, { RedisOptions } from 'ioredis'
const redisConnStr:any = config.get('redis.connStr')
const redisOptions:RedisOptions = {
  host: config.get('redis.host'),
  port: config.get('redis.port')
}
const redisClient = redisConnStr
  ? new Redis(redisConnStr)
  : new Redis(redisOptions)

export const session = expressSession({
  store: new RedisStore({ client: redisClient }),
  secret: config.get('api.secret'),
  resave: false,
  saveUninitialized: false
})