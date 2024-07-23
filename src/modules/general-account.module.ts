import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralAccountController } from 'src/controllers/general-account.controller';
import { GeneralAccount } from 'src/entities/general-account.entity';
import { GeneralAccountService } from 'src/services/general-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([GeneralAccount])],
  controllers: [GeneralAccountController],
  providers: [GeneralAccountService],
  exports: [GeneralAccountService],
})
export class GeneralAccountModule {}
