import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginRequestDto, SignupRequestDto } from '../dtos';
import { UsersService } from 'src/users/services/users.service';
import { TokenService } from './token.service';
import { ProfileResponseDto } from '../dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  public async logIn(loginRequestDto: LoginRequestDto): Promise<string> {
    const { email, password } = loginRequestDto;
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // const payload = { email: user.email, _id: user._id.toString() };
    // const accessToken = await this.jwtService.signAsync(payload);
    const newToken = await this.tokenService.create({ userId: user._id });
    const payload = { tokenId: newToken.tokenId };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  public async signUp(signupRequestDto: SignupRequestDto): Promise<{ access_token: string }> {
    const { email, password } = signupRequestDto;
    const user = await this.usersService.findOne(email);
    if (user) {
      throw new UnauthorizedException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.usersService.create({
      email: signupRequestDto.email,
      isManager: false,
      firstName: signupRequestDto.firstName,
      lastName: signupRequestDto.lastName,
      picture: null,
      googleId: null,
      dateOfBirth: signupRequestDto.dateOfBirth,
      phone: signupRequestDto.phone,
      password: hashedPassword,
    });
    const payload = { email: newUser.email, _id: newUser._id.toString() };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  // src/auth/services/auth.service.ts

  public async getMyProfile(userId: string): Promise<ProfileResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Interface giả để truy cập các trường chưa có trong Schema chính thức
    interface UserWithStats {
      level?: string;
      xp?: number;
      rank?: number;
      streak?: number;
      picture?: string;
    }

    // Ép kiểu
    const userStats = user as unknown as UserWithStats;

    return {
      // 1. CÁC TRƯỜNG CƠ BẢN (Bắt buộc phải có để khớp DTO)
      id: user._id.toString(), // Quan trọng: _id là ObjectId, phải chuyển sang string
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,

      // 2. LOGIC AVATAR (Khớp với field 'avatar' trong DTO)
      // Ưu tiên ảnh (picture), nếu không có thì lấy chữ cái đầu của tên
      avatar: userStats.picture || (user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'),

      // 3. CÁC CHỈ SỐ GAME (Khớp với DTO)
      level: userStats.level || 'A1',
      xp: userStats.xp || 500,
      rank: userStats.rank || 99,
      streak: userStats.streak || 1,
    };
  }
}
