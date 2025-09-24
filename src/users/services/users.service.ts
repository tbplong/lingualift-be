import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserCollectionName } from 'src/constants/schema';
import { UserDocument } from '../schema/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS, PASSWORD_REGEX } from 'src/auth/constants';
import { CreateUserDto } from '../dtos/users.dto';

// This should be a real class/interface representing a user entity
// export interface User {
//   userId: number;
//   username: string;
//   password: string;
//   hash: string;
// }

@Injectable()
export class UsersService {
  // private readonly users = [
  //   {
  //     userId: 1,
  //     username: 'john',
  //     password: 'changeme',
  //     hash: '$2a$10$hGt87oV7yvBg1icc1cz9/Ok5bHM7VuEk2Pb5zmgJLT8mUHqgDlzNq',
  //   },
  //   {
  //     userId: 2,
  //     username: 'maria',
  //     password: 'guess',
  //     hash: '$2a$10$h20LBYZdJVlq3g4kZQQjnOgRi3vkP/Mj5UM4uEEqFFxWRqOsZViKW',
  //   },
  // ];

  constructor(
    @InjectModel(UserCollectionName)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    if (createUserDto.password) {
      const password = await this.checkAndHashPassword(createUserDto.password);
      if (!password) {
        throw new BadRequestException('Mật khẩu không hợp lệ');
      }
      createUserDto.password = password;
    }

    const newUser = await this.userModel.create(createUserDto);

    return newUser;
  }

  public async findOne(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  public async checkAndHashPassword(password: string): Promise<string> {
    if (!this.testPasswordValidity(password)) {
      throw new BadRequestException('Mật khẩu không hợp lệ');
    }
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private testPasswordValidity(password: string): boolean {
    return PASSWORD_REGEX.test(password);
  }
}
