import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UpdateRoleDto } from './update-role-dto';

export class CreateRoleDto extends UpdateRoleDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;
}
