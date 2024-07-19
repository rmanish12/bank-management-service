import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}