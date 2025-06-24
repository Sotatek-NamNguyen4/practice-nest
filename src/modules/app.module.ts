import { Module } from '@nestjs/common';
import { TasksModule } from './task/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import DatabaseSeeder from '../database/seeder/database.seeder';
import { TaskEntity } from '../entities/task.entity';


@Module({ 
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 54328,
      username: 'root',
      password: 'secret',
      database: 'task_manager',
      entities: [UserEntity, TaskEntity],
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
    }),
    AuthModule,
    UserModule,
    TasksModule
  ],
  controllers: [],
  providers: [DatabaseSeeder],
})
export class AppModule {}
