import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { USER_GENDER } from "src/utils/enums";

export class CreateUserDetailsDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MaxLength(50)
  lastName: string;

  @IsEnum(USER_GENDER)
  @IsNotEmpty()
  gender: USER_GENDER

  @IsDateString()
  dateOfBirth: Date
}