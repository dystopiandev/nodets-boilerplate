import { Request, Response } from 'express'
import * as userService from '../services/user'
import { respond } from '../lib/respond'

export async function fetchSelf (req: Request, res: Response) {
  userService.fetchUserProfile({
    id: req.session!.user.id
  })
    .then(userProfile => {
      respond(res, 200, null, userProfile)
    })
    .catch(err => {
      respond(res, err.getStatus(), [err])
    })
}

export async function registerUser (req: Request, res: Response) {
  userService.createUser({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  })
    .then(user => {
      respond(res, 200, null, user.id)
    })
    .catch(err => {
      respond(res, err.getStatus(), [err])
    })
}

export async function deleteUser (req: Request, res: Response) {
  userService.deleteUser({ id: req.params.userId })
    .then(user => {
      respond(res, 200, null, user.id)
    })
    .catch(err => {
      respond(res, err.getStatus(), [err])
    })
}