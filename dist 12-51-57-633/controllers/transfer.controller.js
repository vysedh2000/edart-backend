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
exports.TransferController = void 0;
const common_1 = require("@nestjs/common");
const transfer_service_1 = require("../services/transfer.service");
const transfer_dto_1 = require("../dtos/transfer.dto");
let TransferController = class TransferController {
    transferService;
    constructor(transferService) {
        this.transferService = transferService;
    }
    async accFundTxn(request) {
        const txnId = await this.transferService.accFundTxnService(request);
        return txnId;
    }
};
exports.TransferController = TransferController;
__decorate([
    (0, common_1.Post)('accFundTxn'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [transfer_dto_1.AccFundTxnRequest]),
    __metadata("design:returntype", Promise)
], TransferController.prototype, "accFundTxn", null);
exports.TransferController = TransferController = __decorate([
    (0, common_1.Controller)('transfer'),
    __metadata("design:paramtypes", [transfer_service_1.TransferService])
], TransferController);
