import { IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { UserDocument } from '../schema';
import { Type } from 'class-transformer';

export class CreateUserDto {
  public readonly email: string;

  public readonly isManager: boolean;

  public readonly firstName: string | null;

  public readonly lastName: string | null;

  public readonly picture: string | null;

  public readonly googleId: string | null;

  public readonly dateOfBirth: string | null;

  public readonly phone: string | null;

  public password: string | null;
}

class SocialMediaResponse {
  facebookUrl?: string;

  facebookName?: string;
}

export class UserResponseDto {
  public _id: string;
  public email: string;
  public isManager: boolean;
  public firstName: string | null;
  public lastName: string | null;
  public picture: string | null;
  public dateOfBirth: string | null;
  public phone: string | null;
  public createdAt: Date;
  public updatedAt: Date;
  public address: string | undefined;
  public highSchool: string | undefined;
  public socialMedia: SocialMediaResponse | undefined;

  constructor(user: UserDocument) {
    this._id = user._id.toString();
    this.email = user.email;
    this.isManager = user.isManager;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.picture = user.picture;
    this.dateOfBirth = user.dateOfBirth;
    this.phone = user.phone;
    this.highSchool = user?.highSchool;
    this.address = user?.address;
    this.socialMedia = user?.socialMedia;
  }
}
export class SocialMedia {
  @IsUrl()
  @IsOptional()
  facebookUrl?: string;

  @IsString()
  @IsOptional()
  facebookName?: string;
}
export class EditProfileRequestDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  highSchool?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialMedia)
  socialMedia?: {
    facebookUrl?: string;
    facebookName?: string;
  };
}
