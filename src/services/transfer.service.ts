import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';
import { OtherService } from './other.service';
import { AccFundTxnRequest } from '../dtos/transfer.dto';
import { FundTxnRequest, FundTxnResponse } from '../external/core/core.dto';
import { FundTxnService } from '../external/core/core.service';

@Injectable()
export class TransferService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly otherService: OtherService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async accFundTxnService(request: AccFundTxnRequest) {
    try {
      const txnId = await this.otherService.getTxnId();
      var txnRequest: FundTxnRequest = new FundTxnRequest();
      txnRequest.asset = request.asset;
      txnRequest.batchId = txnId;
      txnRequest.debitAcc = request.sender;
      txnRequest.creditAcc = request.receiver;
      txnRequest.txnCode = '1';
      txnRequest.amount = request.amount;
      txnRequest.narative = 'Transfer @@ to @@';
      txnRequest.userId = request.userId;

      const response: FundTxnResponse = await FundTxnService(txnRequest);
      if (response.message !== 'Transaction successful') {
        await this.otherService.saveTxnSuspect(txnRequest);
      }

      return txnId;
    } catch (e) {
      throw e;
    }
  }
}
