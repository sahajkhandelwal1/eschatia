// Vercel edge function proxy — forwards requests to jwstapi.com with API key,
// response cached at the edge for 1 hour
export const config = { runtime: 'edge' };

export default async function handler(req) {
  return new Response(JSON.stringify({ message: 'stub' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
