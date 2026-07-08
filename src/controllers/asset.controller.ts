import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AssetService } from '../services/asset.service';
import {
  SumAssetByAccRequest,
  WalletDashbaordRequest,
} from '../dtos/asset.dto';

@Controller('asset')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('sumbyacc')
  @HttpCode(HttpStatus.OK)
  async sumAssetByAcc(@Body() request: SumAssetByAccRequest) {
    return this.assetService.sumAssetByAcc(request);
  }

  @Post('walletSum')
  @HttpCode(HttpStatus.OK)
  async assetWallet(@Body() request: WalletDashbaordRequest) {
    return this.assetService.walletDashboard(request);
  }
}
