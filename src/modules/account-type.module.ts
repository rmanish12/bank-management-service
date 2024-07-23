import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountTypeController } from 'src/controllers/account-type.controller';
import { AccountType } from 'src/entities/account-type.entity';
import { AccountTypeService } from 'src/services/account-type.service';
import { UserModule } from './user.module';

@Module({
  imports: [TypeOrmModule.forFeature([AccountType]), UserModule],
  controllers: [AccountTypeController],
  providers: [AccountTypeService],
  exports: [AccountTypeService],
})
export class AccountTypeModule {}
