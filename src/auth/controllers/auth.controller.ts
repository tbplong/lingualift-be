import { Controller, Post, Body, Delete } from '@nestjs/common';
import { LoginRequestDto, AuthResponseDto, SignupRequestDto } from '../dtos';
import { plainToInstance } from 'class-transformer';
import { AuthService, TokenService } from '../services';
import { Public } from '../decorators/public.decorator';
import { User } from '../decorators';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('/login')
  @Public()
  public async login(
    @Body() loginRequestDto: LoginRequestDto,
  ): Promise<AuthResponseDto> {
    const accessToken = await this.authService.logIn(loginRequestDto);
    return plainToInstance(
      AuthResponseDto,
      { accessToken },
      { excludeExtraneousValues: true },
    );
  }

  @Post('/signup')
  @Public()
  public async signup(
    @Body() signupRequestDto: SignupRequestDto,
  ): Promise<AuthResponseDto> {
    const accessToken = await this.authService.signUp(signupRequestDto);
    return plainToInstance(
      AuthResponseDto,
      { accessToken },
      { excludeExtraneousValues: true },
    );
  }

  @Delete('/logout')
  public async logout(@User() user: Express.User): Promise<void> {
    const { tokenId } = user;
    await this.tokenService.logout(tokenId);
  }
}
