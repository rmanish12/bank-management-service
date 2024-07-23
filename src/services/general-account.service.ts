import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneralAccountDetailsResponse } from 'src/dtos/response/general-account-details.response.dto';
import { GeneralAccount } from 'src/entities/general-account.entity';
import { UserAccount } from 'src/entities/user-account.entity';
import { User } from 'src/entities/user.entity';
import { MapperUtils } from 'src/utils/mapper';
import { Repository } from 'typeorm';

@Injectable()
export class GeneralAccountService {
  private readonly mapperUtils = new MapperUtils();

  constructor(@InjectRepository(GeneralAccount) private readonly generalAccountRepo: Repository<GeneralAccount>) {}

  createAccount(account: UserAccount) {
    return this.generalAccountRepo.create({ account, balance: 0.0 });
  }

  async getUserAccountsDetails(user: User): Promise<GeneralAccountDetailsResponse[]> {
    const generalAccountDetails = await this.generalAccountRepo.find({
      select: {
        id: true,
        balance: true,
        account: {
          id: true,
          accountNumber: true,
          accountType: {
            name: true,
          },
          createdAt: true,
          closedAt: true,
        },
      },
      where: {
        account: {
          user: {
            id: user.id,
          },
        },
      },
      relations: {
        account: {
          accountType: true,
        },
      },
    });

    return this.mapperUtils.mapGeneralAccountDetailsForResponse(generalAccountDetails);
  }
}
