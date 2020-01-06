import { Request, Response } from 'express'
import * as authService from '../services/auth'
import { respond } from '../lib/respond'
import { AppError } from '../lib/errors/AppError'

export async function createSession (req: Request, res: Response) {
  authService.authenticate({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  })
    .then(user => {
      req.session!.user = user
      respond(res, 200, null, user.id)
    })
    .catch(err => {
      respond(res, err.getStatus(), [err])
    })
}

export async function deleteSession (req: Request, res: Response) {
  // destroy session
  if (req.session!.user) {
    req.session!.destroy((err => {
      if (err) {
        return respond(res, 500, [new AppError({ message: 'Server error!', status: 500 })])
      }

      respond(res, 200, null, null)
    }))
  } else respond(res, 403, [new AppError({ message: 'No session to destroy!', status: 403 })])
}