import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import DatabaseSeeder from './database/seeder/database.seeder';
import { JwtAuthGuard } from './modules/auth/auth.guard';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { AllExceptionFilter } from './filters/http-exception.filter';
import { ExceptionInterceptor } from './interceptors/exception.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const seeder = app.get(DatabaseSeeder);
  await seeder.seed();

  app.use(helmet());
  app.enableCors();

  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minutes
      limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
      standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    }),
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }));

  app.useGlobalGuards(new JwtAuthGuard(new Reflector()));

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new ExceptionInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();
