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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetController = void 0;
const common_1 = require("@nestjs/common");
const asset_service_1 = require("../services/asset.service");
const asset_dto_1 = require("../dtos/asset.dto");
let AssetController = class AssetController {
    assetService;
    constructor(assetService) {
        this.assetService = assetService;
    }
    async sumAssetByAcc(request) {
        return this.assetService.sumAssetByAcc(request);
    }
    async assetWallet(request) {
        return this.assetService.walletDashboard(request);
    }
};
exports.AssetController = AssetController;
__decorate([
    (0, common_1.Post)('sumbyacc'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [asset_dto_1.SumAssetByAccRequest]),
    __metadata("design:returntype", Promise)
], AssetController.prototype, "sumAssetByAcc", null);
__decorate([
    (0, common_1.Post)('walletSum'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [asset_dto_1.WalletDashbaordRequest]),
    __metadata("design:returntype", Promise)
], AssetController.prototype, "assetWallet", null);
exports.AssetController = AssetController = __decorate([
    (0, common_1.Controller)('asset'),
    __metadata("design:paramtypes", [asset_service_1.AssetService])
], AssetController);
