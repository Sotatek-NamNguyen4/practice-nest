import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import DatabaseSeeder from './database/seeder/database.seeder';
import { JwtAuthGuard } from './modules/auth/auth.guard';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seeder = app.get(DatabaseSeeder);
  await seeder.seed();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

  await app.listen(process.env.PORT ?? 3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
