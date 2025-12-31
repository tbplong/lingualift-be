import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SignupRequestDto extends LoginRequestDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  dateOfBirth: string;

  @IsNotEmpty()
  phone: string;
}

export class AuthResponseDto {
  @Expose()
  accessToken: string;
}

export class GoogleLoginRequestDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}

export class GoogleLoginResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  hasPassword: boolean;

  @Expose()
  isFirstLogin: boolean;
}

export class ProfileResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  avatar: string;
}
