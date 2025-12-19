import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserCollectionName } from 'src/constants/schema';
import { UserDocument } from '../schema/user.schema';
import { Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS, PASSWORD_REGEX } from 'src/auth/constants';
import { CreateUserDto } from '../dtos/users.dto';
import { TokenService } from 'src/auth/services/token.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserCollectionName)
    private readonly userModel: Model<UserDocument>,
    private readonly tokenService: TokenService,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    // if (createUserDto.password) {
    //   const password = await this.checkAndHashPassword(createUserDto.password);
    //   if (!password) {
    //     throw new BadRequestException('Mật khẩu không hợp lệ');
    //   }
    //   createUserDto.password = password;
    // }

    const newUser = await this.userModel.create(createUserDto);

    return newUser;
  }

  public async findOne(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  public async findById(userId: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    return user;
  }

  public async checkAndHashPassword(password: string): Promise<string> {
    if (!this.testPasswordValidity(password)) {
      throw new BadRequestException('Mật khẩu không hợp lệ');
    }
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private testPasswordValidity(password: string): boolean {
    return PASSWORD_REGEX.test(password);
  }
  public async usersProfile(authorization: string): Promise<UserDocument> {
    const token = authorization?.replace(/^Bearer\s/, '');
    if (!token) {
      throw new Error('Authorization token missing');
    }
    const tokenId = this.tokenService.readAccessToken(token);
    const tokenValid = await this.tokenService.verifyTokenValidity(tokenId.tokenId);
    if (!tokenValid) {
      throw new Error('Token is invalid or expired');
    }
    const user = await this.tokenService.getUserByTokenId(tokenId.tokenId);
    if (!user) {
      throw new Error('User not found for the provided token');
    }
    // const user = await this.userService.usersProfile(authorization);
    return user;
  }
}
