import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { FundTxnRequest } from '../external/core/core.dto';

@Injectable()
export class OtherService {
  constructor(private readonly prismaService: PrismaService) {}

  async getTxnId(): Promise<string> {
    const txnId = await this.prismaService.$queryRaw<{ seq: bigint }[]>`
    SELECT nextval('txn_id_seq') as seq
  `;

    const rawSeq = Number(txnId[0].seq);

    const dailySeq = rawSeq % 1000000 === 0 ? 1 : rawSeq % 1000000;

    const now = new Date();
    const year = now.getFullYear();

    const startOfYear = new Date(year, 0, 0);
    const diff =
      now.getTime() -
      startOfYear.getTime() +
      (startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const formattedYear = year.toString();
    const formattedDay = dayOfYear.toString().padStart(3, '0');
    const formattedSeq = dailySeq.toString().padStart(6, '0');

    return `${formattedYear}${formattedDay}${formattedSeq}`;
  }

  async saveTxnSuspect(txnRequest: FundTxnRequest) {
    await this.prismaService.txnSuspect.create({
      data: {
        batchId: txnRequest.batchId,
        asset: txnRequest.asset,
        debitAcc: txnRequest.debitAcc,
        creditAcc: txnRequest.creditAcc,
        txnCode: txnRequest.txnCode,
        amount: Number(txnRequest.amount),
        narative: txnRequest.narative,
        userId: txnRequest.userId,
      },
    });
  }
}
