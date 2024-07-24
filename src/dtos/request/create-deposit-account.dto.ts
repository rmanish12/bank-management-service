import { IsDateString, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateDepositAccountDto {
  @IsUUID()
  @IsNotEmpty()
  accountType: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  startBalance: number;

  @IsNotEmpty()
  @IsNumber()
  tenure: number;
}
