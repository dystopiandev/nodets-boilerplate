export interface RegistrationPayload {
  email: string
  username: string
  firstName?: string
  lastName?: string
  password: string
}

export interface LoginPayload {
  email?: string
  username?: string
  password: string
}
