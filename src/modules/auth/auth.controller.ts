import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from '../../dto/auth/login.dto';
import { Public } from '../../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<any> {
    const user = await this.authService.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  @Public()
  async register(@Body() regDto: LoginDto) {
    const user = await this.userService.createUser(
      regDto.username,
      regDto.password,
    );
    return this.authService.login(user);
  }
}