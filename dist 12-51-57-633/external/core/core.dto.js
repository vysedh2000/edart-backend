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
exports.FundTxnResponse = exports.FundTxnRequest = exports.getAsset = exports.getAccSummaryResponse = exports.createUserResponse = exports.createUserCore = void 0;
const class_transformer_1 = require("class-transformer");
class createUserCore {
    fullname;
    country;
    nationality;
    idnum;
    idtype;
    dob;
}
exports.createUserCore = createUserCore;
class createUserResponse {
    country;
    uid;
}
exports.createUserResponse = createUserResponse;
class getAccSummaryResponse {
    assetList;
}
exports.getAccSummaryResponse = getAccSummaryResponse;
class getAsset {
    accNo;
    workingBal;
    asset;
    category;
}
exports.getAsset = getAsset;
class FundTxnRequest {
    asset;
    batchId;
    debitAcc;
    creditAcc;
    txnCode;
    amount;
    narative;
    userId;
}
exports.FundTxnRequest = FundTxnRequest;
__decorate([
    (0, class_transformer_1.Expose)({ name: 'asset' }),
    __metadata("design:type", String)
], FundTxnRequest.prototype, "asset", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'batchId' }),
    __metadata("design:type", String)
], FundTxnRequest.prototype, "batchId", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'debitAcc' }),
    __metadata("design:type", String)
], FundTxnRequest.prototype, "debitAcc", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'creditAcc' }),
    __metadata("design:type", String)
], FundTxnRequest.prototype, "creditAcc", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'txnCode' }),
    __metadata("design:type", String)
], FundTxnRequest.prototype, "txnCode", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'amount' }),
    __metadata("design:type", Number)
], FundTxnRequest.prototype, "amount", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'narative' }),
    __metadata("design:type", String)
], FundTxnRequest.prototype, "narative", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'userId' }),
    __metadata("design:type", String)
], FundTxnRequest.prototype, "userId", void 0);
class FundTxnResponse {
    message;
    txnId;
}
exports.FundTxnResponse = FundTxnResponse;
__decorate([
    (0, class_transformer_1.Expose)({ name: 'message' }),
    __metadata("design:type", String)
], FundTxnResponse.prototype, "message", void 0);
__decorate([
    (0, class_transformer_1.Expose)({ name: 'txnId' }),
    __metadata("design:type", String)
], FundTxnResponse.prototype, "txnId", void 0);
