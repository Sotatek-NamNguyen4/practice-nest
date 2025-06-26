import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomException } from '../../exceptions/custom.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne( {where: { username }} );
  }

  async createUser(username: string, password: string): Promise<UserEntity> {
    const existedUser = await this.findByUsername(username);
    if (existedUser) {
      throw new CustomException('Duplicated username', HttpStatus.BAD_REQUEST, 'DUPLICATED_USERNAME');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}