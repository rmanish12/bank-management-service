import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/user.decorator';
import { DepositAccountService } from 'src/services/deposit-account.service';

@Controller('/deposit-account')
@ApiTags('Deposit Account Controller')
export class DepositAccountController {
  constructor(private readonly depositAccountService: DepositAccountService) {}

  @Get('/active')
  getAllActiveDeposits(@User() user) {
    return this.depositAccountService.getAllActiveDepositAccounts(user);
  }
}
