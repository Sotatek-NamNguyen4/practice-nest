import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private userService: UserService) {}

  async seed() {
    this.logger.log('Starting database seeding...');
    await this.seedUsers();
    this.logger.log('Database seeding completed successfully');
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