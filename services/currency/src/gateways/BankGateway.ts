export interface BankIngestInput {
  accountNumber: string;
  amount: string;
  currency: string;
  reference: string;
  receivedAt: string;
}

export interface BankGatewayConfig {
  webhookSecret: string;
}

export class BankGateway {
  constructor(private readonly config: BankGatewayConfig) {}

  normalize(input: BankIngestInput): {
    fiatAmount: string;
    fiatCurrency: string;
    gatewayReference: string;
    gatewayName: string;
  } {
    return {
      fiatAmount: input.amount,
      fiatCurrency: input.currency.toUpperCase(),
      gatewayReference: input.reference,
      gatewayName: 'bank',
    };
  }

  get secret(): string {
    return this.config.webhookSecret;
  }
}
