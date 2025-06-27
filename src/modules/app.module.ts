import { Module } from '@nestjs/common';
import { TasksModule } from './task/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CommonModule } from '../common/common.module';

@Module({ 
  imports: [
    CommonModule.forRoot(),
    AuthModule,
    UserModule,
    TasksModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
