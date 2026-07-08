import { Module } from '@nestjs/common';
import { TransferController } from '../controllers/transfer.controller';
import { OtherService } from '../services/other.service';
import { TransferService } from '../services/transfer.service';

@Module({
  controllers: [TransferController],
  providers: [TransferService, OtherService],
})
export class TransferModule {}
