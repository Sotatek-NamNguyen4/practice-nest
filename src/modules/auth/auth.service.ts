import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../entities/user.entity';

export interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && await this.userService.validatePassword(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserEntity) {
    const payload: JwtPayload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      expires_in: 86400,
      user: {
        id: user.id,
        username: user.username
      }
    }
  }
}