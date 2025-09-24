import { Controller, Post, Body } from '@nestjs/common';
import { LoginRequestDto, LoginResponseDto } from '../dtos';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../services';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const accessToken = await this.authService.logIn(loginRequestDto);
    return plainToInstance(
      LoginResponseDto,
      { accessToken },
      { excludeExtraneousValues: true },
    );
  }
}
