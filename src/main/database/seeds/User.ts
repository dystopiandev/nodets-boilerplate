 
import { MigrationInterface, QueryRunner } from 'typeorm'
import { UserStatus, UserRole } from '../entity/User'
import { v4 as uuidv4 } from 'uuid'

export class UserSeed1515769694450 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    const users = []

    users.push({
      id: uuidv4(),
      email: 'user@domain.com',
      username: 'administrator',
      passhash: '$2b$08$yn2cysRLX7Iwcu06kCxcTOzKdRTKlz3aK6UcV6aFv90XNmbAn9olS',
      firstName: 'Administrator',
      lastName: 'One',
      status: UserStatus.ACTIVE,
      role: UserRole.SUPERADMIN
    })

    users.push({
      id: uuidv4(),
      email: 'user2@domain.com',
      username: 'administrator2',
      passhash: '$2b$08$yn2cysRLX7Iwcu06kCxcTOzKdRTKlz3aK6UcV6aFv90XNmbAn9olS',
      firstName: 'Administrator',
      lastName: 'Two',
      status: UserStatus.ACTIVE,
      role: UserRole.ADMIN,
      referrer: users[0]
    })

    await queryRunner
      .manager
      .createQueryBuilder()
      .insert()
      .into('User')
      .values(users)
      .execute()

  }

  async down(queryRunner: QueryRunner): Promise<any> { 
    // reverts things made in "up" method
  }
}