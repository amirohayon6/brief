// api/news.js — fetches Yahoo Finance RSS and returns parsed news items
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=60');

  try {
    const r = await fetch('https://finance.yahoo.com/news/rssindex', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    });
    if (!r.ok) return res.status(r.status).json({ items: [] });
    const xml = await r.text();

    const items = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = itemRe.exec(xml)) !== null && items.length < 10) {
      const block = m[1];
      const get = (tag) => {
        const cdata = block.match(new RegExp(`<${tag}><\\!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`));
        if (cdata) return cdata[1].trim();
        const plain = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
        return plain ? plain[1].trim() : '';
      };
      const title = get('title');
      const pubDate = get('pubDate');
      if (!title) continue;

      // Parse time as HH:MM ET
      let time = '';
      try {
        const d = new Date(pubDate);
        time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York', hour12: false }) + ' ET';
      } catch(e) { time = 'חי'; }

      // Classify type by keywords
      let type = 'info';
      const low = title.toLowerCase();
      if (/surges?|jumps?|gains?|rises?|rally|soar|beat|record|upgrade/.test(low)) type = 'bull';
      else if (/falls?|drops?|slides?|plunges?|loss|decline|miss|downgrade|warn/.test(low)) type = 'bear';
      else if (/fed|fomc|rate|decision|meeting|report|data|earnings|ipo/.test(low)) type = 'event';

      // Extract ticker symbols mentioned ($AAPL style or known caps)
      const tickers = [];
      const tickerRe = /\$([A-Z]{1,5})\b/g;
      let tm;
      while ((tm = tickerRe.exec(title)) !== null) tickers.push(tm[1]);

      items.push({ title, time, type, tickers });
    }

    return res.json({ items, ts: Date.now() });
  } catch (e) {
    return res.status(500).json({ items: [], error: e.message });
  }
};
