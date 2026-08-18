import { Body, Controller, Get, Post } from '@nestjs/common';
import { TransferService } from '../services/transfer.service';
import { AccFundTxnRequest } from '../dtos/transfer.dto';
import { OtherService } from '../services/other.service';
import { PrismaService } from '../prisma';

@Controller('transfer')
export class TransferController {
  constructor(
    private readonly transferService: TransferService,
    private readonly otherService: OtherService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('accFundTxn')
  async accFundTxn(@Body() request: AccFundTxnRequest) {
    const txnId = await this.transferService.accFundTxnService(request);
    return txnId;
  }

  @Get('test')
  async test() {
    return await this.prismaService.txnSucess.findUnique({
      where: {
        exId: 'cs_test_a1H4FQL8WQxhCTjPxGaRjNRsxThnoagyu1jbg0r2KKxvhgdKvTycWRKaDg',
      },
    });
  }
}
