import { Body, Controller, Get, Headers, Patch } from '@nestjs/common';
import { UsersService } from '../services';
import { EditProfileRequestDto, UserResponseDto } from '../dtos/users.dto';
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

  @Patch('/profile')
  public async editProfile(
    @User() user: Express.User,
    @Body() changedInformation: EditProfileRequestDto,
  ) {
    const data = await this.userService.editUserProfile(
      user.userId,
      changedInformation,
    );

    return new UserResponseDto(data);
  }
}
