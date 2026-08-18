import { Expose } from 'class-transformer';

export class createUserCore {
  fullname!: string;
  country!: string;
  nationality!: string;
  idnum!: string;
  idtype!: string;
  dob!: string;
}

export class createUserResponse {
  country!: string;
  uid!: string;
}

export class getAccSummaryResponse {
  assetList!: getAsset[];
}

export class getAsset {
  accNo!: string;
  workingBal!: number;
  asset!: string;
  category!: string;
}

export class FundTxnRequest {
  @Expose({ name: 'asset' })
  asset!: string;
  @Expose({ name: 'batchId' })
  batchId!: string;
  @Expose({ name: 'debitAcc' })
  debitAcc!: string;
  @Expose({ name: 'creditAcc' })
  creditAcc!: string;
  @Expose({ name: 'txnCode' })
  txnCode!: string;
  @Expose({ name: 'amount' })
  amount!: string;
  @Expose({ name: 'narative' })
  narative!: string;
  @Expose({ name: 'userId' })
  userId!: string;
}

export class FundTxnResponse {
  @Expose({ name: 'message' })
  message!: string;
  @Expose({ name: 'txnId' })
  txnId!: string;
}
