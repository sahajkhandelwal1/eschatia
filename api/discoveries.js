// Serverless proxy — fetches latest JWST JPG releases, filters to science images,
// and enriches with human-readable metadata. Cached 1hr at edge.
export default async function handler(req, res) {
  const count = parseInt(req.query?.count ?? '40', 10);

  const key = process.env.JWST_API_KEY ?? '';
  if (!key) {
    return res.status(500).json({ error: 'missing JWST_API_KEY' });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=3600');

  let upstreamRes;
  try {
    upstreamRes = await fetch('https://api.jwstapi.com/all/type/jpg', {
      headers: { 'X-API-KEY': key },
    });
  } catch (e) {
    return res.status(502).json({ error: 'upstream failed', detail: String(e) });
  }

  if (!upstreamRes.ok) {
    return res.status(502).json({ error: 'upstream failed', status: upstreamRes.status });
  }

  const envelope = await upstreamRes.json();
  const all = Array.isArray(envelope.body) ? envelope.body : [];

  // Filter out calibration frames (darks, rates, backgrounds) — keep science images
  const EXCLUDED_SUFFIXES = ['_dark', '_rate', '_bkg', '_flat', '_wht', '_asn'];
  const science = all.filter(item => {
    const suffix = item.details?.suffix ?? '';
    return !EXCLUDED_SUFFIXES.some(s => suffix.includes(s));
  });

  // Take most recent N, newest first
  const recent = science.slice(-count).reverse();

  return res.status(200).json(recent);
}
