#!/usr/bin/env python3
"""
scripts/build.py
Reads content/daily.md → assembles dist/index.html
Run: python3 scripts/build.py

Only daily.md changes each day. Everything else is static.
"""

import re
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DAILY_MD  = os.path.join(ROOT, 'content', 'daily.md')
ANALYSTS  = os.path.join(ROOT, 'src', 'analysts.js')
UI_JS     = os.path.join(ROOT, 'src', 'ui.js')
STYLE_CSS = os.path.join(ROOT, 'src', 'style.css')
DIST      = os.path.join(ROOT, 'dist', 'index.html')

os.makedirs(os.path.join(ROOT, 'dist'), exist_ok=True)

# ── Parse daily.md ────────────────────────────────────────────────────────

def parse_daily(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()

    data = {}

    # Meta
    meta = {}
    for line in re.findall(r'^(\w[^:]+):\s*(.+)$', text[:500], re.M):
        meta[line[0].strip()] = line[1].strip().strip('"')
    data['meta'] = meta

    # Ticker
    ticker_block = re.search(r'## ticker\n(.+?)(?=\n##)', text, re.S)
    tickers = []
    if ticker_block:
        for row in re.findall(r'^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|', ticker_block.group(1), re.M):
            sym, price, chg, dir_ = [x.strip() for x in row]
            if sym == 'sym': continue
            try:
                tickers.append({'sym': sym, 'price': price, 'chg': chg, 'dir': int(dir_)})
            except:
                pass
    data['ticker'] = tickers

    # Stocks
    stocks = {}
    for stock_block in re.finditer(r'### (\w+)\n(.+?)(?=\n###|\n## |\Z)', text, re.S):
        sym = stock_block.group(1)
        block = stock_block.group(2)
        s = {}
        for key in ['price', 'chg', 'dir', 'summary']:
            m = re.search(rf'^{key}:\s*(.+)$', block, re.M)
            if m:
                val = m.group(1).strip()
                s[key] = int(val) if key == 'dir' else val
        # News items
        news = []
        for nm in re.finditer(r'- color:\s*"([^"]+)"\s*\n\s*text:\s*(.+)', block):
            news.append({'c': nm.group(1), 't': nm.group(2).strip().strip('"')})
        s['news'] = news
        stocks[sym] = s
    data['stocks'] = stocks

    # Flash
    flash = []
    flash_block = re.search(r'## flash\n(.+?)(?=\n## |\Z)', text, re.S)
    if flash_block:
        for item_match in re.finditer(r'- type:\s*(\S+)\s*\n\s*time:\s*(.+)\s*\n\s*tag:\s*(.+)\s*\n\s*tickers:\s*\[([^\]]*)\]\s*\n\s*txt:\s*(.+)', flash_block.group(1)):
            tickers_raw = item_match.group(4).strip()
            tickers_list = [t.strip() for t in tickers_raw.split(',') if t.strip()]
            flash.append({
                'type': item_match.group(1).strip(),
                'time': item_match.group(2).strip().strip('"'),
                'tag':  item_match.group(3).strip().strip('"'),
                'tickers': tickers_list,
                'txt':  item_match.group(5).strip().strip('"'),
            })
    data['flash'] = flash

    return data


# ── Generate JS from parsed data ──────────────────────────────────────────

def escape_js(s):
    """Escape string for use inside JS double-quoted string."""
    return s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ')

def data_to_js(data):
    lines = []

    # Ticker
    lines.append('var TICKER_DATA = [')
    for t in data['ticker']:
        lines.append(f'  {{sym:"{escape_js(t["sym"])}",price:"{escape_js(t["price"])}",chg:"{escape_js(t["chg"])}",dir:{t["dir"]}}},')
    lines.append('];')
    lines.append('')

    # Stock updates (price/chg/dir/summary/news only — analysts stay in analysts.js)
    lines.append('var DAILY = {')
    for sym, s in data['stocks'].items():
        news_js = ','.join(f'{{c:"{escape_js(n["c"])}",t:"{escape_js(n["t"])}"}}'
                          for n in s.get('news', []))
        lines.append(f'  {sym}: {{')
        lines.append(f'    price:"{escape_js(s.get("price",""))}",')
        lines.append(f'    chg:"{escape_js(s.get("chg",""))}",')
        lines.append(f'    dir:{s.get("dir", 0)},')
        lines.append(f'    summary:"{escape_js(s.get("summary",""))}",')
        lines.append(f'    news:[{news_js}]')
        lines.append('  },')
    lines.append('};')
    lines.append('')

    # Flash
    lines.append('var FLASH = [')
    for item in data['flash']:
        tickers_js = ','.join(f'"{t}"' for t in item['tickers'])
        lines.append(f'  {{type:"{escape_js(item["type"])}",time:"{escape_js(item["time"])}",tag:"{escape_js(item["tag"])}",tickers:[{tickers_js}],txt:"{escape_js(item["txt"])}"}},')
    lines.append('];')
    lines.append('')

    # Merge DAILY into SD (price/chg/dir/summary/news)
    lines.append('''
// Merge daily content into SD
Object.keys(DAILY).forEach(function(sym) {
  if (SD[sym]) {
    SD[sym].price   = DAILY[sym].price;
    SD[sym].chg     = DAILY[sym].chg;
    SD[sym].dir     = DAILY[sym].dir;
    SD[sym].summary = DAILY[sym].summary;
    SD[sym].news    = DAILY[sym].news;
  }
});

// Apply ticker
function renderTicker() {
  var bar = document.getElementById('ticker-bar');
  if (!bar) return;
  bar.innerHTML = TICKER_DATA.map(function(t) {
    var cls = t.dir > 0 ? 'up' : t.dir < 0 ? 'dn' : 'nt';
    return '<div class="tk"><span class="tks">' + t.sym +
           '</span><span class="tkp ' + cls + '">' + t.price +
           '</span><span class="tkc ' + cls + '">' + t.chg + '</span></div>';
  }).join('');
}
''')

    return '\n'.join(lines)


# ── Build HTML ────────────────────────────────────────────────────────────

def build(data):
    with open(ANALYSTS,  'r', encoding='utf-8') as f: analysts_js  = f.read()
    with open(UI_JS,     'r', encoding='utf-8') as f: ui_js        = f.read()
    with open(STYLE_CSS, 'r', encoding='utf-8') as f: style_css    = f.read()

    meta  = data['meta']
    daily_js = data_to_js(data)

    date_str       = meta.get('date', '')
    date_short     = meta.get('date_short', '')
    updated        = meta.get('updated', '10:30')
    next_brief     = meta.get('next_brief', 'מחר 10:30')

    html = f"""<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Market Brief · {date_short}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.26.0/tabler-icons.min.css">
<style>
{style_css}
</style>
</head>
<body>
<div class="app">

<!-- LOADER -->
<div class="loader" id="ldr">
  <div class="loader-logo">
    <div class="loader-mark"><i class="ti ti-chart-bar"></i></div>
    <span class="loader-name">Market Brief</span>
  </div>
  <div class="loader-bar"><div class="loader-fill"></div></div>
  <div class="loader-txt">טוען סקירת שוק...</div>
</div>

<!-- TOPBAR -->
<div class="topbar">
  <div class="logo">
    <div class="lmark"><i class="ti ti-chart-bar"></i></div>
    <span class="lname">Market Brief</span>
  </div>
  <div style="display:flex;align-items:center;gap:9px">
    <div class="live-badge"><span class="ldot"></span>חי</div>
    <button class="setbtn" onclick="openEdit()" aria-label="ערוך מניות"><i class="ti ti-settings"></i></button>
  </div>
</div>

<!-- TICKER -->
<div class="ticker" id="ticker-bar"></div>

<!-- SCREEN: HOME -->
<div class="screen" id="scr-home" style="display:block">
  <div class="home-hdr">
    <div class="home-date">{date_str}</div>
    <div class="home-title">בוקר טוב &#x1F44B;</div>
  </div>
  <div class="feed-wrap">
    <div class="feed-top">
      <span class="pulse-dot"></span>
      <span class="feed-lbl">עדכונים חמים</span>
      <span class="feed-time">{date_str} · {updated}</span>
    </div>
    <div class="feed-list" id="feed-list"></div>
  </div>
  <div class="wl-section">
    <div class="sec-hdr">
      <span class="sec-title">המניות שלי</span>
      <button class="edit-link" onclick="openEdit()"><i class="ti ti-edit" style="font-size:13px"></i>ערוך</button>
    </div>
    <div class="wl-grid" id="wl-mini"></div>
  </div>
  <div class="next-card">
    <div>
      <div class="nc-lbl">הסקירה הבאה</div>
      <div class="nc-title">{next_brief}</div>
      <div class="nc-sub">מתעדכן כל יום בשעה 10:30</div>
    </div>
    <button class="nc-btn" onclick="gotoScreen('brief')">לסקירה &#x2190;</button>
  </div>
  <div class="footer">&#x26A0;&#xFE0F; לצרכי מידע בלבד &#xB7; אינו מהווה המלצת השקעה<br>Market Brief &#xB7; {date_short}</div>
</div>

<!-- SCREEN: BRIEF -->
<div class="screen" id="scr-brief" style="display:none">
  <div class="brief-hdr">
    <div class="brief-date">סקירה יומית &#xB7; {date_short}</div>
    <div style="display:flex;align-items:center;gap:7px">
      <span class="upd-badge">עודכן {updated}</span>
      <button onclick="openEdit()" style="background:var(--gold);color:var(--navy);border:none;border-radius:99px;padding:5px 12px;font-size:11px;font-weight:800;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px">
        <i class="ti ti-edit" style="font-size:13px"></i>ערוך מניות
      </button>
    </div>
  </div>
  <div class="disc"><i class="ti ti-alert-triangle"></i><span>לחץ על כרטיסיית מניה לניתוח מלא. אינו מהווה המלצת השקעה.</span></div>
  <div class="brief-cards" id="brief-cards"></div>
  <div style="padding:0 16px 24px;text-align:center;font-size:10px;color:var(--text3);line-height:1.8">
    &#x26A0;&#xFE0F; לצרכי מידע בלבד &#xB7; אינו מהווה המלצת השקעה<br>{date_short}
  </div>
</div>

<!-- SCREEN: NEWS -->
<div class="screen" id="scr-news" style="display:none">
  <div class="brief-hdr">
    <div class="brief-date">חדשות שוק</div>
    <div style="display:flex;align-items:center;gap:7px">
      <div class="live-badge"><span class="ldot"></span>חי</div>
    </div>
  </div>
  <div class="feed-wrap">
    <div class="feed-top">
      <span class="pulse-dot"></span>
      <span class="feed-lbl">חדשות בזמן אמת</span>
      <span class="feed-time">מתרענן כל 15 דקות</span>
    </div>
    <div class="feed-list" id="news-list"></div>
  </div>
</div>

<!-- STOCK OVERLAY -->
<div class="overlay" id="ov">
  <div class="ov-wrap">
    <div class="ov-nav">
      <button class="back-btn" onclick="closeOv()"><i class="ti ti-arrow-right"></i></button>
      <div><div class="ovttl" id="ov-ttl"></div><div class="ovsub" id="ov-sub"></div></div>
    </div>
    <div class="dh">
      <div class="dh-l">
        <div class="dhic" id="ov-ic"></div>
        <div><div class="dhsym" id="ov-sym"></div><div class="dhnm" id="ov-nm"></div></div>
      </div>
      <div><div class="dhpr" id="ov-pr"></div><div class="dhchg" id="ov-chg"></div></div>
    </div>
    <div class="ov-itabs" id="ov-tabs">
      <button class="itab on" onclick="sIT('a',this)">אנליסטים</button>
      <button class="itab" onclick="sIT('t',this)">טכני</button>
      <button class="itab" onclick="sIT('f',this)">פיננסי</button>
      <button class="itab" onclick="sIT('n',this)">חדשות</button>
    </div>
    <div class="ov-body" id="ov-body"></div>
    <div style="padding:0 16px 16px">
      <button onclick="closeOv()" style="width:100%;background:var(--navy);color:#fff;border:none;border-radius:var(--r);padding:12px;font-size:13px;font-weight:800;cursor:pointer;font-family:inherit">
        <i class="ti ti-arrow-right" style="vertical-align:middle;margin-left:5px"></i>חזרה לסקירת היום
      </button>
    </div>
  </div>
</div>

<!-- EDIT SHEET -->
<div class="sheet-bg" id="editBG" onclick="bgClick(event)">
  <div class="sheet">
    <div class="shandle"></div>
    <div class="sttl"><i class="ti ti-adjustments-horizontal" style="font-size:17px;color:var(--navy)"></i>הוסף / ערוך מניות</div>
    <div class="ssub">שינויים נשמרים אוטומטית ויופיעו בסקירה מחר.</div>
    <div class="priv"><i class="ti ti-shield-check"></i><span>הרשימה מסונכרנת עם הסקירה היומית.</span></div>
    <div id="editList"></div>
    <div class="srchwrap">
      <i class="ti ti-search sico"></i>
      <input class="si" id="searchI" type="text" placeholder="חפש: AAPL, Tesla, אפקון..." oninput="doSearch(this.value)" autocomplete="off">
    </div>
    <div class="sr-list" id="searchRes"></div>
    <button class="savebtn" onclick="saveEdit()">שמור שינויים</button>
  </div>
</div>

</div>

<!-- BOTTOM NAV -->
<div class="bottom-nav">
  <button class="nav-btn on" id="nav-home" onclick="gotoScreen('home')">
    <i class="ti ti-home"></i><span>בית</span>
  </button>
  <button class="nav-btn" id="nav-brief" onclick="gotoScreen('brief')">
    <i class="ti ti-chart-bar"></i><span>סקירה</span>
  </button>
  <button class="nav-btn" id="nav-news" onclick="gotoScreen('news')">
    <i class="ti ti-news"></i><span>חדשות</span>
  </button>
</div>

<script>
{analysts_js}

{daily_js}

{ui_js}

// Init
window.addEventListener('load', function() {{
  renderTicker();
  renderAll();
  setTimeout(function() {{
    var ldr = document.getElementById('ldr');
    if (ldr) {{ ldr.style.transition='opacity .35s'; ldr.style.opacity='0'; setTimeout(function(){{ ldr.style.display='none'; }}, 350); }}
  }}, 900);
}});

// Live price refresh
const LIVE_CRYPTO = {{'bitcoin':'BTC','ethereum':'ETH','ripple':'XRP'}};
const LIVE_STOCKS = ['NVDA','IBM','IREN','AAPL','META','MSFT','AMZN','TSLA','GOOGL','PLTR','SOFI','MBLY'];
const TK_IDS = {{NVDA:{{p:'',c:''}},IBM:{{p:'',c:''}},IREN:{{p:'',c:''}}}};

async function fetchCryptoPrices() {{
  try {{
    var ids = Object.keys(LIVE_CRYPTO).join(',');
    var r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids='+ids+'&vs_currencies=usd&include_24hr_change=true');
    if (!r.ok) return;
    var d = await r.json();
    Object.entries(LIVE_CRYPTO).forEach(function([id,sym]) {{
      var q = d[id]; if (!q) return;
      var price = q.usd;
      var pct = q.usd_24h_change || 0;
      var ps = price > 1000 ? price.toLocaleString('en-US',{{maximumFractionDigits:0}}) : price.toFixed(2);
      var cs = (pct>=0?'+':'') + pct.toFixed(2) + '%';
      if (SD[sym]) {{ SD[sym].price = ps + ' דולר'; SD[sym].chg = cs; SD[sym].dir = pct>=0?1:-1; }}
    }});
  }} catch(e) {{}}
}}

async function fetchStockPrice(sym) {{
  try {{
    var r = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+sym+'?interval=1d&range=1d');
    if (!r.ok) return;
    var d = await r.json();
    var m = d&&d.chart&&d.chart.result&&d.chart.result[0]&&d.chart.result[0].meta;
    if (!m) return;
    var price = m.regularMarketPrice || m.previousClose;
    var prev = m.chartPreviousClose || price;
    var pct = prev ? (price-prev)/prev*100 : 0;
    var ps = price.toLocaleString('en-US',{{minimumFractionDigits:2,maximumFractionDigits:2}});
    var cs = (pct>=0?'+':'') + pct.toFixed(2) + '%';
    if (SD[sym]) {{ SD[sym].price = ps + ' דולר'; SD[sym].chg = cs; SD[sym].dir = pct>=0?1:-1; }}
  }} catch(e) {{}}
}}

async function refreshPrices() {{
  await fetchCryptoPrices();
  await Promise.allSettled(LIVE_STOCKS.map(fetchStockPrice));
  renderTicker();
  if (typeof renderWLMini === 'function') renderWLMini();
}}

setTimeout(refreshPrices, 1500);
setInterval(refreshPrices, 5*60*1000);
</script>
</body>
</html>"""
    return html


# ── Main ──────────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print('📖 Reading content/daily.md...')
    data = parse_daily(DAILY_MD)
    print(f"   Date: {data['meta'].get('date')}")
    print(f"   Stocks: {list(data['stocks'].keys())}")
    print(f"   Ticker items: {len(data['ticker'])}")
    print(f"   Flash items: {len(data['flash'])}")

    print('🔨 Building dist/index.html...')
    html = build(data)

    with open(DIST, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f'✅ Done! dist/index.html ({len(html):,} chars)')
    print(f'   → Upload dist/index.html to Netlify Drop')
