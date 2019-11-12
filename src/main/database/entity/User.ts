import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin'
}

export enum UserStatus {
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  DELETED = 'deleted',
  BLOCKED = 'blocked'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!:string

  @Column({
    nullable: false,
    unique: true
  })
  email!:string

  @Column({
    nullable: true,
    unique: true
  })
  username!:string

  @Column({ select: false })
  passhash!:string

  @Column({ nullable: true })
  firstName!:string

  @Column({ nullable: true })
  lastName!:string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER
  })
  role!:UserRole

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INACTIVE
  })
  status!:UserStatus
}