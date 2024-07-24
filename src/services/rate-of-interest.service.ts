import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createRoIDto } from 'src/dtos/request/create-roi.dto';
import { RateOfInterest } from 'src/entities/rate-of-interest.entity';
import { User } from 'src/entities/user.entity';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class RateOfInterestService {
  constructor(@InjectRepository(RateOfInterest) private readonly rateOfInterestRepo: Repository<RateOfInterest>) {}

  createRoI(user: User, createRoIDto: createRoIDto): Promise<RateOfInterest> {
    const { minimumDays, maximumDays, interestRate } = createRoIDto;

    const newRoI = this.rateOfInterestRepo.create({
      minimumDays,
      maximumDays,
      interestRate,
      createdBy: user,
      lastModifiedBy: user,
    });

    return this.rateOfInterestRepo.save(newRoI);
  }

  getInterestRateForDays(numberOfDays: number): Promise<RateOfInterest> {
    return this.rateOfInterestRepo.findOne({
      select: {
        id: true,
        interestRate: true,
      },
      where: {
        minimumDays: LessThanOrEqual(numberOfDays),
      },
      order: {
        minimumDays: 'DESC',
      },
    });
  }
}
