import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { CreateUserDetailsDto } from "./create-user-details.dto";

export class CreateUserDto extends CreateUserDetailsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}