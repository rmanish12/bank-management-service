import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { CreateUserAccountDto } from 'src/dtos/request/create-user-account.dto';
import { UserAccount } from 'src/entities/user-account.entity';
import { User } from 'src/entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { AccountTypeService } from './account-type.service';
import { isEmpty } from 'lodash';
import { MapperUtils } from 'src/utils/mapper';
import { UserAccountDetails } from 'src/dtos/response/user-account-details-response.dto';

@Injectable()
export class UserAccountService {
  private readonly logger = new Logger(UserAccountService.name);
  private readonly mapperUtils = new MapperUtils();

  constructor(
    @InjectRepository(UserAccount) private readonly userAccountRepo: Repository<UserAccount>,
    private readonly accountTypeService: AccountTypeService,
  ) {}

  private async getAccountDetailsById(accountId: string): Promise<UserAccount> {
    const details = await this.userAccountRepo.findOne({
      where: {
        id: accountId,
      },
      relations: {
        user: true,
      },
    });

    if (isEmpty(details)) {
      throw new NotFoundException(`Account ${accountId} does not exist`);
    }

    return details;
  }

  async createUserAccount(user: User, createUserAccountDto: CreateUserAccountDto) {
    const { accountType } = createUserAccountDto;
    this.logger.log(`Received request for creating user account for user: ${user.id} and type:${accountType}`);

    const accountTypeDetails = await this.accountTypeService.getAccountTypeDetailsById(accountType);

    const newAccount = this.userAccountRepo.create({
      accountType: accountTypeDetails,
      user,
    });

    await this.userAccountRepo.save(newAccount);

    this.logger.log(`Created new account for user: ${user.id} and type: ${accountType}`);
  }

  async getUserAccounts(user: User): Promise<UserAccountDetails[]> {
    const accounts = await this.userAccountRepo.find({
      select: {
        accountType: {
          name: true,
        },
      },
      where: {
        user: {
          id: user.id,
        },
      },
      relations: {
        accountType: true,
      },
    });

    return this.mapperUtils.mapUserAccountDetails(accounts);
  }

  async closeAccount(user: User, accountId: string) {
    this.logger.log(`Received request for closing account: ${accountId}`);
    const account = await this.getAccountDetailsById(accountId);

    if (account.user.id !== user.id) {
      throw new ForbiddenException(`Insufficient priviledge`);
    }

    account.closedAt = new Date(moment.utc().format());

    await this.userAccountRepo.save(account);

    this.logger.log(`Account: ${accountId} has been closed`);
  }

  async getUserActiveAccounts(user: User): Promise<UserAccountDetails[]> {
    const details = await this.userAccountRepo.find({
      where: {
        closedAt: IsNull(),
        user: {
          id: user.id,
        },
      },
      relations: {
        accountType: true,
      },
    });

    return this.mapperUtils.mapUserAccountDetails(details);
  }
}
