import { IsNotEmpty, IsNumber } from 'class-validator';

export class createRoIDto {
  @IsNotEmpty()
  @IsNumber()
  minimumDays: number;

  @IsNotEmpty()
  @IsNumber()
  maximumDays: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  interestRate: number;
}
