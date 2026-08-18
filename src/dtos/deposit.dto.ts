export class DepositStripeResponse {
  sessionId!: string;
  stripeUrl!: string;
}

export class DepositStripeRequest {
  userId!: string;
  amount!: number;
}

export class StripeWebhookRequest {
  data!: StripeEventData;
}

export class StripeEventData {
  object!: DepositStripeSuccessRequest;
}

export class DepositStripeSuccessRequest {
  id!: string;
  amount_total!: number;
}
