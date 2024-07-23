import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { GeneralAccountService } from 'src/services/general-account.service';

@Controller('/general-account')
@ApiTags('General Accounts Controller')
export class GeneralAccountController {
  constructor(private readonly generalAccountService: GeneralAccountService) {}

  @Get()
  getUserAccountsDetails(@User() user) {
    return this.generalAccountService.getUserAccountsDetails(user);
  }
}
