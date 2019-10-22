import bcrypt from 'bcrypt'
import { getRepository } from 'typeorm'
import { User, UserStatus } from '../../db/entity/User';
import { AppError } from '../errors/AppError';

export async function createUser (fields:any):Promise<User> {
  const userRepo = getRepository(User)
  const user = await userRepo.findOne({
    where: [
      { email: fields.email },
      { username: fields.username }
    ]
  })

  return new Promise((resolve, reject) => {
    if (user) {
      const matchedField = user.email === fields.email
        ? 'E-mail'
        : 'Username'
      reject(new AppError({
        message: `${matchedField} is already registered!`,
        status: 403
      }))
    } else {
      bcrypt.hash(fields.password, 8, (err:any, passhash:any) => {
        if (err) reject(new AppError({
          message: 'An unexpected error occured!',
          status: 403
        }))
  
        userRepo.save(userRepo.create({
          email: fields.email,
          username: fields.username,
          passhash
        }))
          .then(user => resolve(user))
          .catch(err => reject(new AppError({
            message: 'An unexpected error occured!',
            status: 403
          })))
      })
    }
  })
}

export async function fetchUser (query:any):Promise<User> {
  const userRepo = getRepository(User)
  const user = await userRepo.findOne({
    where: [
      { id: query.id },
      { username: query.username },
      { email: query.email }
    ]
  })

  return new Promise((resolve, reject) => {
    if (user) {
      resolve(user)
    } else reject(new AppError({
      message: 'User not found!',
      status: 403
    }))
  })
}

export async function fetchUserProfile (query:any):Promise<any> {
  const userRepo = getRepository(User)
  const user = await userRepo.findOne({
    where: [
      { id: query.id },
      { username: query.username },
      { email: query.email }
    ]
  })

  return new Promise((resolve, reject) => {
    if (user) {
      resolve({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      })
    } else reject(new AppError({
      message: 'User not found!',
      status: 403
    }))
  })
}

export async function deleteUser (fields:any):Promise<User> {
  const userRepo = getRepository(User)
  const user = await userRepo.findOne({
    where: [
      { id: fields.id },
      { email: fields.email },
      { username: fields.username }
    ]
  })

  return new Promise((resolve, reject) => {
    if (user) {
      if (user.status === UserStatus.DELETED) {
        return reject(new AppError({ message: 'Account is already deactivated!', status: 403 }))
      }

      user.status = UserStatus.DELETED
      resolve(userRepo.save(user))
    }
  
    reject(new AppError({ message: 'Not found!', status: 404 }))
  })
}