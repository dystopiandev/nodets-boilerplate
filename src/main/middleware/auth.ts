import { Request, Response } from 'express'
import { User, UserRole, UserStatus } from '../database/entity/User'
import { respond } from '../lib/respond'
import { AppError } from '../lib/errors/AppError'
import * as userService from '../services/user'

export async function checkAuth (req:Request, res:Response, next:Function) {
  const sessUser:User = req.session!.user
  const user = sessUser
    ? await userService.fetchUser({ id: sessUser.id })
    : null

  if (user) {
    if (user.status === UserStatus.BLOCKED) {
      return respond(res, 401, [new AppError({ message: 'Account is blocked!', status: 401 })])
    }

    if (user.status === UserStatus.DELETED) {
      return respond(res, 401, [new AppError({ message: 'Account is deactivated!', status: 401 })])
    }

    if (user.status === UserStatus.INACTIVE) {
      return respond(res, 401, [new AppError({ message: 'Account is not activated!', status: 401 })])
    }

    req.session!.user = user
    return next()
  }
  else respond(res, 401, [new AppError({ message: 'Unauthorized!', status: 401 })])
}

export function isAdmin (req:Request, res:Response, next:Function) {
  const user:User = req.session!.user

  if (
    user &&
    (
      user.role === UserRole.ADMIN ||
      user.role === UserRole.SUPERADMIN
    )
  ) return next()
  else respond(res, 401, [new AppError({ message: 'Unauthorized!', status: 401 })])
}

export function isSuperAdmin (req:Request, res:Response, next:Function) {
  const user:User = req.session!.user

  if (
    user &&
    user.role === UserRole.SUPERADMIN
  ) return next()
  else respond(res, 401, [new AppError({ message: 'Unauthorized!', status: 401 })])
}