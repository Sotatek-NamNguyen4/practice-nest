import { NestFactory } from '@nestjs/core';
import { SeederModule } from '../modules/seeder/seeder.module';
import { SeederService } from '../modules/seeder/seeder.service';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

async function setupDatabase() {
  const logger = new Logger('DatabaseSetup');
  
  try {
    logger.log('Starting database setup...');
    
    // Step 1: Run migrations
    logger.log('Step 1: Running database migrations...');
    const dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'secret',
      database: process.env.DB_DATABASE || 'task_manager',
      entities: [__dirname + '/../entities/*.entity.{ts,js}'],
      migrations: [__dirname + '/../database/migrations/*.ts'],
      migrationsTableName: 'migrations',
    });

    await dataSource.initialize();
    await dataSource.runMigrations();
    await dataSource.destroy();
    
    logger.log('Migrations completed successfully!');
    
    // Step 2: Run seeder
    logger.log('Step 2: Running database seeder...');
    const app = await NestFactory.create(SeederModule);
    
    const seederService = app.get(SeederService);
    await seederService.seed();
    
    logger.log('Database seeding completed successfully!');
    
    await app.close();
    logger.log('Database setup completed successfully!');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error during database setup:', error);
    process.exit(1);
  }
}

setupDatabase(); 