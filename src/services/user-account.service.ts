import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { CreateUserAccountDto } from 'src/dtos/request/create-user-account.dto';
import { UserAccount } from 'src/entities/user-account.entity';
import { User } from 'src/entities/user.entity';
import { DataSource, IsNull, Repository } from 'typeorm';
import { AccountTypeService } from './account-type.service';
import { isEmpty } from 'lodash';
import { MapperUtils } from 'src/utils/mapper';
import { UserAccountDetails } from 'src/dtos/response/user-account-details-response.dto';
import { GeneralAccountService } from './general-account.service';

@Injectable()
export class UserAccountService {
  private readonly logger = new Logger(UserAccountService.name);
  private readonly mapperUtils = new MapperUtils();

  constructor(
    @InjectRepository(UserAccount) private readonly userAccountRepo: Repository<UserAccount>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly accountTypeService: AccountTypeService,
    private readonly generalAccountService: GeneralAccountService,
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

  private async getUserAccountObj(user: User, createUserAccountDto: CreateUserAccountDto) {
    const { accountType } = createUserAccountDto;
    this.logger.log(`Received request for creating user account for user: ${user.id} and type:${accountType}`);

    const accountTypeDetails = await this.accountTypeService.getAccountTypeDetailsById(accountType);

    return this.userAccountRepo.create({
      accountType: accountTypeDetails,
      user,
    });
  }

  async createUserAccount(user: User, createUserAccountDto: CreateUserAccountDto) {
    return this.dataSource.transaction(async (manager) => {
      const accountDetails = await this.getUserAccountObj(user, createUserAccountDto);
      const newAccountDetails = await manager.save(accountDetails);

      const newGeneralAccount = this.generalAccountService.createAccount(newAccountDetails);
      await manager.save(newGeneralAccount);

      this.logger.log(`Created new account for user: ${user.id} and type: ${createUserAccountDto.accountType}`);
    });
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
