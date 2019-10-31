# Node Typescript Boilerplate

## Components
- HTTP server: ExpressJS
- ORM: TypeORM

## External dependencies
- Redis server
- PostgreSQL server or MySQL server

## Configuration
Create `local.json5` or `production.json5` with the contents of `local.json5.example` and configure accordingly.

## Scripts
- `npm run dev` - Run live with `ts-node`, with live reload over `nodemon`
- `npm run build` - Build with `tsc`
- `npm run built` - Run built JS output in `./dist`

## Routes
If API prefix is set in configuration, it must be prepended to all routes. E.g. If API prefix is `api`, `/session` becomes `/api/session`

- [POST] **/api/session** -> Consume `username` or `email` and `password` to create cookie-based session (login)
- [DELETE] **/api/session** -> Delete session (logout)
- [POST] **/api/users** -> Create user (with `email` and/or `username` and `password`) based on `User` entity spec (registration)
- [GET] **/api/users/self** -> Describe owner of current session (profile)
- [DELETE] **/api/users/< user ID >** -> Delete user account (account deactivation), but deleted resource will only change state. Requires `User.role`: ADMIN
