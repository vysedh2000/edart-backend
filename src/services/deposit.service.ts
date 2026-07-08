import { Injectable } from '@nestjs/common';
import { stripeSession } from '../external/stripe/stripe.service';
import {
  DepositStripeRequest,
  DepositStripeResponse,
} from '../dtos/deposit.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { OtherService } from './other.service';

@Injectable()
export class DepositService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly otherService: OtherService,
  ) {}

  /**
   1. request stripe session
   2. save to redis
   3. response to fe
   */
  async stripeDeposit(payload: DepositStripeRequest) {
    try {
      var txnId = this.otherService.getTxnId();
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
}
