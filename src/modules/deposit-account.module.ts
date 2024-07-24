import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositAccount } from 'src/entities/deposit-account';
import { RateOfInterestModule } from './rate-of-interest.module';
import { DepositAccountService } from 'src/services/deposit-account.service';
import { DepositAccountController } from 'src/controllers/deposit-account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DepositAccount]), RateOfInterestModule],
  controllers: [DepositAccountController],
  providers: [DepositAccountService],
  exports: [DepositAccountService],
})
export class DepositAccountModule {}
