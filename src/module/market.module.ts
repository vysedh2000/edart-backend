import { Module } from '@nestjs/common';
import { OtherService } from '../services/other.service';
import { MarketController } from '../controllers/market.controller';
import { MarketService } from '../services/market.service';

@Module({
  controllers: [MarketController],
  providers: [MarketService, OtherService],
})
export class MarketModule {}
