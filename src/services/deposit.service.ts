import { Injectable } from '@nestjs/common';
import {
  stripeSession,
  stripeTxnStatus,
} from '../external/stripe/stripe.service';
import {
  DepositStripeRequest,
  DepositStripeResponse,
  DepositStripeSuccessRequest,
} from '../dtos/deposit.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { OtherService } from './other.service';
import { PrismaService } from '../prisma/prisma.service';
import { FundTxnRequest } from '../external/core/core.dto';
import { FundTxnService } from '../external/core/core.service';

@Injectable()
export class DepositService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly otherService: OtherService,
    private readonly prismaService: PrismaService,
  ) {}

  /**
   1. request stripe session
   2. save to redis
   3. response to fe
   */
  async stripeDeposit(payload: DepositStripeRequest) {
    try {
      var response = new DepositStripeResponse();
      const stripeRes = await stripeSession(payload.amount.toString());
      //plus 10 for extra time prevent expired after payment succeed
      var sessionTtl = stripeRes.expires_at - stripeRes.created + 10;
      var sessionId = stripeRes.id;
      var cacheData = { amt: stripeRes.amount_total, userId: payload.userId };
      this.redis
        .multi()
        .hset('stripeDeposit', sessionId, JSON.stringify(cacheData))
        .call('HEXPIRE', 'stripeDeposit', sessionTtl, 'FIELDS', '1', sessionId)
        .exec();

      response.sessionId = sessionId;
      response.stripeUrl = stripeRes.url;

      return response;
    } catch (e) {
      throw e;
    }
  }

  /**
  callback from stripe
  1. get redis data
  2. check status
  3. post balance
  */
  async stripeDepositSuccess(payload: DepositStripeSuccessRequest) {
    console.log('stripeDepositSuccess', payload);
    try {
      console.log('Here 0');

      var cacheData = await this.redis.hget('stripeDeposit', payload.id);

      console.log('cacheData', cacheData);

      //check duplication
      if (
        await this.prismaService.txnSucess.findUnique({
          where: { exId: payload.id },
        })
      ) {
        console.log('Here 0.5');
        return 'success';
      }

      //if null insert suspect and return
      if (!cacheData) {
        this.prismaService.depositSuspect.create({
          data: {
            exId: payload.id,
            method: 'stripe',
            desc: 'Cache not exist!',
          },
        });
        return;
      }
      console.log('Here 1');

      var txnData = JSON.parse(cacheData);
      //check amount if not match
      if (txnData.amt !== payload.amount_total) {
        this.prismaService.depositSuspect.create({
          data: {
            exId: payload.id,
            method: 'stripe',
            desc: 'Amount not matched!',
          },
        });
        return;
      }

      console.log('Here 2');

      var status = await stripeTxnStatus(payload.id);
      if (status?.payment_status !== 'paid') {
        this.prismaService.depositSuspect.create({
          data: {
            exId: payload.id,
            method: 'stripe',
            desc: 'Not paid!',
          },
        });
        return;
      }

      console.log('Here 3');

      var txnId = await this.otherService.getTxnId();
      var fundTxnRequest: FundTxnRequest = {
        asset: 'USD',
        batchId: txnId,
        debitAcc: 'STRIPELIA',
        creditAcc: txnData.userId + 'USD',
        amount: (txnData.amt / 100).toString(),
        narative: 'Stripe Deposit',
        txnCode: '2',
        userId: txnData.userId,
      };

      console.log('Here 4');
      var fundRes = await FundTxnService(fundTxnRequest);
      await this.prismaService.txnSucess.create({
        data: {
          exId: payload.id,
          txnId: fundRes.txnId,
        },
      });
      console.log('Here 5');
    } catch (e: any) {
      throw e;
    }
    return 'success';
  }
}
