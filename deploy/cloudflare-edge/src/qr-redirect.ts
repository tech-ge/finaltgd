import type { Env } from './index.js';

export interface QrRedirectRecord {
  targetUrl: string;
  expiresAt: number;
  accountId: number;
}

export async function handleQrRedirect(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const code = url.pathname.replace('/edge/qr/', '');

  if (!/^[A-Za-z0-9-]{6,64}$/.test(code)) {
    return new Response('invalid_qr_code', { status: 400 });
  }

  const raw = await env.TECHGEO_KV.get(`qr:${code}`);
  if (!raw) {
    return new Response('qr_not_found', { status: 404 });
  }

  let record: QrRedirectRecord;
  try {
    record = JSON.parse(raw) as QrRedirectRecord;
  } catch {
    return new Response('qr_payload_invalid', { status: 422 });
  }

  if (record.expiresAt < Date.now()) {
    await env.TECHGEO_KV.delete(`qr:${code}`);
    return new Response('qr_expired', { status: 410 });
  }

  return Response.redirect(record.targetUrl, 302);
}
