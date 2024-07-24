import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { CreateDepositAccountDto } from 'src/dtos/request/create-deposit-account.dto';
import { CreateUserAccountDto } from 'src/dtos/request/create-user-account.dto';
import { UserAccountService } from 'src/services/user-account.service';
import { getSuccessResponse } from 'src/utils/success-response.helper';

@Controller('/user-account')
@ApiTags('User Account Controller')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @Post('/general')
  async createUserAccount(@User() user, @Body() createUserAccountDto: CreateUserAccountDto) {
    await this.userAccountService.createUserGeneralAccount(user, createUserAccountDto);

    return getSuccessResponse('Account successfully created');
  }

  @Post('/deposit')
  async createUserDepostAccount(@User() user, @Body() createDepositAccountDto: CreateDepositAccountDto) {
    await this.userAccountService.createUserDepositAccount(user, createDepositAccountDto);

    return getSuccessResponse('Account successfully created');
  }

  @Get()
  getUserAccounts(@User() user) {
    return this.userAccountService.getUserAccounts(user);
  }

  @Patch('/:id/close')
  async closeAccount(@Param('id') id: string, @User() user) {
    await this.userAccountService.closeAccount(user, id);

    return getSuccessResponse('Account successfully closed');
  }

  @Get('/active')
  async getActiveAccounts(@User() user) {
    return this.userAccountService.getUserActiveAccounts(user);
  }
}
