import { IsArray, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  @Length(0, 255)
  description: string;

  @IsArray()
  permissions?: string[];
}
