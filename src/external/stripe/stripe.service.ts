import { stripeSessionResponse } from './stripe.dto';

export async function stripeSession(
  amount: string,
): Promise<stripeSessionResponse> {
  const req = new URLSearchParams({
    mode: 'payment',
    success_url: 'http://localhost:3000/en/wallet',
    cancel_url: 'http://localhost:3000',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'USD',
    'line_items[0][price_data][unit_amount]': amount,
    'line_items[0][price_data][product_data][name]': 'Deposit',
  });
  try {
    const res = await fetch(`${getBaseUrl()}/v1/checkout/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getStripeToken()}`,
      },
      body: req,
    });

    var result: stripeSessionResponse = await res.json();
    return result;
  } catch (e) {
    throw e;
  }
}

export async function stripeTxnStatus(sessionId: string) {
  try {
    const res = await fetch(
      `${getBaseUrl()}/v1/checkout/sessions/${sessionId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getStripeToken()}`,
        },
      },
    );
    var result: any = await res.json();
  } catch (e) {
    throw e;
  }
  return result;
}

const getStripeToken = (): string => {
  const stripeToken = process.env.STRIPETOKEN!;
  return stripeToken;
};

const getBaseUrl = (): string => {
  const rawUrl = process.env.STRIPEURL ?? 'https://api.stripe.com';
  return rawUrl;
};
