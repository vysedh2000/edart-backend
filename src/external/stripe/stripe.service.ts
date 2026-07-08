import { stripeSessionResponse } from './stripe.dto';

export async function stripeSession(
  amount: string,
): Promise<stripeSessionResponse> {
  const req = new URLSearchParams({
    mode: 'payment',
    success_url: 'http://localhost:3000',
    cancel_url: 'http://localhost:3000',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'USD',
    'line_items[0][price_data][unit_amount]': amount,
    'line_items[0][price_data][product_data][name]': 'Deposit',
  });
  console.log(req);
  try {
    const res = await fetch(`${getBaseUrl()}/v1/checkout/sessions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getStripeToken()}`,
      },
      body: req,
    });

    var result: stripeSessionResponse = await res.json();
    console.log(result);
    return result;
  } catch (e) {
    throw e;
  }
}

const getStripeToken = (): string => {
  const stripeToken = process.env.STRIPETOKEN!;
  return stripeToken;
};

const getBaseUrl = (): string => {
  const rawUrl = process.env.STRIPEURL ?? 'https://api.stripe.com';
  return rawUrl;
};
