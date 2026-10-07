export interface AiContextRequest {
  accountId: number;
  scope: string;
  requesterAgent: string;
}

export function useAiBridge() {
  async function readContext(
    gatewayUrl: string,
    token: string,
    request: AiContextRequest,
  ): Promise<unknown> {
    const response = await fetch(`${gatewayUrl}/v1/ai/context`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`context_request_failed_${response.status}`);
    }
    return response.json();
  }

  return { readContext };
}
