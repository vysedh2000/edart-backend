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
exports.TransferService = void 0;
const ioredis_1 = require("@nestjs-modules/ioredis");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const ioredis_2 = __importDefault(require("ioredis"));
const other_service_1 = require("./other.service");
const core_dto_1 = require("../external/core/core.dto");
const core_service_1 = require("../external/core/core.service");
let TransferService = class TransferService {
    prismaService;
    otherService;
    redis;
    constructor(prismaService, otherService, redis) {
        this.prismaService = prismaService;
        this.otherService = otherService;
        this.redis = redis;
    }
    async accFundTxnService(request) {
        const txnId = await this.otherService.getTxnId();
        var txnRequest = new core_dto_1.FundTxnRequest();
        txnRequest.asset = request.asset;
        txnRequest.batchId = txnId;
        txnRequest.debitAcc = request.sender;
        txnRequest.creditAcc = request.receiver;
        txnRequest.txnCode = '1';
        txnRequest.amount = request.amount;
        txnRequest.narative = 'Transfer @@ to @@';
        txnRequest.userId = request.userId;
        const response = await (0, core_service_1.FundTxnService)(txnRequest);
        if (response.message !== 'Transaction successful') {
            await this.otherService.saveTxnSuspect(txnRequest);
        }
        return txnId;
    }
};
exports.TransferService = TransferService;
exports.TransferService = TransferService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        other_service_1.OtherService,
        ioredis_2.default])
], TransferService);
