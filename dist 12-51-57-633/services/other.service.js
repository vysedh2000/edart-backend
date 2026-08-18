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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtherService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OtherService = class OtherService {
    prismaService;
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getTxnId() {
        const txnId = await this.prismaService.$queryRaw `
    SELECT nextval('txn_id_seq') as seq
  `;
        const rawSeq = Number(txnId[0].seq);
        const dailySeq = rawSeq % 1000000 === 0 ? 1 : rawSeq % 1000000;
        const now = new Date();
        const year = now.getFullYear();
        const startOfYear = new Date(year, 0, 0);
        const diff = now.getTime() -
            startOfYear.getTime() +
            (startOfYear.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const formattedYear = year.toString();
        const formattedDay = dayOfYear.toString().padStart(3, '0');
        const formattedSeq = dailySeq.toString().padStart(6, '0');
        return `${formattedYear}${formattedDay}${formattedSeq}`;
    }
    async saveTxnSuspect(txnRequest) {
        await this.prismaService.txnSuspect.create({
            data: {
                batchId: txnRequest.batchId,
                asset: txnRequest.asset,
                debitAcc: txnRequest.debitAcc,
                creditAcc: txnRequest.creditAcc,
                txnCode: txnRequest.txnCode,
                amount: txnRequest.amount,
                narative: txnRequest.narative,
                userId: txnRequest.userId,
            },
        });
    }
};
exports.OtherService = OtherService;
exports.OtherService = OtherService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OtherService);
