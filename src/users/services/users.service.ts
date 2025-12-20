import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserCollectionName } from 'src/constants/schema';
import { UserDocument } from '../schema/user.schema';
import { Model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS, PASSWORD_REGEX } from 'src/auth/constants';
import { CreateUserDto } from '../dtos/users.dto';
import { TokenService } from 'src/auth/services/token.service';
import { ChangedInformation } from '../interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserCollectionName)
    private readonly userModel: Model<UserDocument>,
    private readonly tokenService: TokenService,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const newUser = await this.userModel.create(createUserDto);
    return newUser;
  }

  public async findOne(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email });
  }

  public async findById(userId: string): Promise<UserDocument> {
    // Mongoose tự động hiểu userId là string và tìm đúng _id
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

  public async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private testPasswordValidity(password: string): boolean {
    return PASSWORD_REGEX.test(password);
  }
  public async getUsersProfile(userId: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found for the provided token');
    }
    return user;
  }

  public async editUserProfile(
    userId: Types.ObjectId,
    changedInformation: ChangedInformation,
  ): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found ');
    }

    const { firstName, lastName, email, highSchool, address, socialMedia } =
      changedInformation;

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (email) {
      user.email = email;
    }

    if (highSchool) {
      user.highSchool = highSchool;
    }

    if (address) {
      user.address = address;
    }

    if (socialMedia) {
      user.socialMedia = {
        facebookName: socialMedia.facebookName,
        facebookUrl: socialMedia.facebookUrl,
      };
    }

    await user.save();

    return user;
  }
}
