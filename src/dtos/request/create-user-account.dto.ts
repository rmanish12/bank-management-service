import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserAccountDto {
  @IsUUID()
  @IsNotEmpty()
  accountType: string;
}
