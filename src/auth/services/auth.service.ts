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
    const newToken = await this.tokenService.create({
      userId: user._id,
      email: user.email,
      isManager: user.isManager,
    });
    const payload = { tokenId: newToken.tokenId };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  public async signUp(signupRequestDto: SignupRequestDto): Promise<string> {
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
    const newToken = await this.tokenService.create({
      userId: newUser._id,
      email: newUser.email,
      isManager: newUser.isManager,
    });
    const payload = { tokenId: newToken.tokenId };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  public async getMyProfile(userId: string): Promise<ProfileResponseDto> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    interface UserWithStats {
      picture?: string;
    }

    const userStats = user as unknown as UserWithStats;

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,

      avatar: userStats.picture || (user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'),
    };
  }
}
