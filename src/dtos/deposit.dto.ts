export class DepositStripeResponse {
  sessionId!: string;
  stripeUrl!: string;
}

export class DepositStripeRequest {
  userId!: string;
  amount!: number;
}
