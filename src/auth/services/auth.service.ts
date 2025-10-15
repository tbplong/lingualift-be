import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginRequestDto, SignupRequestDto } from '../dtos';
import { UsersService } from 'src/users/services/users.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  public async logIn(
    loginRequestDto: LoginRequestDto,
  ): Promise<{ access_token: string }> {
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
    console.log('Created token:', newToken);
    return {
      access_token: accessToken,
    };
  }

  public async signUp(
    signupRequestDto: SignupRequestDto,
  ): Promise<{ access_token: string }> {
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
}
