import { Module } from '@nestjs/common';
import { DepositController } from '../controllers/deposit.controller';
import { DepositService } from '../services/deposit.service';
import { OtherService } from '../services/other.service';
import { Webhook } from '../controllers/webhook';

@Module({
  controllers: [DepositController, Webhook],
  providers: [DepositService, OtherService],
})
export class DepositModule {}
