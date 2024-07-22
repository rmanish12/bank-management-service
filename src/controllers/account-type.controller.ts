import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from 'src/decorators/permission.decorator';
import { User } from 'src/decorators/user.decorator';
import { CreateAccountTypeDto } from 'src/dtos/request/create-account-type.dto';
import { PermissionGaurd } from 'src/gaurds/permission.gaurd';
import { AccountTypeService } from 'src/services/account-type.service';
import { PERMISSIONS } from 'src/utils/permissions.enum';
import { getSuccessResponse } from 'src/utils/success-response.helper';

@ApiTags('Account Type Controller')
@Controller('/account-type')
@UseGuards(PermissionGaurd)
export class AccountTypeController {
  constructor(private readonly accountTypeService: AccountTypeService) {}

  @Post()
  @RequirePermissions(PERMISSIONS.MANAGE_ACCOUNT_TYPES)
  async createAccountType(@User() user, @Body() createAccountTypeDto: CreateAccountTypeDto) {
    await this.accountTypeService.createAccountType(user, createAccountTypeDto);

    return getSuccessResponse('Account type has been created successfully');
  }

  @Get()
  @RequirePermissions(PERMISSIONS.MANAGE_ACCOUNT_TYPES, PERMISSIONS.VIEW_ACCOUNT_TYPES)
  getAllAccounts() {
    return this.accountTypeService.getAllAccounts();
  }

  @Get('/:id')
  getAccountDetails(@Param('id') id: string) {
    return this.accountTypeService.getAccountTypeDetails(id);
  }

  @Patch('/:id')
  async updateAccountTypeDetails(@Param('id') id: string, @User() user, @Body() updateAccountTypeDto: CreateAccountTypeDto) {
    await this.accountTypeService.updateAccountType(user, id, updateAccountTypeDto);

    return getSuccessResponse('Account type has been updated successfully');
  }
}
