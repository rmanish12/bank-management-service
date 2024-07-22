import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePermissionDto {
  @IsString()
  @Length(0, 255)
  @IsNotEmpty()
  description: string;
}
