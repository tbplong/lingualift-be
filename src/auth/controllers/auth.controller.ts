import { Controller, Post, Body, Delete, Get, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
// Import các DTO (đặc biệt là ProfileResponseDto)
import {
  LoginRequestDto,
  AuthResponseDto,
  SignupRequestDto,
  ProfileResponseDto,
} from '../dtos/auth.dto';
import { AuthService, TokenService } from '../services';
import { Public } from '../decorators/public.decorator';
import { User } from '../decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';

// --- THÊM ĐOẠN NÀY ĐỂ HẾT LỖI RequestUser ---
interface RequestUser {
  tokenId: string;
  email: string;
  userId: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('/login')
  @Public()
  public async login(@Body() loginRequestDto: LoginRequestDto): Promise<AuthResponseDto> {
    const accessToken = await this.authService.logIn(loginRequestDto);
    return plainToInstance(AuthResponseDto, { accessToken }, { excludeExtraneousValues: true });
  }

  @Post('/signup')
  @Public()
  public async signup(@Body() signupRequestDto: SignupRequestDto): Promise<AuthResponseDto> {
    const accessToken = await this.authService.signUp(signupRequestDto);
    return plainToInstance(AuthResponseDto, { accessToken }, { excludeExtraneousValues: true });
  }

  @Delete('/logout')
  public async logout(@User() user: Express.User): Promise<void> {
    const { tokenId } = user;
    await this.tokenService.logout(tokenId);
  }

  @UseGuards(AuthGuard) // Bắt buộc có Token + Fingerprint
  @Get('me')
  public async getProfile(@User() user: RequestUser): Promise<ProfileResponseDto> {
    // Gọi Service lấy dữ liệu
    return this.authService.getMyProfile(user.userId);
  }
}
