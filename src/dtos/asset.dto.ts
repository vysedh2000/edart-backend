import { MarketPriceResponse } from '../external/market/market.dto';

export class SumAssetByAccResponse {
  totalAmount!: string;
}

export class SumAssetByAccRequest {
  uid!: string;
  ccy!: string;
}

export class WalletDashbaordRequest {
  uid!: string;
  ccy!: string;
}

export class AccSumResponse {
  totalAmt!: number;
  fiatAmt!: number;
  cryptoAmt!: number;
  stockAmt!: number;
  ccy!: string;
  assetPrice!: MarketPriceResponse[];
}

export class AssetValue {
  symbol!: string;
  name!: string;
  value!: number;
  equal!: number;
  type!: string;
}

export class AssetEvalu {
  crypto!: number;
  fiat!: number;
  stock!: number;
}

export class AssetWalletHeader {
  ccy!: string;
  total!: number;
  equivalent!: number;
  percent!: AssetEvalu;
}

export class AssetWalletResponse {
  header!: AssetWalletHeader;
  asset!: AssetValue[];
}
