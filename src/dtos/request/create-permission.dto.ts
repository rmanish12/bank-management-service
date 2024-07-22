import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UpdatePermissionDto } from './update-permission-dto';

export class CreatePermissionDto extends UpdatePermissionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
