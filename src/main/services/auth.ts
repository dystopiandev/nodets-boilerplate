import bcrypt from 'bcrypt'
import { getRepository } from 'typeorm'
import { User, UserStatus } from '../database/entity/User'
import { AppError } from '../lib/errors/AppError'
import { LoginPayload } from '../../ts/types'

export async function authenticate (fields:LoginPayload):Promise<User> {
  const userRepo = getRepository(User)
  const user = await userRepo.findOne({
    where: [
      { username: fields.username },
      { email: fields.email }
    ],
    select: ['id', 'username', 'email', 'passhash', 'status']
  })

  return new Promise((resolve, reject) => {
    if (user) {
      bcrypt.compare(fields.password || '', user.passhash, (err:any, same:boolean) => {
        if (err) reject(new AppError({
          message: 'An unknown error occured!',
          status: 500
        }))

        if (!same) reject(new AppError({
          message: 'Invalid credentials!',
          status: 403
        }))

        if (user.status === UserStatus.BLOCKED) {
          return reject(new AppError({
            message: 'Account is blocked!',
            status: 403
          }))
        }

        if (user.status === UserStatus.DELETED) {
          return reject(new AppError({
            message: 'Account is deactivated!',
            status: 403
          }))
        }

        if (user.status === UserStatus.INACTIVE) {
          return reject(new AppError({
            message: 'Account is not activated!',
            status: 403
          }))
        }

        resolve(user)
      })
    } else reject(new AppError({
      message: 'Invalid credentials!',
      status: 403
    }))
  })
}