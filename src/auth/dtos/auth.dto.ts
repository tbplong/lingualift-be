import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

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
