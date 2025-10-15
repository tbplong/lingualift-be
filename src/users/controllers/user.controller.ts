import { Controller, Get, Headers } from '@nestjs/common';
import { UsersService } from '../services';
import { TokenService } from 'src/auth/services';
import { UserResponseDto } from '../dtos/users.dto';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
  ) {}

  @Get('profile')
  public async getProfile(@Headers('authorization') authorization: string) {
    const user = await this.userService.usersProfile(authorization);
    return new UserResponseDto(user);
  }
}
