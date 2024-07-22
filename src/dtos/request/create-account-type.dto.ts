import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class CreateAccountTypeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 255)
  description: string;
}
