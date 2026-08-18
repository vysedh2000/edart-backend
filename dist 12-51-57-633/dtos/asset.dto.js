"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetWalletResponse = exports.AssetWalletHeader = exports.AssetEvalu = exports.AssetValue = exports.AccSumResponse = exports.WalletDashbaordRequest = exports.SumAssetByAccRequest = exports.SumAssetByAccResponse = void 0;
class SumAssetByAccResponse {
    totalAmount;
}
exports.SumAssetByAccResponse = SumAssetByAccResponse;
class SumAssetByAccRequest {
    uid;
    ccy;
}
exports.SumAssetByAccRequest = SumAssetByAccRequest;
class WalletDashbaordRequest {
    uid;
    ccy;
}
exports.WalletDashbaordRequest = WalletDashbaordRequest;
class AccSumResponse {
    totalAmt;
    fiatAmt;
    cryptoAmt;
    stockAmt;
    ccy;
    assetPrice;
}
exports.AccSumResponse = AccSumResponse;
class AssetValue {
    symbol;
    name;
    value;
    equal;
    type;
}
exports.AssetValue = AssetValue;
class AssetEvalu {
    crypto;
    fiat;
    stock;
}
exports.AssetEvalu = AssetEvalu;
class AssetWalletHeader {
    ccy;
    total;
    equivalent;
    percent;
}
exports.AssetWalletHeader = AssetWalletHeader;
class AssetWalletResponse {
    header;
    asset;
}
exports.AssetWalletResponse = AssetWalletResponse;
