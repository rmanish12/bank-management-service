import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from 'src/entities/user-account.entity';
import { AccountTypeModule } from './account-type.module';
import { UserAccountController } from 'src/controllers/user-account.controller';
import { UserAccountService } from 'src/services/user-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount]), AccountTypeModule],
  controllers: [UserAccountController],
  providers: [UserAccountService],
})
export class UserAccountModule {}
