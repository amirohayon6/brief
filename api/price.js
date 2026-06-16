// api/price.js — Vercel serverless proxy for Yahoo Finance (bypasses browser CORS)
module.exports = async function handler(req, res) {
  const sym = (req.query.sym || '').toUpperCase().replace(/[^A-Z0-9.\-]/g, '');
  if (!sym) return res.status(400).json({ error: 'missing sym' });

  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=1d`,
      { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } }
    );
    if (!r.ok) return res.status(r.status).json({ error: 'upstream error' });
    const data = await r.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
