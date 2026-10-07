import type { ApiClient } from './client';

export interface DepositRequest {
  accountId: number;
  fiatAmount: string;
  fiatCurrency: string;
  gatewayReference: string;
  gatewayName: 'mpesa' | 'bank';
}

export interface DepositResponse {
  depositId: number;
}

export interface SendRequest {
  fromAccount: number;
  toAccount: number;
  amount: string;
  idempotencyKey: string;
  memo?: string;
}

export interface SendResponse {
  transferId: number;
  reference: string;
  amount: string;
}

export interface BalanceResponse {
  accountId: number;
  balance: string;
  currency: string;
}

export class CurrencyApi {
  constructor(private readonly client: ApiClient) {}

  async deposit(input: DepositRequest): Promise<DepositResponse> {
    return this.client.post<DepositResponse>('/v1/wallet/deposit', input);
  }

  async send(input: SendRequest): Promise<SendResponse> {
    return this.client.post<SendResponse>('/v1/wallet/send', input);
  }

  async balance(accountId: number): Promise<BalanceResponse> {
    return this.client.get<BalanceResponse>(`/v1/wallet/balance/${accountId}`);
  }
}
