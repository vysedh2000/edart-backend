import { Module } from '@nestjs/common';
import { DepositController } from '../controllers/deposit.controller';
import { DepositService } from '../services/deposit.service';

@Module({
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
