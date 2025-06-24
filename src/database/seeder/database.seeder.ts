import { UserEntity } from '../../entities/user.entity';
import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export default class DatabaseSeeder {

  private readonly logger = new Logger(DatabaseSeeder.name);
  
  constructor(private userService: UserService) {}

  async seed() {
    await this.seedUsers();
  }

  private async seedUsers() {
    this.logger.log('Seeding users...');

    const users = [
      {
        username: 'admin',
        password: 'admin'
      },
    ];

    for (const userData of users) {
      const existingUser = await this.userService.findByUsername(userData.username);
      if (!existingUser) {
        await this.userService.createUser(
          userData.username,
          userData.password,
        );
        this.logger.log(`Created user: ${userData.username}`);
      } else {
        this.logger.log(`User already exists: ${userData.username}`);
      }
    }

    this.logger.log('Users seeding completed');
  }
}