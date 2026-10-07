export interface ContextRequest {
  accountId: number;
  scope: string;
  requesterAgent: string;
}

export interface ContextResult {
  scope: string;
  data: Record<string, unknown>;
  grant: {
    scope: string;
    grantedAt: string;
    expiresAt: string;
  };
}

export async function readContext(
  baseUrl: string,
  token: string,
  request: ContextRequest,
): Promise<ContextResult> {
  const response = await fetch(`${baseUrl}/context/read`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`context_read_failed_${response.status}`);
  }
  return (await response.json()) as ContextResult;
}
