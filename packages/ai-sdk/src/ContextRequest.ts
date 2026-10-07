export type Scope =
  | 'balance.read'
  | 'activity.read'
  | 'location.read'
  | 'microphone.read'
  | 'health.read'
  | 'business.read'
  | 'call.history.read';

export interface ContextRequestInput {
  accountId: number;
  scope: Scope;
  requesterAgent: string;
}

export interface ContextRequestResult {
  scope: Scope;
  data: Record<string, unknown>;
  grant: {
    scope: Scope;
    grantedAt: string;
    expiresAt: string;
  };
}

export interface ConsentInput {
  accountId: number;
  scope: string;
  granted: boolean;
}
