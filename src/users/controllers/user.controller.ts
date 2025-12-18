import { Controller, Get, Headers } from '@nestjs/common';
import { UsersService } from '../services';
import { UserResponseDto } from '../dtos/users.dto';
import { User } from 'src/auth/decorators';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/profile')
  public async getProfile(@User() user: Express.User) {
    console.log(user);
    const data = await this.userService.getUsersProfile(user.userId);
    return new UserResponseDto(data);
  }
}
