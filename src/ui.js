// src/ui.js — All rendering logic

var FS={
  bull: {bg:"#F0FDF4",bd:"#BBF7D0",dot:"#22C55E"},
  bear: {bg:"#FEF2F2",bd:"#FECACA",dot:"#EF4444"},
  info: {bg:"#EEF2FF",bd:"#C7D3F5",dot:"#6366F1"},
  event:{bg:"#FFFBEB",bd:"#FDE68A",dot:"#F59E0B"}
};

// ── NAV ────────────────────────────────────────────────────────────────
function gotoScreen(id) {
  ['home','brief'].forEach(function(s){
    var scr=document.getElementById('scr-'+s), btn=document.getElementById('nav-'+s);
    if(scr) scr.style.display=(s===id)?'block':'none';
    if(btn) btn.className=(s===id)?'nav-btn on':'nav-btn';
  });
  window.scrollTo(0,0);
}

// ── HELPERS ────────────────────────────────────────────────────────────
function g(id){ return document.getElementById(id); }
function cc(d){ return d>0?'chg-up':d<0?'chg-dn':'chg-nt'; }
function ar(d){ return d>0?'&#x25B2;':d<0?'&#x25BC;':'&mdash;'; }
function tcls(d){ return d>0?'up':d<0?'dn':'nt'; }

// Returns a stock entry — creates basic one from EXTRA if not in SD
function getSE(sym) {
  if (SD[sym]) return SD[sym];
  var ex = null;
  for (var i=0; i<EXTRA.length; i++) { if (EXTRA[i].sym===sym) { ex=EXTRA[i]; break; } }
  if (!ex) ex = {sym:sym, name:sym, color:'#1B4F8A', init:sym.slice(0,2).toUpperCase(), mkt:'Nasdaq'};
  SD[sym] = {
    name:ex.name, mkt:ex.mkt||'Nasdaq',
    price:'טוען...', chg:'—', dir:0,
    color:ex.color||'#1B4F8A', init:ex.init||sym.slice(0,2).toUpperCase(),
    summary:'', scen:[], analysts:[], tech:[], fin:[], news:[]
  };
  return SD[sym];
}

// ── FEED ───────────────────────────────────────────────────────────────
function renderFeed() {
  var el=g('feed-list'); if(!el) return;
  var html='';
  for (var i=0; i<FLASH.length; i++) {
    var item=FLASH[i], s=FS[item.type]||FS.info;
    var isP=false;
    for (var j=0; j<(item.tickers||[]).length; j++) { if(WL.indexOf(item.tickers[j])>=0){isP=true;break;} }
    var border=isP?'border-right:3px solid var(--gold);':'';
    html+='<div class="fi" style="background:'+s.bg+';border:0.5px solid '+s.bd+';'+border+'">';
    html+='<div class="fi-top"><span class="fi-dot" style="background:'+s.dot+'"></span>';
    html+='<span class="fi-tag" style="color:'+s.dot+'">'+item.tag+'</span>';
    html+='<span class="fi-time">'+item.time+'</span>';
    if(isP) html+='<span class="fi-mine">שלך &#x2B50;</span>';
    html+='</div><div class="fi-txt">'+item.txt+'</div>';
    if(item.tickers&&item.tickers.length){
      html+='<div class="fi-tickers">';
      for(var k=0;k<item.tickers.length;k++){
        var t=item.tickers[k], inWL=WL.indexOf(t)>=0;
        html+='<button class="fi-tk'+(inWL?' mine':'')+'" onclick="openOv(\''+t+'\')">'+t+'</button>';
      }
      html+='</div>';
    }
    html+='</div>';
  }
  el.innerHTML=html;
}

// ── WL MINI ────────────────────────────────────────────────────────────
function renderWLMini() {
  var el=g('wl-mini'); if(!el) return;
  if(!WL.length){
    el.innerHTML='<div style="padding:16px;text-align:center;color:var(--text3);font-size:12px;background:var(--white);border:1.5px dashed var(--border2);border-radius:var(--rl)"><i class="ti ti-plus-circle" style="font-size:24px;display:block;margin-bottom:7px;color:var(--border2)"></i>לחץ ערוך להוסיף מניות</div>';
    return;
  }
  var html='';
  for(var i=0;i<WL.length;i++){
    var sym=WL[i], s=getSE(sym);
    html+='<div class="wl-item" onclick="openOv(\''+sym+'\')">';
    html+='<div class="wi-l"><div class="wi-ic" style="background:'+s.color+'">'+s.init+'</div>';
    html+='<div><div class="wi-sym">'+sym+'</div><div class="wi-nm">'+s.name+'</div></div></div>';
    html+='<div class="wi-r"><div class="wi-pr">'+s.price+'</div>';
    html+='<div class="wi-chg '+cc(s.dir)+'">'+ar(s.dir)+' '+s.chg+'</div></div></div>';
  }
  el.innerHTML=html;
}

// ── BRIEF CARDS ────────────────────────────────────────────────────────
function renderBriefCards() {
  var el=g('brief-cards'); if(!el) return;
  if(!WL.length){
    el.innerHTML='<div style="padding:20px;text-align:center;color:var(--text3);font-size:12px">אין מניות ברשימה.</div>';
    return;
  }
  var html='';
  for(var i=0;i<WL.length;i++){
    var sym=WL[i], s=getSE(sym), c=tcls(s.dir);
    html+='<div class="bc" style="animation-delay:'+(i*0.07)+'s">';
    html+='<div class="bc-hdr" onclick="openOv(\''+sym+'\')">';
    html+='<div class="bc-hl"><div class="bc-ic" style="background:'+s.color+'">'+s.init+'</div>';
    html+='<div><div class="bc-sym">'+sym+'</div><div class="bc-nm">'+s.name+' &middot; '+s.mkt+'</div></div></div>';
    html+='<div><div class="bc-pr">'+s.price+'</div><div class="bc-chg '+c+'">'+ar(s.dir)+' '+s.chg+'</div></div></div>';
    html+='<div class="bc-body"><div class="summ">'+(s.summary||'מחיר חי מעודכן — לחץ לניתוח')+'</div>';
    var scen=s.scen||[];
    if(scen.length){
      html+='<div class="scen">';
      for(var j=0;j<scen.length;j++) html+='<div class="sc '+scen[j].c+'"><div class="sclbl">'+scen[j].l+'</div><div class="scval">'+scen[j].v+'</div><div class="scpct">'+scen[j].p+'</div></div>';
      html+='</div>';
    }
    var news=s.news||[];
    if(news.length){
      html+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:5px">חדשות</div>';
      for(var k=0;k<Math.min(2,news.length);k++) html+='<div class="news-row"><div class="nr-dot" style="background:'+news[k].c+'"></div><div class="nr-txt">'+news[k].t+'</div></div>';
    }
    html+='<button class="detail-btn" onclick="openOv(\''+sym+'\')"><i class="ti ti-zoom-in" style="font-size:14px"></i>לחץ כאן לניתוח מלא</button>';
    html+='</div></div>';
  }
  el.innerHTML=html;
}

// ── OVERLAY ────────────────────────────────────────────────────────────
var curSym=null;
function openOv(sym) {
  var s=getSE(sym); // creates basic entry if not in SD
  curSym=sym;
  g('ov-ttl').textContent=s.name;
  g('ov-sub').textContent=s.mkt+' · '+sym;
  g('ov-ic').textContent=s.init;
  g('ov-ic').style.background=s.color;
  g('ov-sym').textContent=sym;
  g('ov-nm').textContent=s.name;
  g('ov-pr').textContent=s.price;
  g('ov-chg').className='dhchg '+tcls(s.dir);
  g('ov-chg').innerHTML=ar(s.dir)+' '+s.chg;
  g('ov-tabs').querySelectorAll('.itab').forEach(function(t,i){ t.classList.toggle('on',i===0); });
  renderIT('a');
  g('ov').classList.add('open');
  g('ov').scrollTop=0;
  // Fetch live price if not already loaded
  if(s.price==='טוען...') {
    fetchWLStock(sym).then(function(){
      if(curSym!==sym) return;
      var sv=SD[sym];
      if(sv){ g('ov-pr').textContent=sv.price; g('ov-chg').innerHTML=ar(sv.dir)+' '+sv.chg; g('ov-chg').className='dhchg '+tcls(sv.dir); }
    });
  }
}
function closeOv(){ g('ov').classList.remove('open'); }

function sIT(tab,el){
  g('ov-tabs').querySelectorAll('.itab').forEach(function(t){ t.classList.remove('on'); });
  el.classList.add('on');
  renderIT(tab);
}

function renderIT(tab) {
  var s=SD[curSym]||getSE(curSym), el=g('ov-body'), html='';
  if(tab==='a'){
    var scen=s.scen||[];
    if(scen.length){
      html+='<div class="scen">';
      for(var i=0;i<scen.length;i++) html+='<div class="sc '+scen[i].c+'"><div class="sclbl">'+scen[i].l+'</div><div class="scval">'+scen[i].v+'</div><div class="scpct">'+scen[i].p+'</div></div>';
      html+='</div>';
    }
    var analysts=s.analysts||[];
    if(analysts.length){
      html+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">יעדי מחיר אנליסטים</div>';
      html+='<div class="at"><div class="at-hdr"><span>מוסד / מקור</span><span style="text-align:center">יעד (12 חודש)</span><span style="text-align:center">פוטנציאל</span></div>';
      for(var i=0;i<analysts.length;i++){
        var a=analysts[i];
        html+='<div class="at-row" style="'+(i%2?'background:var(--bg)':'')+'">';
        html+='<div><div class="ar-who">'+a.w+'</div><div class="ar-note">'+a.n+'</div></div>';
        html+='<div class="ar-tgt" style="color:'+s.color+'">'+a.t+'</div>';
        html+='<div class="ar-up '+a.uc+'">'+a.u+'</div></div>';
      }
      html+='</div>';
    } else {
      html+='<div style="text-align:center;padding:20px;color:var(--text3);font-size:12px;line-height:1.8">מחיר חי מ-Yahoo Finance.<br>ניתוח מלא זמין למניות המוצגות.</div>';
    }
    html+='<div class="sl-row"><span class="sl-lbl">&#x26D4; נקודת עצירה ריאלית</span><span class="sl-val">'+(s.sl||'&mdash;')+'</span></div>';
  } else if(tab==='t'){
    var tech=s.tech||[];
    if(tech.length){
      html+='<div class="tech-grid">';
      for(var i=0;i<tech.length;i++) html+='<div class="tbox"><div class="tblbl">'+tech[i].l+'</div><div class="tbval">'+tech[i].v+'</div></div>';
      html+='</div>';
    } else {
      html+='<div style="text-align:center;padding:20px;color:var(--text3);font-size:12px">ניתוח טכני לא זמין למניה זו.</div>';
    }
    html+='<div class="sl-row"><span class="sl-lbl">&#x26D4; נקודת עצירה ריאלית</span><span class="sl-val">'+(s.sl||'&mdash;')+'</span></div>';
    html+='<div style="background:#F0FDF4;border:0.5px solid #BBF7D0;border-radius:var(--rs);padding:8px 11px;font-size:11px;color:var(--gtxt)">ניתוח טכני לצרכי מידע בלבד. אינו המלצת השקעה.</div>';
  } else if(tab==='f'){
    var fin=s.fin||[];
    if(fin.length){
      html+='<div class="fin-grid">';
      for(var i=0;i<fin.length;i++) html+='<div class="fc"><div class="fcv">'+fin[i].v+'</div><div class="fcl">'+fin[i].l+'</div></div>';
      html+='</div>';
    } else {
      html+='<div style="text-align:center;padding:20px;color:var(--text3);font-size:12px">נתונים פיננסיים לא זמינים.</div>';
    }
    var deals=s.deals||[];
    if(deals.length){
      html+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">עסקאות ואבני דרך</div>';
      for(var i=0;i<deals.length;i++) html+='<div class="deal-card"><div class="deal-t">'+deals[i].t+'</div><div class="deal-v">'+deals[i].v+'</div></div>';
    }
  } else if(tab==='n'){
    var news=s.news||[];
    if(news.length){
      for(var i=0;i<news.length;i++) html+='<div class="news-row"><div class="nr-dot" style="background:'+news[i].c+'"></div><div class="nr-txt">'+news[i].t+'</div></div>';
    } else {
      html+='<div style="text-align:center;padding:20px;color:var(--text3);font-size:12px">חדשות לא זמינות. מחיר חי מ-Yahoo Finance.</div>';
    }
    if(s.outlook||s.summary){
      html+='<div style="margin-top:9px;background:var(--bbg);border:0.5px solid '+(s.color||'var(--border)')+'30;border-radius:var(--rs);padding:9px 11px">';
      html+='<div style="font-size:10px;font-weight:700;color:'+(s.color||'var(--navy)')+';margin-bottom:3px">&#x1F3AF; תחזית</div>';
      html+='<div style="font-size:11px;color:var(--text2);line-height:1.7">'+(s.outlook||s.summary)+'</div></div>';
    }
  }
  el.innerHTML=html;
}

// ── GEO ────────────────────────────────────────────────────────────────
function tgGeo(hdr){
  var body=hdr.nextElementSibling;
  body.classList.toggle('open');
  var chev=hdr.querySelector('.gchev');
  if(chev) chev.style.transform=body.classList.contains('open')?'rotate(180deg)':'rotate(0)';
}

// ── EDIT SHEET ─────────────────────────────────────────────────────────
var POPULAR_CATS=[
  {label:'ביג טק',     stocks:['AAPL','MSFT','AMZN','META','GOOGL','TSLA']},
  {label:'AI & שבבים', stocks:['NVDA','AMD','AVGO','CRWD','PANW','DDOG','ARM']},
  {label:'פיננסים',    stocks:['COIN','MSTR','SOFI','PLTR']},
  {label:'מדיה & סטרימינג',stocks:['NFLX','CMCSA','TMUS','EA']},
  {label:'ביוטק',      stocks:['AMGN','GILD','VRTX','REGN']},
  {label:'קריפטו',     stocks:['BTC','ETH','XRP']}
];

function renderPopular(){
  var el=g('popularGrid'); if(!el) return;
  var html='<div style="margin-bottom:14px">';
  html+='<div style="font-size:10px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">&#x26A1; הוסף במהירות</div>';
  POPULAR_CATS.forEach(function(cat){
    html+='<div style="margin-bottom:8px">';
    html+='<div style="font-size:9px;font-weight:600;color:var(--text3);margin-bottom:5px">'+cat.label+'</div>';
    html+='<div style="display:flex;flex-wrap:wrap;gap:5px">';
    cat.stocks.forEach(function(sym){
      var inWL=WL.indexOf(sym)>=0;
      var s=SD[sym]; var color='#1B4F8A';
      if(s) color=s.color;
      else { for(var i=0;i<EXTRA.length;i++){if(EXTRA[i].sym===sym){color=EXTRA[i].color||color;break;}} }
      html+='<button onclick="addStock(\''+sym+'\')" style="background:'+(inWL?'var(--gold)':'var(--white)')+';color:'+(inWL?'var(--navy)':'var(--text)')+';border:1px solid '+(inWL?'var(--gold)':'var(--border)')+';border-radius:99px;padding:5px 11px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .15s">';
      html+=(inWL?'✓ ':'')+sym+'</button>';
    });
    html+='</div></div>';
  });
  html+='</div>';
  el.innerHTML=html;
}

function openEdit(){
  renderEditList();
  g('searchI').value='';
  g('searchRes').innerHTML='';
  // Inject popular grid before search input if not already there
  var sheet=document.querySelector('.sheet');
  var srchwrap=document.querySelector('.srchwrap');
  if(sheet && srchwrap && !g('popularGrid')){
    var popEl=document.createElement('div');
    popEl.id='popularGrid';
    popEl.style.cssText='padding:0 2px 4px;';
    sheet.insertBefore(popEl, srchwrap);
  }
  renderPopular();
  g('editBG').classList.add('open');
}
function saveEdit(){ saveWL(); renderAll(); g('editBG').classList.remove('open'); }
function bgClick(e){ if(e.target===g('editBG')) saveEdit(); }

function renderEditList(){
  var el=g('editList');
  if(!WL.length){ el.innerHTML='<div style="text-align:center;color:var(--text3);font-size:12px;padding:8px 0 14px">חפש מניות למטה או בחר מהרשימה.</div>'; return; }
  var html='';
  for(var i=0;i<WL.length;i++){
    var sym=WL[i], s=getSE(sym);
    html+='<div class="edit-item"><div class="eil"><div class="eiic" style="background:'+s.color+'">'+s.init+'</div>';
    html+='<div><div class="eisym">'+sym+'</div><div class="einm">'+(s.name||sym)+'</div></div></div>';
    html+='<button class="delbtn" onclick="delStock(\''+sym+'\')"><i class="ti ti-x"></i></button></div>';
  }
  el.innerHTML=html;
}

function delStock(sym){ WL=WL.filter(function(s){ return s!==sym; }); renderEditList(); renderPopular(); }

function doSearch(v){
  var res=g('searchRes');
  renderPopular();
  if(!v.trim()){ res.innerHTML=''; return; }
  var q=v.toLowerCase(), all=[], seen={}, m=[];
  Object.keys(SD).forEach(function(sym){ var s=SD[sym]; all.push({sym:sym,name:s.name,color:s.color,init:s.init,mkt:s.mkt}); });
  EXTRA.forEach(function(e){ all.push(e); });
  for(var i=0;i<all.length;i++){
    var s=all[i];
    if(seen[s.sym]) continue; seen[s.sym]=true;
    if(s.sym.toLowerCase().indexOf(q)>=0||(s.name||'').toLowerCase().indexOf(q)>=0) m.push(s);
    if(m.length>=8) break;
  }
  // Allow adding any valid ticker not in our list
  var upper=v.toUpperCase().trim();
  if(!seen[upper]&&/^[A-Z]{1,5}$/.test(upper)){
    m.push({sym:upper, name:upper, color:'#1B4F8A', init:upper.slice(0,2), mkt:'Nasdaq'});
  }
  if(!m.length){ res.innerHTML='<div style="text-align:center;color:var(--text3);font-size:12px;padding:9px">לא נמצאו תוצאות</div>'; return; }
  var html='';
  for(var i=0;i<m.length;i++){
    var s=m[i], inL=WL.indexOf(s.sym)>=0;
    html+='<div class="sr-item"><div class="eil">';
    html+='<div class="eiic" style="background:'+(s.color||'var(--navy)') +'">'+(s.init||s.sym.slice(0,2))+'</div>';
    html+='<div><div class="eisym">'+s.sym+'</div><div class="einm">'+(s.name||'')+(s.mkt?' &middot; '+s.mkt:'')+'</div></div></div>';
    html+='<button class="addbtn'+(inL?' done':'')+'" data-sym="'+s.sym+'"'+(inL?' disabled':'')+'>';
    html+=(inL?'✓ ברשימה':'+ הוסף');
    html+='</button></div>';
  }
  res.innerHTML=html;
  res.querySelectorAll('.addbtn:not([disabled])').forEach(function(btn){
    btn.addEventListener('click', function(){ addStock(this.getAttribute('data-sym')); });
  });
}

function addStock(sym){
  if(WL.indexOf(sym)<0){
    WL.push(sym);
    if(!SD[sym]) getSE(sym); // create basic SD entry from EXTRA
    // Always fetch live price for newly added stock
    fetchWLStock(sym).then(function(){ renderAll(); });
  }
  renderEditList();
  renderPopular();
  if(g('searchI').value) doSearch(g('searchI').value);
}

// ── HOME HERO ───────────────────────────────────────────────────────────
function renderHome(){
  var hdr=document.querySelector('.home-hdr'); if(!hdr) return;
  // Add subtitle once
  if(!g('home-sub-txt')){
    var titleEl=hdr.querySelector('.home-title');
    if(titleEl){
      var sub=document.createElement('div');
      sub.id='home-sub-txt'; sub.className='home-sub';
      sub.textContent='סקירת שוק יומית · מחירים חיים';
      titleEl.insertAdjacentElement('afterend',sub);
    }
  }
  // Market pills for WL stocks
  var old=g('mkt-strip'); if(old) old.remove();
  var pills=WL.slice(0,6).map(function(sym){
    var s=SD[sym]; if(!s||s.chg==='—'||s.chg==='...') return '';
    var cls=s.dir>0?'up':s.dir<0?'dn':'nt';
    var arrow=s.dir>0?'▲':s.dir<0?'▼':'';
    return '<div class="mkt-pill"><span class="mkt-pill-sym">'+sym+'</span><span class="mkt-pill-chg '+cls+'">'+arrow+' '+s.chg+'</span></div>';
  }).filter(Boolean).join('');
  if(pills){
    var strip=document.createElement('div');
    strip.id='mkt-strip'; strip.className='mkt-strip';
    strip.innerHTML=pills; hdr.appendChild(strip);
  }
}

// ── RENDER ALL ─────────────────────────────────────────────────────────
function renderAll(){
  renderFeed();
  renderWLMini();
  renderBriefCards();
  renderHome();
}

// Alias for build.py compatibility (build.py calls renderCards after price refresh)
function renderCards(){ renderAll(); }

// ── LIVE PRICE FETCH ────────────────────────────────────────────────────
var CRYPTO_SYMS={BTC:1,ETH:1,XRP:1};

async function fetchWLStock(sym) {
  if(CRYPTO_SYMS[sym]) return; // crypto handled by CoinGecko
  try {
    var r=await fetch('https://query1.finance.yahoo.com/v8/finance/chart/'+sym+'?interval=1d&range=1d');
    if(!r.ok) return;
    var d=await r.json();
    var m=d&&d.chart&&d.chart.result&&d.chart.result[0]&&d.chart.result[0].meta;
    if(!m) return;
    var price=m.regularMarketPrice||m.previousClose;
    var prev=m.chartPreviousClose||m.previousClose||price;
    var pct=prev?(price-prev)/prev*100:0;
    var ps=price.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' $';
    var cs=(pct>=0?'+':'')+pct.toFixed(2)+'%';
    if(!SD[sym]) getSE(sym);
    SD[sym].price=ps; SD[sym].chg=cs; SD[sym].dir=pct>=0?1:-1;
  } catch(e){}
}

// Fetch ALL WL stocks (not just non-builtin) and re-render
async function refreshWLExtras(){
  var stocks=WL.filter(function(s){ return !CRYPTO_SYMS[s]; });
  if(!stocks.length) return;
  await Promise.allSettled(stocks.map(fetchWLStock));
  renderAll();
}

window.addEventListener('load',function(){
  setTimeout(refreshWLExtras, 1800);
  setInterval(refreshWLExtras, 5*60*1000);
});

renderAll();
