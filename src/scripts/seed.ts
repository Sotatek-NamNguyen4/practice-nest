import { NestFactory } from '@nestjs/core';
import { SeederModule } from '../modules/seeder/seeder.module';
import { SeederService } from '../modules/seeder/seeder.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('SeederScript');
  
  try {
    logger.log('Initializing seeder application...');
    
    const app = await NestFactory.create(SeederModule);
    
    // Wait a bit to ensure database connection and migrations are complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const seederService = app.get(SeederService);
    
    logger.log('Starting database seeding...');
    await seederService.seed();
    
    logger.log('Database seeding completed successfully!');
    
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('Error during seeding:', error);
    process.exit(1);
  }
}

bootstrap(); 