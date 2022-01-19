import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SigninDtoUser {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
