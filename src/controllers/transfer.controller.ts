import { Body, Controller, Post } from '@nestjs/common';
import { TransferService } from '../services/transfer.service';
import { AccFundTxnRequest } from '../dtos/transfer.dto';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('accFundTxn')
  async accFundTxn(@Body() request: AccFundTxnRequest) {
    const txnId = await this.transferService.accFundTxnService(request);
    return txnId;
  }
}
