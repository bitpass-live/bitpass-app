export type PaymentMethodType = 'LIGHTNING' | 'MERCADOPAGO';

export type PaymentMethod = {
  id: string;
  type: PaymentMethodType;
  lightningAddress?: string;
  lnurlCallback?: string;
  proxyPubkey?: string;
  mpAccountId?: string;
  createdAt: string;
  updatedAt: string;
};