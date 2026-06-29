// api/watchlist.js — persistent watchlist synced to GitHub repo
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'amirohayon6/brief';
const FILE_PATH = 'content/watchlist.json';

const GH_HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'MarketBrief/1.0'
};

function authHeaders() {
  return GITHUB_TOKEN
    ? { ...GH_HEADERS, 'Authorization': `token ${GITHUB_TOKEN}` }
    : GH_HEADERS;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;

  if (req.method === 'GET') {
    try {
      const r = await fetch(url, { headers: authHeaders() });
      if (!r.ok) return res.status(r.status).json({ error: 'github fetch failed' });
      const data = await r.json();
      const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
      res.setHeader('Cache-Control', 'no-store');
      return res.json(content);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === 'POST') {
    if (!GITHUB_TOKEN) return res.status(503).json({ error: 'GITHUB_TOKEN not set' });
    try {
      const body = req.body;
      if (!Array.isArray(body) || !body.length)
        return res.status(400).json({ error: 'body must be non-empty array' });

      // get current SHA (required by GitHub API to update a file)
      const getR = await fetch(url, { headers: authHeaders() });
      if (!getR.ok) return res.status(getR.status).json({ error: 'github fetch failed' });
      const getData = await getR.json();

      const encoded = Buffer.from(JSON.stringify(body, null, 2) + '\n').toString('base64');
      const putR = await fetch(url, {
        method: 'PUT',
        headers: { ...authHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `watchlist: ${new Date().toISOString().split('T')[0]}`,
          content: encoded,
          sha: getData.sha,
          branch: 'main'
        })
      });

      if (!putR.ok) {
        const err = await putR.json();
        return res.status(putR.status).json({ error: err.message });
      }
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'method not allowed' });
};
