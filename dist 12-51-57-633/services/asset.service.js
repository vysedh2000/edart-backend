"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const ioredis_1 = require("@nestjs-modules/ioredis");
const prisma_service_1 = require("../prisma/prisma.service");
const ioredis_2 = __importDefault(require("ioredis"));
const core_service_1 = require("../external/core/core.service");
const market_service_1 = require("../external/market/market.service");
const asset_dto_1 = require("../dtos/asset.dto");
let AssetService = class AssetService {
    prismaService;
    redis;
    constructor(prismaService, redis) {
        this.prismaService = prismaService;
        this.redis = redis;
    }
    async sumAssetByAcc(request) {
        try {
            var response = new asset_dto_1.AccSumResponse();
            var totalAmt = 0;
            var cryptoAmt = 0; //category 2
            var stockAmt = 0; //category 3
            var fiatAmt = 0; //category 1
            const accAssetList = await (0, core_service_1.getAssetsByUserId)(request.uid);
            const symbolsToFetch = accAssetList.assetList.map((asset) => asset.asset);
            const marketData = await (0, market_service_1.getRates)(symbolsToFetch.toString());
            for (const asset of accAssetList.assetList) {
                if (request.ccy === asset.asset) {
                    totalAmt += asset.workingBal;
                    fiatAmt += asset.workingBal;
                    break;
                }
                const marketInfo = marketData.find((data) => data.symbol === asset.asset);
                if (marketInfo) {
                    console.log('value', request.ccy, asset.asset);
                    const rawAmount = asset.workingBal * marketInfo.price;
                    const totalAmount = Number(new Intl.NumberFormat('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                        roundingMode: 'halfEven',
                    })
                        .format(rawAmount)
                        .replace(/,/g, ''));
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
            response.totalAmt = totalAmt;
            response.fiatAmt = fiatAmt;
            response.cryptoAmt = cryptoAmt;
            response.stockAmt = stockAmt;
            response.ccy = request.ccy;
            response.assetPrice = marketData;
            return response;
        }
        catch (e) {
            throw new e();
        }
    }
    async walletDashboard(request) {
        try {
            var response = new asset_dto_1.AssetWalletResponse();
            var walletHeader = new asset_dto_1.AssetWalletHeader();
            var percent = new asset_dto_1.AssetEvalu();
            var assetSumData = await this.sumAssetByAcc({
                uid: request.uid,
                ccy: request.ccy,
            });
            percent.fiat = parseFloat(((assetSumData.fiatAmt / assetSumData.totalAmt) * 100).toFixed(2));
            //header section
            // const accAssetList: getAccSummaryResponse = await getAssetsByUserId(
            //   request.uid,
            // );
            // const symbolsToFetch = accAssetList.assetList.map((asset) => asset.asset);
            // const marketData = await getRates(symbolsToFetch.toString());
            // for (const asset of accAssetList.assetList) {
            //   if (asset.asset == request.ccy) {
            //     totalAmt += asset.workingBal;
            //     if (asset.category == '1') {
            //       fiatAmt += asset.workingBal;
            //     } else {
            //       cryptoAmt += asset.workingBal;
            //     }
            //     break;
            //   }
            //   const marketInfo = marketData.find(
            //     (data) => data.symbol === asset.asset,
            //   );
            //   if (marketInfo) {
            //     const rawAmt = asset.workingBal * marketInfo.price;
            //     const totalAmount: number = Number(
            //       new Intl.NumberFormat('en-US', {
            //         minimumFractionDigits: 2,
            //         maximumFractionDigits: 2,
            //         roundingMode: 'halfEven',
            //       } as Intl.NumberFormatOptions)
            //         .format(rawAmt)
            //         .replace(/,/g, ''),
            //     );
            //     totalAmt += totalAmount;
            //     switch (asset.category) {
            //       case '1':
            //         fiatAmt += totalAmount;
            //       case '2':
            //         cryptoAmt += totalAmount;
            //       case '3':
            //         stockAmt += totalAmount;
            //     }
            //   }
            // }
        }
        catch (e) {
            throw new e();
        }
    }
};
exports.AssetService = AssetService;
exports.AssetService = AssetService = __decorate([
    __param(1, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        ioredis_2.default])
], AssetService);
