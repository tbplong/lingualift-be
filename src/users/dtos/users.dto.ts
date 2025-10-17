import { UserDocument } from '../schema';

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

  constructor(user: UserDocument) {
    this._id = user._id.toString();
    this.email = user.email;
    this.isManager = user.isManager;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.picture = user.picture;
    this.dateOfBirth = user.dateOfBirth;
    this.phone = user.phone;
  }
}
