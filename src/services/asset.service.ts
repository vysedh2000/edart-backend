import { InjectRedis } from '@nestjs-modules/ioredis';
import { PrismaService } from '../prisma/prisma.service';
import Redis from 'ioredis';
import { getAccSummaryResponse } from '../external/core/core.dto';
import { getAssetsByUserId } from '../external/core/core.service';
import { getRates } from '../external/market/market.service';
import {
  AccSumResponse,
  AssetEvalu,
  AssetValue,
  AssetWalletHeader,
  AssetWalletResponse,
  WalletDashbaordRequest,
} from '../dtos/asset.dto';
import { convertAssetToPercent } from '../utils/asset.util';
import { MarketPriceResponse } from '../external/market/market.dto';

export class AssetService {
  constructor(
    private readonly prismaService: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async sumAssetByAcc(request: any) {
    try {
      var response: AccSumResponse = new AccSumResponse();
      var totalAmt: number = 0;
      var cryptoAmt: number = 0; //category 2
      var stockAmt: number = 0; //category 3
      var fiatAmt: number = 0; //category 1
      const accAssetList: getAccSummaryResponse = await getAssetsByUserId(
        request.uid,
      );
      const symbolsToFetch = accAssetList.assetList.map((asset) => asset.asset);
      const marketData = await getRates(symbolsToFetch.toString());
      for (const asset of accAssetList.assetList) {
        if (request.ccy === asset.asset) {
          totalAmt += asset.workingBal;
          fiatAmt += asset.workingBal;
          break;
        }
        const marketInfo = marketData.find(
          (data) => data.symbol === asset.asset,
        );
        if (marketInfo) {
          console.log('value', request.ccy, asset.asset);
          const rawAmount: number = asset.workingBal * marketInfo.price;
          const totalAmount: number = Number(
            new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              roundingMode: 'halfEven',
            } as Intl.NumberFormatOptions)
              .format(rawAmount)
              .replace(/,/g, ''),
          );
          totalAmt += totalAmount;
          switch (asset.category) {
            case '1':
              fiatAmt += totalAmount;
              break;
            case '2':
              cryptoAmt += totalAmount;
              break;
            case '3':
              stockAmt += totalAmount;
              break;
          }
        }
      }
      var pricingResponse = marketData.filter(
        (item) => item.symbol !== request.ccy,
      );
      response.totalAmt = totalAmt;
      response.fiatAmt = fiatAmt;
      response.cryptoAmt = cryptoAmt;
      response.stockAmt = stockAmt;
      response.ccy = request.ccy;
      response.assetPrice = pricingResponse;
      return response;
    } catch (e: any) {
      throw new e();
    }
  }

  async walletDashboard(request: WalletDashbaordRequest) {
    try {
      var response = new AssetWalletResponse();
      var walletHeader = new AssetWalletHeader();
      var percent = new AssetEvalu();
      var totalAmt = 0;
      var fiatAmt = 0; //1
      var cryptoAmt = 0; //2
      var stockAmt = 0; //3

      //header section
      const accAssetList: getAccSummaryResponse = await getAssetsByUserId(
        request.uid,
      );
      const symbolsToFetch = accAssetList.assetList.map((asset) => asset.asset);
      if (!symbolsToFetch.includes('BTC')) {
        symbolsToFetch.push('BTC');
      }
      const marketData = await getRates(symbolsToFetch.toString());
      const valueByAsset: AssetValue[] = [];
      for (const asset of accAssetList.assetList) {
        const marketInfo = marketData.find(
          (data) => data.symbol === asset.asset,
        )!;
        if (asset.asset == request.ccy) {
          totalAmt += asset.workingBal;
          if (asset.category == '1') {
            valueByAsset.push({
              symbol: asset.asset,
              value: asset.workingBal,
              name: marketInfo.name,
              type: asset.category,
              equal: asset.workingBal,
            });
            fiatAmt += asset.workingBal;
          } else {
            cryptoAmt += asset.workingBal;
          }
          break;
        }

        if (marketInfo) {
          const rawAmt = asset.workingBal * marketInfo.price;
          const totalAmount: number = Number(
            new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              roundingMode: 'halfEven',
            } as Intl.NumberFormatOptions)
              .format(rawAmt)
              .replace(/,/g, ''),
          );
          totalAmt += totalAmount;
          switch (asset.category) {
            case '1':
              fiatAmt += totalAmount;
              break;
            case '2':
              cryptoAmt += totalAmount;
              break;
            case '3':
              stockAmt += totalAmount;
              break;
          }
          if (totalAmount > 0) {
            valueByAsset.push({
              symbol: asset.asset,
              value: asset.workingBal,
              name: marketInfo.name,
              type: asset.category,
              equal: totalAmount,
            });
          }
        }
      }
      //btc price
      var btcPrice: MarketPriceResponse = marketData
        .filter((item) => item.symbol == 'BTC')
        .at(0)!;

      //set response
      response.asset = valueByAsset;
      percent.fiat = convertAssetToPercent(fiatAmt, totalAmt);
      percent.crypto = convertAssetToPercent(cryptoAmt, totalAmt);
      percent.stock = convertAssetToPercent(stockAmt, totalAmt);
      walletHeader.percent = percent;
      walletHeader.ccy = request.ccy;
      walletHeader.equivalent = parseFloat(
        (totalAmt / btcPrice.price).toFixed(8),
      );
      walletHeader.total = totalAmt;
      response.header = walletHeader;

      return response;
    } catch (e: any) {
      throw e;
    }
  }
}
