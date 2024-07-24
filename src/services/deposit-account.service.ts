import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDepositAccountDto } from 'src/dtos/request/create-deposit-account.dto';
import { DepositAccount } from 'src/entities/deposit-account';
import { UserAccount } from 'src/entities/user-account.entity';
import { MomentHelper } from 'src/utils/moment.helper';
import { IsNull, Repository } from 'typeorm';
import { RateOfInterestService } from './rate-of-interest.service';
import { InterestHelper } from 'src/utils/interest.helper';
import { NumberConversionHelper } from 'src/utils/number-conversion.helper';
import { User } from 'src/entities/user.entity';

@Injectable()
export class DepositAccountService {
  private readonly momentHelper = new MomentHelper();
  private readonly interestHelper = new InterestHelper();
  private readonly numberConvesionHelper = new NumberConversionHelper();

  constructor(
    @InjectRepository(DepositAccount) private readonly depositAccountRepo: Repository<DepositAccount>,
    private readonly roiService: RateOfInterestService,
  ) {}

  async createDepositAccount(createDepositAccountDto: CreateDepositAccountDto, account: UserAccount) {
    const { startBalance, tenure } = createDepositAccountDto;

    const roi = await this.roiService.getInterestRateForDays(tenure);
    console.log('roi: ', roi);
    return this.depositAccountRepo.create({
      account,
      startDate: this.momentHelper.getCurrentDate(),
      maturityDate: this.momentHelper.getDateWithDaysAdded(tenure),
      startBalance: this.numberConvesionHelper.getTwoDecimalNumber(startBalance),
      maturityBalance: this.interestHelper.getFinalAmount(startBalance, roi.interestRate, tenure),
      interestRate: this.numberConvesionHelper.getTwoDecimalNumber(roi.interestRate),
    });
  }

  async getAllActiveDepositAccounts(user: User): Promise<DepositAccount[]> {
    const depositAccounts = await this.depositAccountRepo.find({
      where: {
        account: {
          user: {
            id: user.id,
          },
          closedAt: IsNull(),
        },
      },
    });

    return depositAccounts;
  }
}
