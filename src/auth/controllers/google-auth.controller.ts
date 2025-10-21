import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { plainToInstance } from 'class-transformer';
import { GoogleLoginRequestDto, GoogleLoginResponseDto } from '../dtos';
import { GoogleAuthService } from '../services/google-auth.service';

@Controller('auth/google')
export class GoogleAuthController {
  constructor(private googleAuthService: GoogleAuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post()
  public async login(
    @Body()
    loginRequest: GoogleLoginRequestDto,
  ): Promise<GoogleLoginResponseDto> {
    const loginRequestInfo = { ...loginRequest };
    const loginToken =
      await this.googleAuthService.generateLoginTokenFromIdToken(
        loginRequestInfo,
      );
    return plainToInstance(GoogleLoginResponseDto, loginToken, {
      excludeExtraneousValues: true,
    });
  }
}
