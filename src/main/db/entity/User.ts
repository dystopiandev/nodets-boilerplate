import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!:number
  
  @Column()
  email!:string
  
  @Column()
  passhash!:string
  
  @Column({ nullable: true })
  firstName!:string
  
  @Column({ nullable: true })
  lastName!:string
}