import { handleQrRedirect } from './qr-redirect.js';
import { checkRateLimit } from './rate-limit.js';
import { lookupGeoIp } from './geo-ip.js';

export interface Env {
  API_GATEWAY_URL: string;
  TECHGEO_KV: KVNamespace;
  TECHGEO_R2: R2Bucket;
  RATE_LIMIT_WINDOW_SECONDS?: string;
  RATE_LIMIT_MAX_REQUESTS?: string;
}

const DEFAULT_WINDOW_SECONDS = 60;
const DEFAULT_MAX_REQUESTS = 300;

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function clientKey(request: Request): string {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const ua = request.headers.get('User-Agent') ?? 'unknown';
  return `${ip}:${ua}`;
}

async function proxyToGateway(request: Request, env: Env): Promise<Response> {
  if (!env.API_GATEWAY_URL) {
    return new Response('api_gateway_unconfigured', { status: 503 });
  }

  const url = new URL(request.url);
  const target = new URL(url.pathname + url.search, env.API_GATEWAY_URL);

  const headers = new Headers(request.headers);
  headers.set('X-Forwarded-Host', url.host);
  headers.set('X-Edge-Region', (request as Request & { cf?: { colo?: string } }).cf?.colo ?? 'unknown');

  const proxied = new Request(target.toString(), {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
  });

  return fetch(proxied);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/edge/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname.startsWith('/edge/qr/')) {
      return handleQrRedirect(request, env);
    }

    const geo = lookupGeoIp(request);
    if (geo.country === 'BLOCKED') {
      return new Response('region_not_allowed', { status: 403 });
    }

    const windowSeconds = parsePositiveInt(
      env.RATE_LIMIT_WINDOW_SECONDS,
      DEFAULT_WINDOW_SECONDS,
    );
    const maxRequests = parsePositiveInt(
      env.RATE_LIMIT_MAX_REQUESTS,
      DEFAULT_MAX_REQUESTS,
    );

    const key = clientKey(request);
    const allowed = await checkRateLimit(env, key, windowSeconds, maxRequests);
    if (!allowed) {
      return new Response('rate_limit_exceeded', {
        status: 429,
        headers: {
          'Retry-After': String(windowSeconds),
        },
      });
    }

    return proxyToGateway(request, env);
  },
};
