// src/ui.js
// All rendering logic — never changes


var FS={
 bull: {bg:"#F0FDF4",bd:"#BBF7D0",dot:"#22C55E"},
 bear: {bg:"#FEF2F2",bd:"#FECACA",dot:"#EF4444"},
 info: {bg:"#EEF2FF",bd:"#C7D3F5",dot:"#6366F1"},
 event:{bg:"#FFFBEB",bd:"#FDE68A",dot:"#F59E0B"}
};


// ── NAV ────────────────────────────────────────────────────────────────
function gotoScreen(id) {
  var screens = ['home','brief'];
  for (var i=0; i<screens.length; i++) {
    var s = screens[i];
    var scr = document.getElementById('scr-'+s);
    var btn = document.getElementById('nav-'+s);
    if (scr) { scr.style.display = (s===id) ? 'block' : 'none'; }
    if (btn) { btn.className = (s===id) ? 'nav-btn on' : 'nav-btn'; }
  }
  window.scrollTo(0,0);
}

// ── HELPERS ────────────────────────────────────────────────────────────
function g(id){ return document.getElementById(id); }
function cc(d){ return d>0 ? 'chg-up' : d<0 ? 'chg-dn' : 'chg-nt'; }
function ar(d){ return d>0 ? '&#x25B2;' : d<0 ? '&#x25BC;' : '&mdash;'; }
function tcls(d){ return d>0 ? 'up' : d<0 ? 'dn' : 'nt'; }

// ── FEED ───────────────────────────────────────────────────────────────
function renderFeed() {
  var el = g('feed-list');
  if (!el) return;
  var html = '';
  for (var i=0; i<FLASH.length; i++) {
    var item = FLASH[i];
    var s = FS[item.type] || FS.info;
    var isP = false;
    for (var j=0; j<(item.tickers||[]).length; j++) {
      if (WL.indexOf(item.tickers[j]) >= 0) { isP = true; break; }
    }
    var border = isP ? 'border-right:3px solid var(--gold);' : '';
    html += '<div class="fi" style="background:' + s.bg + ';border:0.5px solid ' + s.bd + ';' + border + '">';
    html += '<div class="fi-top">';
    html += '<span class="fi-dot" style="background:' + s.dot + '"></span>';
    html += '<span class="fi-tag" style="color:' + s.dot + '">' + item.tag + '</span>';
    html += '<span class="fi-time">' + item.time + '</span>';
    if (isP) html += '<span class="fi-mine">שלך &#x2B50;</span>';
    html += '</div>';
    html += '<div class="fi-txt">' + item.txt + '</div>';
    if (item.tickers && item.tickers.length) {
      html += '<div class="fi-tickers">';
      for (var k=0; k<item.tickers.length; k++) {
        var t = item.tickers[k];
        var inWL = WL.indexOf(t) >= 0;
        html += '<button class="fi-tk' + (inWL ? ' mine' : '') + '" onclick="openOv(\''+t+'\')">' + t + '</button>';
      }
      html += '</div>';
    }
    html += '</div>';
  }
  el.innerHTML = html;
}

// ── WL MINI ────────────────────────────────────────────────────────────
function renderWLMini() {
  var el = g('wl-mini');
  if (!el) return;
  if (!WL.length) {
    el.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text3);font-size:12px;background:var(--white);border:1.5px dashed var(--border2);border-radius:var(--rl)"><i class="ti ti-plus-circle" style="font-size:24px;display:block;margin-bottom:7px;color:var(--border2)"></i>לחץ ערוך להוסיף מניות</div>';
    return;
  }
  var html = '';
  for (var i=0; i<WL.length; i++) {
    var sym = WL[i];
    var s = SD[sym] || {name:sym, mkt:'', price:'&mdash;', chg:'&mdash;', dir:0, color:'var(--navy)', init:sym.slice(0,2)};
    var cCls = cc(s.dir);
    html += '<div class="wl-item" onclick="openOv(\''+sym+'\')">';
    html += '<div class="wi-l"><div class="wi-ic" style="background:' + s.color + '">' + s.init + '</div>';
    html += '<div><div class="wi-sym">' + sym + '</div><div class="wi-nm">' + s.name + '</div></div></div>';
    html += '<div class="wi-r"><div class="wi-pr">' + s.price + '</div>';
    html += '<div class="wi-chg ' + cCls + '">' + ar(s.dir) + ' ' + s.chg + '</div></div>';
    html += '</div>';
  }
  el.innerHTML = html;
}

// ── BRIEF CARDS ────────────────────────────────────────────────────────
function renderBriefCards() {
  var el = g('brief-cards');
  if (!el) return;
  if (!WL.length) {
    el.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text3);font-size:12px">אין מניות.</div>';
    return;
  }
  var html = '';
  for (var i=0; i<WL.length; i++) {
    var sym = WL[i];
    var s = SD[sym] || {name:sym,mkt:'',price:'&mdash;',chg:'&mdash;',dir:0,color:'var(--navy)',init:sym.slice(0,2),summary:'',scen:[],news:[]};
    var c = tcls(s.dir);
    html += '<div class="bc" style="animation-delay:' + (i*0.07) + 's">';
    // header
    html += '<div class="bc-hdr" onclick="openOv(\''+sym+'\')">';
    html += '<div class="bc-hl"><div class="bc-ic" style="background:' + s.color + '">' + s.init + '</div>';
    html += '<div><div class="bc-sym">' + sym + '</div><div class="bc-nm">' + s.name + ' &middot; ' + s.mkt + '</div></div></div>';
    html += '<div><div class="bc-pr">' + s.price + '</div><div class="bc-chg ' + c + '">' + ar(s.dir) + ' ' + s.chg + '</div></div>';
    html += '</div>';
    // body
    html += '<div class="bc-body">';
    html += '<div class="summ">' + (s.summary||'') + '</div>';
    // scenarios
    html += '<div class="scen">';
    var scen = s.scen || [];
    for (var j=0; j<scen.length; j++) {
      var sc = scen[j];
      html += '<div class="sc ' + sc.c + '"><div class="sclbl">' + sc.l + '</div><div class="scval">' + sc.v + '</div><div class="scpct">' + sc.p + '</div></div>';
    }
    html += '</div>';
    // news preview
    var news = s.news || [];
    if (news.length) {
      html += '<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">חדשות</div>';
      for (var k=0; k<Math.min(2,news.length); k++) {
        html += '<div class="news-row"><div class="nr-dot" style="background:' + news[k].c + '"></div><div class="nr-txt">' + news[k].t + '</div></div>';
      }
    }
    html += '<button class="detail-btn" onclick="openOv(\''+sym+'\')"><i class="ti ti-zoom-in" style="font-size:14px"></i>לחץ כאן לניתוח מלא</button>';
    html += '</div></div>';
  }
  el.innerHTML = html;
}

// ── OVERLAY ────────────────────────────────────────────────────────────
var curSym = null;
function openOv(sym) {
  var s = SD[sym];
  if (!s) return;
  curSym = sym;
  g('ov-ttl').textContent = s.name;
  g('ov-sub').textContent = s.mkt + ' · ' + sym;
  g('ov-ic').textContent = s.init;
  g('ov-ic').style.background = s.color;
  g('ov-sym').textContent = sym;
  g('ov-nm').textContent = s.name;
  g('ov-pr').textContent = s.price;
  g('ov-chg').className = 'dhchg ' + tcls(s.dir);
  g('ov-chg').innerHTML = ar(s.dir) + ' ' + s.chg;
  g('ov-tabs').querySelectorAll('.itab').forEach(function(t,i){ t.classList.toggle('on',i===0); });
  renderIT('a');
  g('ov').classList.add('open');
  g('ov').scrollTop = 0;
}
function closeOv(){ g('ov').classList.remove('open'); }

function sIT(tab, el) {
  g('ov-tabs').querySelectorAll('.itab').forEach(function(t){ t.classList.remove('on'); });
  el.classList.add('on');
  renderIT(tab);
}

function renderIT(tab) {
  var s = SD[curSym];
  var el = g('ov-body');
  var html = '';
  if (tab === 'a') {
    html += '<div class="scen">';
    var scen = s.scen || [];
    for (var i=0; i<scen.length; i++) {
      html += '<div class="sc ' + scen[i].c + '"><div class="sclbl">' + scen[i].l + '</div><div class="scval">' + scen[i].v + '</div><div class="scpct">' + scen[i].p + '</div></div>';
    }
    html += '</div>';
    html += '<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">יעדי מחיר אנליסטים</div>';
    html += '<div class="at"><div class="at-hdr"><span>מוסד / מקור</span><span style="text-align:center">יעד (12 חודש)</span><span style="text-align:center">פוטנציאל</span></div>';
    var analysts = s.analysts || [];
    for (var i=0; i<analysts.length; i++) {
      var a = analysts[i];
      html += '<div class="at-row" style="' + (i%2 ? 'background:var(--bg)' : '') + '">';
      html += '<div><div class="ar-who">' + a.w + '</div><div class="ar-note">' + a.n + '</div></div>';
      html += '<div class="ar-tgt" style="color:' + s.color + '">' + a.t + '</div>';
      html += '<div class="ar-up ' + a.uc + '">' + a.u + '</div></div>';
    }
    html += '</div>';
    html += '<div class="sl-row"><span class="sl-lbl">&#x26D4; נקודת עצירה ריאלית</span><span class="sl-val">' + (s.sl||'&mdash;') + '</span></div>';
    if (s.note) html += '<div style="font-size:10px;color:var(--text3);line-height:1.6;font-style:italic;padding-right:8px;border-right:2px solid var(--border)">' + s.note + '</div>';
  } else if (tab === 't') {
    html += '<div class="tech-grid">';
    var tech = s.tech || [];
    for (var i=0; i<tech.length; i++) {
      html += '<div class="tbox"><div class="tblbl">' + tech[i].l + '</div><div class="tbval">' + tech[i].v + '</div></div>';
    }
    html += '</div>';
    html += '<div class="sl-row"><span class="sl-lbl">&#x26D4; נקודת עצירה ריאלית</span><span class="sl-val">' + (s.sl||'&mdash;') + '</span></div>';
    html += '<div style="background:#F0FDF4;border:0.5px solid #BBF7D0;border-radius:var(--rs);padding:8px 11px;font-size:11px;color:var(--gtxt)">ניתוח טכני מסוכם לצרכי מידע בלבד. אינו המלצת השקעה.</div>';
  } else if (tab === 'f') {
    html += '<div class="fin-grid">';
    var fin = s.fin || [];
    for (var i=0; i<fin.length; i++) {
      html += '<div class="fc"><div class="fcv">' + fin[i].v + '</div><div class="fcl">' + fin[i].l + '</div></div>';
    }
    html += '</div>';
    var deals = s.deals || [];
    if (deals.length) {
      html += '<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">עסקאות ואבני דרך</div>';
      for (var i=0; i<deals.length; i++) {
        html += '<div class="deal-card"><div class="deal-t">' + deals[i].t + '</div><div class="deal-v">' + deals[i].v + '</div></div>';
      }
    }
  } else if (tab === 'n') {
    var news = s.news || [];
    for (var i=0; i<news.length; i++) {
      html += '<div class="news-row"><div class="nr-dot" style="background:' + news[i].c + '"></div><div class="nr-txt">' + news[i].t + '</div></div>';
    }
    if (s.outlook || s.summary) {
      html += '<div style="margin-top:9px;background:' + (s.ibg||'var(--bbg)') + ';border:0.5px solid ' + (s.color||'var(--border)') + '30;border-radius:var(--rs);padding:9px 11px">';
      html += '<div style="font-size:10px;font-weight:700;color:' + (s.color||'var(--navy)') + ';margin-bottom:3px">&#x1F3AF; תחזית</div>';
      html += '<div style="font-size:11px;color:var(--text2);line-height:1.7">' + (s.outlook||s.summary) + '</div></div>';
    }
  }
  el.innerHTML = html;
}

// ── GEO ────────────────────────────────────────────────────────────────
function tgGeo(hdr) {
  var body = hdr.nextElementSibling;
  body.classList.toggle('open');
  var chev = hdr.querySelector('.gchev');
  if (chev) chev.style.transform = body.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
}

// ── EDIT SHEET ─────────────────────────────────────────────────────────
function openEdit() {
  renderEditList();
  g('searchI').value = '';
  g('searchRes').innerHTML = '';
  g('editBG').classList.add('open');
}
function saveEdit() { saveWL(); renderAll(); g('editBG').classList.remove('open'); }
function bgClick(e) { if (e.target === g('editBG')) saveEdit(); }

function renderEditList() {
  var el = g('editList');
  if (!WL.length) { el.innerHTML = '<div style="text-align:center;color:var(--text3);font-size:12px;padding:8px 0 14px">חפש מניות למטה.</div>'; return; }
  var html = '';
  for (var i=0; i<WL.length; i++) {
    var sym = WL[i];
    var s = SD[sym] || {name:sym, color:'var(--navy)', init:sym.slice(0,2)};
    html += '<div class="edit-item"><div class="eil"><div class="eiic" style="background:' + s.color + '">' + s.init + '</div>';
    html += '<div><div class="eisym">' + sym + '</div><div class="einm">' + (s.name||sym) + '</div></div></div>';
    html += '<button class="delbtn" onclick="delStock(\''+sym+'\')"><i class="ti ti-x"></i></button></div>';
  }
  el.innerHTML = html;
}

function delStock(sym) { WL = WL.filter(function(s){ return s !== sym; }); renderEditList(); }

function doSearch(v) {
  var res = g('searchRes');
  if (!v.trim()) { res.innerHTML = ''; return; }
  var q = v.toLowerCase();
  var all = [];
  Object.keys(SD).forEach(function(sym){ var s=SD[sym]; all.push({sym:sym,name:s.name,color:s.color,init:s.init,mkt:s.mkt}); });
  EXTRA.forEach(function(s){ all.push(s); });
  var seen = {}; var m = [];
  for (var i=0; i<all.length; i++) {
    var s = all[i];
    if (seen[s.sym]) continue; seen[s.sym] = true;
    if (s.sym.toLowerCase().indexOf(q)>=0 || (s.name||'').toLowerCase().indexOf(q)>=0) m.push(s);
    if (m.length >= 5) break;
  }
  if (!m.length) {
    res.innerHTML = '<div style="text-align:center;color:var(--text3);font-size:12px;padding:9px">לא נמצאו תוצאות</div>';
    return;
  }
  var html = '';
  for (var i=0; i<m.length; i++) {
    var s = m[i];
    var inL = WL.indexOf(s.sym) >= 0;
    html += '<div class="sr-item">';
    html += '<div class="eil">';
    html += '<div class="eiic" style="background:' + (s.color||'var(--navy)') + '">' + (s.init||s.sym.slice(0,2)) + '</div>';
    html += '<div><div class="eisym">' + s.sym + '</div><div class="einm">' + (s.name||'') + (s.mkt ? ' &middot; ' + s.mkt : '') + '</div></div>';
    html += '</div>';
    html += '<button class="addbtn' + (inL ? ' done' : '') + '" data-sym="' + s.sym + '"' + (inL ? ' disabled' : '') + '>';
    html += (inL ? '✓ ברשימה' : '+ הוסף');
    html += '</button></div>';
  }
  res.innerHTML = html;
  res.querySelectorAll('.addbtn:not([disabled])').forEach(function(btn) {
    btn.addEventListener('click', function() { addStock(this.getAttribute('data-sym')); });
  });
}

function addStock(sym) { if (WL.indexOf(sym)<0) WL.push(sym); renderEditList(); doSearch(g('searchI').value); }

// ── RENDER ALL ─────────────────────────────────────────────────────────
function renderAll() {
  renderFeed();
  renderWLMini();
  renderBriefCards();
  // Wire up geo button (re-added to DOM on each render)
  setTimeout(function(){
    var btn = document.getElementById('goto-geo-btn');
    if (btn) btn.addEventListener('click', function(){ gotoScreen('geo'); });
  }, 50);
}

// ── LOADER ─────────────────────────────────────────────────────────────
window.addEventListener('load', function(){
  setTimeout(function(){
    var ldr = g('ldr');
    if (ldr) { ldr.style.transition='opacity .35s'; ldr.style.opacity='0'; setTimeout(function(){ ldr.style.display='none'; }, 350); }
  }, 1000);
});

renderAll();


// ── עדכון מחירים חיים ──────────────────────────────────────────────────
// קריפטו: CoinGecko (חינם, ללא מפתח)
// מניות: Yahoo Finance (חינם, עיכוב ~15 דקות)

const LIVE_MAP = {
  crypto: {
    'bitcoin':  { tkP:'tk-btc-p',  tkC:'tk-btc-c',  sd:'BTC'  },
    'ethereum': { tkP:null, tkC:null, sd:'ETH'  },
    'ripple':   { tkP:null, tkC:null, sd:'XRP'  },
  },
  stocks: ['NVDA','IBM','IREN','AAPL','META','MSFT','AMZN','TSLA','GOOGL','PLTR','SOFI','MBLY']
};

const TICKER_IDS = {
  'NVDA':{ p:'tk-nvda-p', c:'tk-nvda-c' },
  'IBM': { p:'tk-ibm-p',  c:'tk-ibm-c'  },
  'IREN':{ p:'tk-iren-p', c:'tk-iren-c' },
};

function fmtP(v, crypto) {
  if (crypto) return v > 1000 ? v.toLocaleString('en-US',{maximumFractionDigits:0}) : v.toFixed(2);
  return v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
}

function applyQ(tkP, tkC, sdKey, price, pct, crypto) {
  const ps = fmtP(price, crypto);
  const cs = (pct>=0?'+':'')+pct.toFixed(2)+'%';
  const cl = pct>=0?'up':'dn';
  if (tkP && document.getElementById(tkP)) {
    document.getElementById(tkP).textContent = ps;
    var ce = document.getElementById(tkC);
    if (ce) { ce.textContent = cs; ce.className = 'tkc '+cl; }
  }
  if (WL && SD[sdKey]) {
    SD[sdKey].price = ps + ' דולר';
    SD[sdKey].chg   = cs;
    SD[sdKey].dir   = pct>=0?1:-1;
  }
}

async function fetchCrypto() {
  try {
    var ids = Object.keys(LIVE_MAP.crypto).join(',');
    var r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids='+ids+'&vs_currencies=usd&include_24hr_change=true');
    if (!r.ok) return;
    var d = await r.json();
    Object.entries(LIVE_MAP.crypto).forEach(function([id,cfg]){
      var q = d[id]; if (!q) return;
      applyQ(cfg.tkP,cfg.tkC,cfg.sd, q.usd, q.usd_24h_change||0, true);
    });
  } catch(e){}
}

async function fetchStock(sym) {
  try {
    var r = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+sym+'?interval=1d&range=1d');
    if (!r.ok) return;
    var d = await r.json();
    var m = d&&d.chart&&d.chart.result&&d.chart.result[0]&&d.chart.result[0].meta;
    if (!m) return;
    var price = m.regularMarketPrice || m.previousClose;
    var prev  = m.chartPreviousClose  || m.previousClose || price;
    var pct   = prev ? (price - prev) / prev * 100 : 0;
    var tk    = TICKER_IDS[sym]||{};
    applyQ(tk.p||null, tk.c||null, sym, price, pct, false);
  } catch(e){}
}

async function refreshPrices() {
  var badge = document.createElement('div');
  badge.style.cssText='position:fixed;bottom:14px;left:50%;transform:translateX(-50%);background:#0F2044;color:#A8B8D8;font-size:11px;font-weight:600;padding:5px 14px;border-radius:99px;z-index:9999;direction:rtl;pointer-events:none;';
  badge.textContent='↻ מעדכן מחירים...';
  document.body.appendChild(badge);
  await fetchCrypto();
  await Promise.allSettled(LIVE_MAP.stocks.map(fetchStock));
  if (typeof renderCards==='function') renderCards();
  badge.textContent='✓ מחירים עודכנו';
  badge.style.background='#22C55E';
  badge.style.color='#fff';
  setTimeout(function(){ badge.remove(); }, 2000);
}

window.addEventListener('load', function(){
  setTimeout(refreshPrices, 1500);
  setInterval(refreshPrices, 5*60*1000); // כל 5 דקות
});




var FS={
 bull: {bg:"#F0FDF4",bd:"#BBF7D0",dot:"#22C55E"},
 bear: {bg:"#FEF2F2",bd:"#FECACA",dot:"#EF4444"},
 info: {bg:"#EEF2FF",bd:"#C7D3F5",dot:"#6366F1"},
 event:{bg:"#FFFBEB",bd:"#FDE68A",dot:"#F59E0B"}
};

// ── NAV ────────────────────────────────────────────────────────────────
function gotoScreen(id) {
  var screens = ['home','brief'];
  for (var i=0; i<screens.length; i++) {
    var s = screens[i];
    var scr = document.getElementById('scr-'+s);
    var btn = document.getElementById('nav-'+s);
    if (scr) { scr.style.display = (s===id) ? 'block' : 'none'; }
    if (btn) { btn.className = (s===id) ? 'nav-btn on' : 'nav-btn'; }
  }
  window.scrollTo(0,0);
}

// ── HELPERS ────────────────────────────────────────────────────────────
function g(id){ return document.getElementById(id); }
function cc(d){ return d>0 ? 'chg-up' : d<0 ? 'chg-dn' : 'chg-nt'; }
function ar(d){ return d>0 ? '&#x25B2;' : d<0 ? '&#x25BC;' : '&mdash;'; }
function tcls(d){ return d>0 ? 'up' : d<0 ? 'dn' : 'nt'; }

// ── FEED ───────────────────────────────────────────────────────────────
function renderFeed() {
  var el = g('feed-list');
  if (!el) return;
  var html = '';
  for (var i=0; i<FLASH.length; i++) {
    var item = FLASH[i];
    var s = FS[item.type] || FS.info;
    var isP = false;
    for (var j=0; j<(item.tickers||[]).length; j++) {
      if (WL.indexOf(item.tickers[j]) >= 0) { isP = true; break; }
    }
    var border = isP ? 'border-right:3px solid var(--gold);' : '';
    html += '<div class="fi" style="background:' + s.bg + ';border:0.5px solid ' + s.bd + ';' + border + '">';
    html += '<div class="fi-top">';
    html += '<span class="fi-dot" style="background:' + s.dot + '"></span>';
    html += '<span class="fi-tag" style="color:' + s.dot + '">' + item.tag + '</span>';
    html += '<span class="fi-time">' + item.time + '</span>';
    if (isP) html += '<span class="fi-mine">שלך &#x2B50;</span>';
    html += '</div>';
    html += '<div class="fi-txt">' + item.txt + '</div>';
    if (item.tickers && item.tickers.length) {
      html += '<div class="fi-tickers">';
      for (var k=0; k<item.tickers.length; k++) {
        var t = item.tickers[k];
        var inWL = WL.indexOf(t) >= 0;
        html += '<button class="fi-tk' + (inWL ? ' mine' : '') + '" onclick="openOv(\''+t+'\')">' + t + '</button>';
      }
      html += '</div>';
    }
    html += '</div>';
  }
  el.innerHTML = html;
}

// ── WL MINI ────────────────────────────────────────────────────────────
function renderWLMini() {
  var el = g('wl-mini');
  if (!el) return;
  if (!WL.length) {
    el.innerHTML = '<div style="padding:16px;text-align:center;color:var(--text3);font-size:12px;background:var(--white);border:1.5px dashed var(--border2);border-radius:var(--rl)"><i class="ti ti-plus-circle" style="font-size:24px;display:block;margin-bottom:7px;color:var(--border2)"></i>לחץ ערוך להוסיף מניות</div>';
    return;
  }
  var html = '';
  for (var i=0; i<WL.length; i++) {
    var sym = WL[i];
    var s = SD[sym] || {name:sym, mkt:'', price:'&mdash;', chg:'&mdash;', dir:0, color:'var(--navy)', init:sym.slice(0,2)};
    var cCls = cc(s.dir);
    html += '<div class="wl-item" onclick="openOv(\''+sym+'\')">';
    html += '<div class="wi-l"><div class="wi-ic" style="background:' + s.color + '">' + s.init + '</div>';
    html += '<div><div class="wi-sym">' + sym + '</div><div class="wi-nm">' + s.name + '</div></div></div>';
    html += '<div class="wi-r"><div class="wi-pr">' + s.price + '</div>';
    html += '<div class="wi-chg ' + cCls + '">' + ar(s.dir) + ' ' + s.chg + '</div></div>';
    html += '</div>';
  }
  el.innerHTML = html;
}

// ── BRIEF CARDS ────────────────────────────────────────────────────────
function renderBriefCards() {
  var el = g('brief-cards');
  if (!el) return;
  if (!WL.length) {
    el.innerHTML = '<div style="padding:20px;text-align:center;color:var(--text3);font-size:12px">אין מניות.</div>';
    return;
  }
  var html = '';
  for (var i=0; i<WL.length; i++) {
    var sym = WL[i];
    var s = SD[sym] || {name:sym,mkt:'',price:'&mdash;',chg:'&mdash;',dir:0,color:'var(--navy)',init:sym.slice(0,2),summary:'',scen:[],news:[]};
    var c = tcls(s.dir);
    html += '<div class="bc" style="animation-delay:' + (i*0.07) + 's">';
    // header
    html += '<div class="bc-hdr" onclick="openOv(\''+sym+'\')">';
    html += '<div class="bc-hl"><div class="bc-ic" style="background:' + s.color + '">' + s.init + '</div>';
    html += '<div><div class="bc-sym">' + sym + '</div><div class="bc-nm">' + s.name + ' &middot; ' + s.mkt + '</div></div></div>';
    html += '<div><div class="bc-pr">' + s.price + '</div><div class="bc-chg ' + c + '">' + ar(s.dir) + ' ' + s.chg + '</div></div>';
    html += '</div>';
    // body
    html += '<div class="bc-body">';
    html += '<div class="summ">' + (s.summary||'') + '</div>';
    // scenarios
    html += '<div class="scen">';
    var scen = s.scen || [];
    for (var j=0; j<scen.length; j++) {
      var sc = scen[j];
      html += '<div class="sc ' + sc.c + '"><div class="sclbl">' + sc.l + '</div><div class="scval">' + sc.v + '</div><div class="scpct">' + sc.p + '</div></div>';
    }
    html += '</div>';
    // news preview
    var news = s.news || [];
    if (news.length) {
      html += '<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">חדשות</div>';
      for (var k=0; k<Math.min(2,news.length); k++) {
        html += '<div class="news-row"><div class="nr-dot" style="background:' + news[k].c + '"></div><div class="nr-txt">' + news[k].t + '</div></div>';
      }
    }
    html += '<button class="detail-btn" onclick="openOv(\''+sym+'\')"><i class="ti ti-zoom-in" style="font-size:14px"></i>לחץ כאן לניתוח מלא</button>';
    html += '</div></div>';
  }
  el.innerHTML = html;
}

// ── OVERLAY ────────────────────────────────────────────────────────────
var curSym = null;
function openOv(sym) {
  var s = SD[sym];
  if (!s) return;
  curSym = sym;
  g('ov-ttl').textContent = s.name;
  g('ov-sub').textContent = s.mkt + ' · ' + sym;
  g('ov-ic').textContent = s.init;
  g('ov-ic').style.background = s.color;
  g('ov-sym').textContent = sym;
  g('ov-nm').textContent = s.name;
  g('ov-pr').textContent = s.price;
  g('ov-chg').className = 'dhchg ' + tcls(s.dir);
  g('ov-chg').innerHTML = ar(s.dir) + ' ' + s.chg;
  g('ov-tabs').querySelectorAll('.itab').forEach(function(t,i){ t.classList.toggle('on',i===0); });
  renderIT('a');
  g('ov').classList.add('open');
  g('ov').scrollTop = 0;
}
function closeOv(){ g('ov').classList.remove('open'); }

function sIT(tab, el) {
  g('ov-tabs').querySelectorAll('.itab').forEach(function(t){ t.classList.remove('on'); });
  el.classList.add('on');
  renderIT(tab);
}

function renderIT(tab) {
  var s = SD[curSym];
  var el = g('ov-body');
  var html = '';
  if (tab === 'a') {
    html += '<div class="scen">';
    var scen = s.scen || [];
    for (var i=0; i<scen.length; i++) {
      html += '<div class="sc ' + scen[i].c + '"><div class="sclbl">' + scen[i].l + '</div><div class="scval">' + scen[i].v + '</div><div class="scpct">' + scen[i].p + '</div></div>';
    }
    html += '</div>';
    html += '<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">יעדי מחיר אנליסטים</div>';
    html += '<div class="at"><div class="at-hdr"><span>מוסד / מקור</span><span style="text-align:center">יעד (12 חודש)</span><span style="text-align:center">פוטנציאל</span></div>';
    var analysts = s.analysts || [];
    for (var i=0; i<analysts.length; i++) {
      var a = analysts[i];
      html += '<div class="at-row" style="' + (i%2 ? 'background:var(--bg)' : '') + '">';
      html += '<div><div class="ar-who">' + a.w + '</div><div class="ar-note">' + a.n + '</div></div>';
      html += '<div class="ar-tgt" style="color:' + s.color + '">' + a.t + '</div>';
      html += '<div class="ar-up ' + a.uc + '">' + a.u + '</div></div>';
    }
    html += '</div>';
    html += '<div class="sl-row"><span class="sl-lbl">&#x26D4; נקודת עצירה ריאלית</span><span class="sl-val">' + (s.sl||'&mdash;') + '</span></div>';
    if (s.note) html += '<div style="font-size:10px;color:var(--text3);line-height:1.6;font-style:italic;padding-right:8px;border-right:2px solid var(--border)">' + s.note + '</div>';
  } else if (tab === 't') {
    html += '<div class="tech-grid">';
    var tech = s.tech || [];
    for (var i=0; i<tech.length; i++) {
      html += '<div class="tbox"><div class="tblbl">' + tech[i].l + '</div><div class="tbval">' + tech[i].v + '</div></div>';
    }
    html += '</div>';
    html += '<div class="sl-row"><span class="sl-lbl">&#x26D4; נקודת עצירה ריאלית</span><span class="sl-val">' + (s.sl||'&mdash;') + '</span></div>';
    html += '<div style="background:#F0FDF4;border:0.5px solid #BBF7D0;border-radius:var(--rs);padding:8px 11px;font-size:11px;color:var(--gtxt)">ניתוח טכני מסוכם לצרכי מידע בלבד. אינו המלצת השקעה.</div>';
  } else if (tab === 'f') {
    html += '<div class="fin-grid">';
    var fin = s.fin || [];
    for (var i=0; i<fin.length; i++) {
      html += '<div class="fc"><div class="fcv">' + fin[i].v + '</div><div class="fcl">' + fin[i].l + '</div></div>';
    }
    html += '</div>';
    var deals = s.deals || [];
    if (deals.length) {
      html += '<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">עסקאות ואבני דרך</div>';
      for (var i=0; i<deals.length; i++) {
        html += '<div class="deal-card"><div class="deal-t">' + deals[i].t + '</div><div class="deal-v">' + deals[i].v + '</div></div>';
      }
    }
  } else if (tab === 'n') {
    var news = s.news || [];
    for (var i=0; i<news.length; i++) {
      html += '<div class="news-row"><div class="nr-dot" style="background:' + news[i].c + '"></div><div class="nr-txt">' + news[i].t + '</div></div>';
    }
    if (s.outlook || s.summary) {
      html += '<div style="margin-top:9px;background:' + (s.ibg||'var(--bbg)') + ';border:0.5px solid ' + (s.color||'var(--border)') + '30;border-radius:var(--rs);padding:9px 11px">';
      html += '<div style="font-size:10px;font-weight:700;color:' + (s.color||'var(--navy)') + ';margin-bottom:3px">&#x1F3AF; תחזית</div>';
      html += '<div style="font-size:11px;color:var(--text2);line-height:1.7">' + (s.outlook||s.summary) + '</div></div>';
    }
  }
  el.innerHTML = html;
}

// ── GEO ────────────────────────────────────────────────────────────────
function tgGeo(hdr) {
  var body = hdr.nextElementSibling;
  body.classList.toggle('open');
  var chev = hdr.querySelector('.gchev');
  if (chev) chev.style.transform = body.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
}

// ── EDIT SHEET ─────────────────────────────────────────────────────────
function openEdit() {
  renderEditList();
  g('searchI').value = '';
  g('searchRes').innerHTML = '';
  g('editBG').classList.add('open');
}
function saveEdit() { saveWL(); renderAll(); g('editBG').classList.remove('open'); }
function bgClick(e) { if (e.target === g('editBG')) saveEdit(); }

function renderEditList() {
  var el = g('editList');
  if (!WL.length) { el.innerHTML = '<div style="text-align:center;color:var(--text3);font-size:12px;padding:8px 0 14px">חפש מניות למטה.</div>'; return; }
  var html = '';
  for (var i=0; i<WL.length; i++) {
    var sym = WL[i];
    var s = SD[sym] || {name:sym, color:'var(--navy)', init:sym.slice(0,2)};
    html += '<div class="edit-item"><div class="eil"><div class="eiic" style="background:' + s.color + '">' + s.init + '</div>';
    html += '<div><div class="eisym">' + sym + '</div><div class="einm">' + (s.name||sym) + '</div></div></div>';
    html += '<button class="delbtn" onclick="delStock(\''+sym+'\')"><i class="ti ti-x"></i></button></div>';
  }
  el.innerHTML = html;
}

function delStock(sym) { WL = WL.filter(function(s){ return s !== sym; }); renderEditList(); }

function doSearch(v) {
  var res = g('searchRes');
  if (!v.trim()) { res.innerHTML = ''; return; }
  var q = v.toLowerCase();
  var all = [];
  Object.keys(SD).forEach(function(sym){ var s=SD[sym]; all.push({sym:sym,name:s.name,color:s.color,init:s.init,mkt:s.mkt}); });
  EXTRA.forEach(function(s){ all.push(s); });
  var seen = {}; var m = [];
  for (var i=0; i<all.length; i++) {
    var s = all[i];
    if (seen[s.sym]) continue; seen[s.sym] = true;
    if (s.sym.toLowerCase().indexOf(q)>=0 || (s.name||'').toLowerCase().indexOf(q)>=0) m.push(s);
    if (m.length >= 5) break;
  }
  if (!m.length) {
    res.innerHTML = '<div style="text-align:center;color:var(--text3);font-size:12px;padding:9px">לא נמצאו תוצאות</div>';
    return;
  }
  var html = '';
  for (var i=0; i<m.length; i++) {
    var s = m[i];
    var inL = WL.indexOf(s.sym) >= 0;
    html += '<div class="sr-item">';
    html += '<div class="eil">';
    html += '<div class="eiic" style="background:' + (s.color||'var(--navy)') + '">' + (s.init||s.sym.slice(0,2)) + '</div>';
    html += '<div><div class="eisym">' + s.sym + '</div><div class="einm">' + (s.name||'') + (s.mkt ? ' &middot; ' + s.mkt : '') + '</div></div>';
    html += '</div>';
    html += '<button class="addbtn' + (inL ? ' done' : '') + '" data-sym="' + s.sym + '"' + (inL ? ' disabled' : '') + '>';
    html += (inL ? '✓ ברשימה' : '+ הוסף');
    html += '</button></div>';
  }
  res.innerHTML = html;
  res.querySelectorAll('.addbtn:not([disabled])').forEach(function(btn) {
    btn.addEventListener('click', function() { addStock(this.getAttribute('data-sym')); });
  });
}

function addStock(sym) { if (WL.indexOf(sym)<0) WL.push(sym); renderEditList(); doSearch(g('searchI').value); }

// ── RENDER ALL ─────────────────────────────────────────────────────────
function renderAll() {
  renderFeed();
  renderWLMini();
  renderBriefCards();
  // Wire up geo button (re-added to DOM on each render)
  setTimeout(function(){
    var btn = document.getElementById('goto-geo-btn');
    if (btn) btn.addEventListener('click', function(){ gotoScreen('geo'); });
  }, 50);
}

// ── LOADER ─────────────────────────────────────────────────────────────
window.addEventListener('load', function(){
  setTimeout(function(){
    var ldr = g('ldr');
    if (ldr) { ldr.style.transition='opacity .35s'; ldr.style.opacity='0'; setTimeout(function(){ ldr.style.display='none'; }, 350); }
  }, 1000);
});

renderAll();


// ── עדכון מחירים חיים ──────────────────────────────────────────────────
// קריפטו: CoinGecko (חינם, ללא מפתח)
// מניות: Yahoo Finance (חינם, עיכוב ~15 דקות)

