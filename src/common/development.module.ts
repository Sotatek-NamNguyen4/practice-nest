import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export interface DevelopmentModuleOptions {
  logging?: boolean;
  envFilePath?: string;
}

@Module({})
export class DevelopmentModule {
  static forRoot(options: DevelopmentModuleOptions = {}): DynamicModule {
    const {
      logging = true,
      envFilePath = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env.local'
    } = options;

    return {
      module: DevelopmentModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get<string>('DB_HOST'),
            port: config.get<number>('DB_PORT'),
            username: config.get<string>('DB_USERNAME'),
            password: config.get<string>('DB_PASSWORD'),
            database: config.get<string>('DB_DATABASE'),
            autoLoadEntities: true,
            synchronize: true, // Enable for development
            logging,
            // Disable migrations in development mode
            migrations: [],
            migrationsRun: false,
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [],
      providers: [],
    };
  }
} 