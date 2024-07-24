import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoIController } from 'src/controllers/rate-of-interest.controller';
import { RateOfInterest } from 'src/entities/rate-of-interest.entity';
import { RateOfInterestService } from 'src/services/rate-of-interest.service';
import { UserModule } from './user.module';

@Module({
  imports: [TypeOrmModule.forFeature([RateOfInterest]), UserModule],
  controllers: [RoIController],
  providers: [RateOfInterestService],
  exports: [RateOfInterestService],
})
export class RateOfInterestModule {}
