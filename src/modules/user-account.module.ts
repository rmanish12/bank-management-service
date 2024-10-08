import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from 'src/entities/user-account.entity';
import { AccountTypeModule } from './account-type.module';
import { UserAccountController } from 'src/controllers/user-account.controller';
import { UserAccountService } from 'src/services/user-account.service';
import { GeneralAccountModule } from './general-account.module';
import { DepositAccountModule } from './deposit-account.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount]), AccountTypeModule, GeneralAccountModule, DepositAccountModule],
  controllers: [UserAccountController],
  providers: [UserAccountService],
})
export class UserAccountModule {}
