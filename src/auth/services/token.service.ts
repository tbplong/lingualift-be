import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import {
  FilterQuery,
  Model,
  ProjectionType,
  QueryOptions,
  Types,
} from 'mongoose';
import { authConfig, AuthConfigType } from 'src/common/config';

import {
  AccessTokenContent,
  CreateTokenResponseInterface,
  TokenInfoInterface,
} from '../interfaces';

import { Token, TokenDocument } from '../schemas';
import { TokenCollectionName } from 'src/constants/schema';
import * as config from '@nestjs/config';
import { UserDocument } from 'src/users/schema';
import { UsersService } from 'src/users/services/users.service';
import { forwardRef } from '@nestjs/common';

/**
 * Provides common methods for token management
 */
@Injectable()
export class TokenService {
  // private readonly logger: Logger = new Logger(TokenService.name);

  constructor(
    @InjectModel(TokenCollectionName) private tokenModel: Model<Token>,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    private jwtService: JwtService,
    @Inject(authConfig.KEY)
    private appAuthConfig: config.ConfigType<AuthConfigType>,
  ) {}

  /**
   * Creates a new token and store it in the database
   *
   * @param userId User ID that the token belongs to
   * @returns Created token
   */
  public async create(
    tokenInfo: TokenInfoInterface,
  ): Promise<CreateTokenResponseInterface> {
    const { userId } = tokenInfo;
    const token = await this.tokenModel.create({
      userId,
      expiredAt: dayjs().add(365, 'day').toDate(),
    });
    return { tokenId: token._id };
  }

  /**
   * Get the user that a token ID belongs to
   *
   * @param tokenId Token ID to get the user
   * @returns The user that the token belongs to
   */
  public async getUserByTokenId(
    tokenId: Types.ObjectId,
  ): Promise<UserDocument | null> {
    const token = await this.findById(tokenId);

    if (!token) {
      throw new NotFoundException('Mã đăng nhập không tồn tại');
    }

    return this.userService.findById(token.userId.toString());
  }

  /**
   * Deactivates a token
   *
   * @param tokenId The token ID to deactivate
   * @returns The deactivated token
   */
  public async deactivateToken(
    tokenId: Types.ObjectId,
  ): Promise<TokenDocument> {
    const token = await this.findById(new Types.ObjectId(tokenId));

    if (!token) {
      throw new NotFoundException('Không tìm thấy mã đăng nhập');
    }

    token.isActivate = false;
    await token.save();
    return token;
  }

  /**
   * Generates an access token based on the token ID
   *
   * @param tokenId The token ID to generate an access token
   * @returns The generated access token
   */
  public generateAccessToken(tokenId: Types.ObjectId): string {
    return this.jwtService.sign(
      { tokenId },
      { secret: this.appAuthConfig.jwtSecret },
    );
  }

  /**
   * Parse an access token and returns its content
   *
   * @param accessToken The access token to parse
   * @returns
   */
  public readAccessToken(accessToken: string): AccessTokenContent {
    return {
      tokenId: new Types.ObjectId(
        <string>this.jwtService.verify(accessToken, {
          secret: this.appAuthConfig.jwtSecret,
        }).tokenId,
      ),
    };
  }

  /**
   * Verify the validity of a token.
   * A token is considered valid if it is still active and not expired.
   *
   * @param tokenId The token ID to verify
   * @returns Whether the token is valid
   */
  public async verifyTokenValidity(tokenId: Types.ObjectId): Promise<boolean> {
    const token = await this.findById(tokenId);

    if (!token) {
      throw new NotFoundException('Không tìm thấy mã đăng nhập');
    }
    // console.log('expiredAt:', token.expiredAt);
    // console.log('Current time:', dayjs().toISOString());
    if (dayjs().isAfter(dayjs(token.expiredAt), 'second')) {
      token.isActivate = false;
      await token.save();
      return false;
    }

    return token.isActivate;
  }

  public async getValidToken(tokenId: Types.ObjectId): Promise<TokenDocument> {
    const token = await this.findById(tokenId);

    if (!token) {
      throw new NotFoundException('Không tìm thấy mã đăng nhập');
    }

    if (dayjs().isAfter(token.expiredAt)) {
      token.isActivate = false;
      await token.save();
    }

    if (!token.isActivate) {
      throw new UnauthorizedException('Mã đăng nhập đã hết hạn');
    }

    return token;
  }

  public async logout(tokenId: Types.ObjectId): Promise<TokenDocument> {
    const token = await this.findById(new Types.ObjectId(tokenId));

    if (!token) {
      throw new NotFoundException('Không tìm thấy mã đăng nhập');
    }

    token.isActivate = false;
    await token.save();
    return token;
  }

  private async findOne(
    query: FilterQuery<Token>,
    projection: ProjectionType<Token> = {},
    options: QueryOptions<Token> = {},
  ): Promise<TokenDocument | null> {
    return await this.tokenModel.findOne(query, projection, options);
  }

  private async findById(
    tokenId: Types.ObjectId,
    projection: ProjectionType<Token> = {},
    options: QueryOptions<Token> = {},
  ): Promise<TokenDocument | null> {
    return this.findOne({ _id: tokenId }, projection, options);
  }
}
