import { Controller, Get } from '@nestjs/common';

@Controller('market')
export class MarketController {
  @Get('crypto')
  async getCrypto() {
    return '';
  }
}
