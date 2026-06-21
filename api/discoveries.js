// Vercel edge function proxy — forwards requests to jwstapi.com with API key,
// response cached at the edge for 1 hour
export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const limit = url.searchParams.get('limit');

  const upstreamUrl = new URL('https://api.jwstapi.com/all/latest');
  if (limit) upstreamUrl.searchParams.set('limit', limit);

  let upstreamRes;
  try {
    upstreamRes = await fetch(upstreamUrl.toString(), {
      headers: {
        'X-API-KEY': process.env.JWST_API_KEY ?? '',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'upstream failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!upstreamRes.ok) {
    return new Response(JSON.stringify({ error: 'upstream failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const data = await upstreamRes.text();

  return new Response(data, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=3600',
    },
  });
}
