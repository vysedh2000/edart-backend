import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DepositService } from '../services/deposit.service';
import { DepositStripeRequest } from '../dtos/deposit.dto';

@Controller('deposit')
export class DepositController {
  constructor(private readonly depositService: DepositService) {}

  @Post('stripe/session')
  @HttpCode(HttpStatus.OK)
  async stripeDeposit(@Body() payload: DepositStripeRequest) {
    return this.depositService.stripeDeposit(payload);
  }
}
