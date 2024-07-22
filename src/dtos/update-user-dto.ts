import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @IsNotEmpty()
  @IsArray()
  roles: string[];
}
