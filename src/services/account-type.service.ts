import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { CreateAccountTypeDto } from 'src/dtos/request/create-account-type.dto';
import { AccountType } from 'src/entities/account-type.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { MapperUtils } from 'src/utils/mapper';
import { AccountTypeDetailsResponse } from 'src/dtos/response/account-type-details-response.dto';

@Injectable()
export class AccountTypeService {
  private readonly logger = new Logger(AccountTypeService.name);
  private readonly mapperUtils = new MapperUtils();

  constructor(
    @InjectRepository(AccountType) private readonly accountTypeRepo: Repository<AccountType>,
    private readonly userService: UserService,
  ) {}

  private accountTypeExistsByName(name: string): Promise<boolean> {
    return this.accountTypeRepo.existsBy({ name });
  }

  private async checkAccountTypeExistenceByName(name: string) {
    const accountTypeExistsByName = await this.accountTypeExistsByName(name);

    if (accountTypeExistsByName) {
      throw new ConflictException(`Account type ${name} already exists`);
    }
  }

  private async getDetailsById(accountTypeId: string): Promise<AccountType> {
    const accountTypeDetails = await this.accountTypeRepo.findOne({
      where: {
        id: accountTypeId,
      },
      relations: {
        createdBy: true,
        lastModifiedBy: true,
      },
    });

    if (isEmpty(accountTypeDetails)) {
      throw new NotFoundException(`Account with id ${accountTypeId} does not exist`);
    }

    return accountTypeDetails;
  }

  async createAccountType(user: User, createAccountTypeDto: CreateAccountTypeDto): Promise<AccountType> {
    const { name, description } = createAccountTypeDto;
    this.logger.log(`Received request for creating account type with name: ${name}`);

    await this.checkAccountTypeExistenceByName(name);

    const newAccountType = this.accountTypeRepo.create({
      name,
      description,
      createdBy: user,
      lastModifiedBy: user,
    });

    await this.accountTypeRepo.save(newAccountType);

    this.logger.log(`Created account type ${name}`);
    return;
  }

  async getAllAccounts(): Promise<AccountType[]> {
    this.logger.log('Received request for getting all the accounts');

    const allAccounts = await this.accountTypeRepo.find({
      select: {
        id: true,
        name: true,
      },
    });

    this.logger.log('Returning details of all the accounts');

    return allAccounts;
  }

  async getAccountTypeDetails(accountTypeId: string): Promise<AccountTypeDetailsResponse> {
    this.logger.log(`Received request for getting details of account type ${accountTypeId}`);

    const accountTypeDetails = await this.getDetailsById(accountTypeId);

    const { createdBy, lastModifiedBy } = accountTypeDetails;
    const createdByUserDetails = await this.userService.getUserDetailsByUserId(createdBy.id);
    const lastModifiedByUserDetails = await this.userService.getUserDetailsByUserId(lastModifiedBy.id);

    this.logger.log(`Returning details of account type ${accountTypeDetails}`);

    return {
      ...accountTypeDetails,
      createdBy: this.mapperUtils.mapUserDetailsForResponse(createdByUserDetails),
      lastModifiedBy: this.mapperUtils.mapUserDetailsForResponse(lastModifiedByUserDetails),
    };
  }

  async updateAccountType(user: User, accountTypeId: string, updateAccountTypeDto: CreateAccountTypeDto) {
    this.logger.log(`Received request for updating account type ${accountTypeId}`);

    const [accountTypeDetails, count] = await this.accountTypeRepo.findAndCountBy({ id: accountTypeId });

    if (isEmpty(accountTypeDetails)) {
      throw new NotFoundException('Account type not found');
    }

    const { name, description } = updateAccountTypeDto;

    if (count > 2) {
      throw new ConflictException(`Account type ${name} already exists`);
    }

    const updatedAccountTypeDetails = {
      ...accountTypeDetails[0],
      name,
      description,
      lastModifiedBy: user,
    };

    await this.accountTypeRepo.save(updatedAccountTypeDetails);

    this.logger.log(`Account type ${accountTypeId} updated`);
  }

  async getAccountTypeDetailsById(accountTypeId: string): Promise<AccountType> {
    const details = await this.accountTypeRepo.findOneBy({ id: accountTypeId });

    if (isEmpty(details)) {
      throw new NotFoundException(`Account type ${accountTypeId} not found`);
    }

    return details;
  }
}
