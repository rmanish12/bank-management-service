import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { CreateUserAccountDto } from 'src/dtos/request/create-user-account.dto';
import { UserAccountService } from 'src/services/user-account.service';
import { getSuccessResponse } from 'src/utils/success-response.helper';

@Controller('/user-account')
@ApiTags('User Account Controller')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @Post()
  async createUserAccount(@User() user, @Body() createUserAccountDto: CreateUserAccountDto) {
    await this.userAccountService.createUserAccount(user, createUserAccountDto);

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
