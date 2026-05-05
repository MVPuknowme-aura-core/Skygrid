const DEFAULT_UPSTREAM = 'https://aura-core-g8m2foy4d-home-e539c0b1.vercel.app';
const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 200;

const HOP_BY_HOP_HEADERS = [
  'connection',
  'keep-alive',
  'proxy-authorization',
  'proxy-authenticate',
  'te',
  'trailer',
  'trailers',
  'transfer-encoding',
  'upgrade',
];

export default {
  async fetch(request, env, ctx) {
    const requestUrl = new URL(request.url);
    const upstreamBase = env.SKYGRID_UPSTREAM || DEFAULT_UPSTREAM;

    if (requestUrl.pathname === '/health') {
      return Response.json({
        status: 'ok',
        service: 'SkyGrid Cloudflare Edge',
        upstream: upstreamBase,
        timestamp: new Date().toISOString(),
      }, {
        headers: securityHeaders(),
      });
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    const bodyBytes = await readBodyOnce(request);
    let lastError = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 1) {
        await sleep(INITIAL_BACKOFF_MS * 2 ** (attempt - 2));
      }

      try {
        const upstreamResponse = await fetch(buildUpstreamUrl(requestUrl, upstreamBase), {
          method: request.method,
          headers: upstreamRequestHeaders(request, upstreamBase),
          body: bodyBytes,
          redirect: 'manual',
        });

        if (upstreamResponse.status >= 500 && upstreamResponse.status < 600 && attempt < MAX_RETRIES) {
          lastError = new Error(`Upstream ${upstreamResponse.status}`);
          continue;
        }

        const headers = responseHeaders(upstreamResponse);
        logCookieMetadata(upstreamResponse, env, ctx);

        return new Response(upstreamResponse.body, {
          status: upstreamResponse.status,
          statusText: upstreamResponse.statusText,
          headers,
        });
      } catch (error) {
        lastError = error;
      }
    }

    return Response.json({
      status: 'degraded',
      service: 'SkyGrid Cloudflare Edge',
      message: 'Upstream unavailable — serving fallback',
      error: lastError?.message || 'unknown',
      timestamp: new Date().toISOString(),
    }, {
      status: 502,
      headers: fallbackHeaders(),
    });
  },
};

function buildUpstreamUrl(requestUrl, upstreamBase) {
  const upstream = new URL(upstreamBase);
  const out = new URL(requestUrl.toString());
  out.protocol = upstream.protocol;
  out.hostname = upstream.hostname;
  out.port = upstream.port;
  return out.toString();
}

function upstreamRequestHeaders(request, upstreamBase) {
  const upstream = new URL(upstreamBase);
  const headers = new Headers(request.headers);

  for (const header of HOP_BY_HOP_HEADERS) headers.delete(header);

  headers.set('host', upstream.hostname);
  headers.set('x-skygrid-edge', 'cloudflare-worker');
  headers.set('x-forwarded-host', new URL(request.url).host);

  return headers;
}

async function readBodyOnce(request) {
  if (request.method === 'GET' || request.method === 'HEAD') return undefined;
  return await request.arrayBuffer();
}

function responseHeaders(response) {
  const headers = new Headers(response.headers);

  for (const header of HOP_BY_HOP_HEADERS) headers.delete(header);

  headers.set('x-skygrid-edge', 'cloudflare-worker');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'strict-origin-when-cross-origin');

  if (!headers.has('cache-control')) {
    const contentType = headers.get('content-type') || '';
    const cacheValue = contentType.includes('text/html')
      ? 'public, max-age=30'
      : 'public, max-age=60';
    headers.set('cache-control', cacheValue);
  }

  for (const [key, value] of corsHeaders()) headers.set(key, value);

  return headers;
}

function corsHeaders() {
  return new Headers({
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers': 'Content-Type, Authorization, X-Requested-With',
    'access-control-expose-headers': 'x-skygrid-edge',
  });
}

function securityHeaders() {
  const headers = corsHeaders();
  headers.set('x-skygrid-edge', 'cloudflare-worker');
  headers.set('cache-control', 'no-store');
  headers.set('x-content-type-options', 'nosniff');
  return headers;
}

function fallbackHeaders() {
  const headers = securityHeaders();
  headers.set('cache-control', 'public, max-age=10');
  headers.set('content-type', 'application/json');
  return headers;
}

function logCookieMetadata(response, env, ctx) {
  if (!env.COOKIE_LOGGER || !ctx?.waitUntil) return;

  const getAll = typeof response.headers.getAll === 'function'
    ? response.headers.getAll.bind(response.headers)
    : null;
  const setCookies = getAll ? getAll('Set-Cookie') : [];

  if (!setCookies.length) return;

  const id = env.COOKIE_LOGGER.idFromName('global');
  const object = env.COOKIE_LOGGER.get(id);
  const entries = setCookies.map(parseSetCookie).map((entry) => ({
    ...entry,
    timestamp: new Date().toISOString(),
  }));

  ctx.waitUntil(object.fetch('https://cookie-logger.internal/append', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ entries }),
  }).catch((error) => console.error('Cookie metadata log failed', error.message)));
}

function parseSetCookie(setCookie) {
  const parts = setCookie.split(';').map((part) => part.trim()).filter(Boolean);
  const [nameValue, ...attrs] = parts;
  const eq = nameValue.indexOf('=');
  const name = eq >= 0 ? nameValue.slice(0, eq).trim() : nameValue;
  const out = { name };

  for (const attr of attrs) {
    const [rawKey, ...rest] = attr.split('=');
    const key = rawKey.toLowerCase();
    const value = rest.join('=').trim();

    if (key === 'path') out.path = value;
    else if (key === 'domain') out.domain = value;
    else if (key === 'max-age') out.maxAge = Number(value);
    else if (key === 'httponly') out.httpOnly = true;
    else if (key === 'secure') out.secure = true;
    else if (key === 'samesite') out.sameSite = value;
  }

  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
