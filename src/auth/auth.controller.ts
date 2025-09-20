import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @Post('login')
  // async logIn(@Body() signInDto: Record<string, any>) {
  //   return this.authService.logIn(signInDto.email, signInDto.password);
  // }
  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.logIn(loginDto.username, loginDto.password);
  }
}
