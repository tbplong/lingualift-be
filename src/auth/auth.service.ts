import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService, User } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async logIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user: User | undefined = this.usersService.findOne(username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isMatch = await bcrypt.compare(pass, user.hash);
    // const isMatch = pass === user?.password;
    if (!isMatch) {
      // Logger.warn(`Failed login attempt for user: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }
    // if (user.username === 'john') {
    //     throw new UnauthorizedException();
    // }
    // if (!user || user.password !== pass) {
    //   throw new UnauthorizedException();
    // }
    // const { password, ...result } = user;
    // return result;
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
