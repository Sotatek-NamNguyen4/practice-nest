import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { SeederService } from './seeder.service';
import { CommonModule } from '../../common/common.module';
import { DynamicEntitiesUtil } from '../../common/dynamic-entities.util';
import { UserEntity } from '../../entities/user.entity';

@Module({
  imports: [
    CommonModule.forRoot({ synchronize: true }),
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [SeederService, UserService],
  exports: [SeederService],
})
export class SeederModule {} 