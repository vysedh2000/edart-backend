import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { DepositService } from '../services/deposit.service';
import {
  DepositStripeSuccessRequest,
  StripeEventData,
  StripeWebhookRequest,
} from '../dtos/deposit.dto';

@Controller('wh')
export class Webhook {
  constructor(private readonly depositService: DepositService) {}

  @Post('stripe/success')
  @HttpCode(200)
  async successWh(@Body() request: StripeWebhookRequest) {
    return this.depositService.stripeDepositSuccess(request.data.object);
  }
}
