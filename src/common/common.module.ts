import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export interface CommonModuleOptions {
  synchronize?: boolean;
  logging?: boolean;
  envFilePath?: string;
  runMigrations?: boolean;
}

@Module({})
export class CommonModule {
  static forRoot(options: CommonModuleOptions = {}): DynamicModule {
    const {
      synchronize = false,
      logging = true,
      envFilePath = process.env.NODE_ENV === 'docker' ? '.env.docker' : '.env.local',
      runMigrations = true
    } = options;

    return {
      module: CommonModule,
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
            synchronize,
            logging,
            migrations: [__dirname + '/../database/migrations/*.ts'],
            migrationsRun: runMigrations,
            migrationsTableName: 'migrations',
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [],
      providers: [],
    };
  }
}