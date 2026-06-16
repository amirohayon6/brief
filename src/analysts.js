// src/analysts.js
// Static analyst data — update weekly at most


var SD={
BTC:{name:"ביטקוין",mkt:"קריפטו",price:"66340 דולר",chg:"+1.8%",dir:1,color:"#F7931A",init:"B",
 summary:"ביטקוין ב-66,340 דולר — שיא שבועיים. FOMC פתוח היום, החלטה ועיתונאות Warsh מחר. 97.4% סיכוי ל-hold ב-3.5-3.75%. הסיכון: ביטקוין ירד אחרי 8 מתוך 9 פגישות FOMC האחרונות — sell-the-news. אבל: Strategy +1,587 BTC, 11,000 BTC יצאו מבורסות, Nasdaq +3.07%.",
 scen:[{l:"שמרני",v:"60K",p:"-8%",c:"scb"},{l:"קונצנזוס",v:"72K",p:"+10%",c:"scm"},{l:"אופטימי",v:"85K",p:"+29%",c:"scu"}],
 analysts:[
  {w:"ARK Invest",n:"תרחיש בסיס שנתי",t:"150,000",u:"+128%",uc:"up"},
  {w:"ברנשטיין",n:"ראלי קרנות סל",t:"150,000",u:"+128%",uc:"up"},
  {w:"Standard Chartered",n:"Crypto winter is over",t:"100,000",u:"+52%",uc:"up"},
  {w:"Changelly",n:"תחזית 17 יוני",t:"65,975",u:"+0.4%",uc:"nt"},
  {w:"תרחיש שבירה",n:"אם פד מאכזב",t:"55,000",u:"-16%",uc:"dn"}
 ],
 sl:"60,000 דולר",
 tech:[{l:"תמיכה 1",v:"63,000"},{l:"תמיכה 2",v:"60,000"},{l:"התנגדות 1",v:"68,000"},{l:"התנגדות 2",v:"73,000"}],
 fin:[{l:"שווי שוק",v:"1.26T"},{l:"ETF inflows היום",v:"85.8M"},{l:"DXY",v:"99.56"},{l:"Fear & Greed",v:"18 — פחד"},{l:"ירידה מהשיא",v:"48%"},{l:"RSI",v:"37 — שיפור"}],
 deals:[
  {t:"הסכם ארהב-איראן (15 יוני)",v:"טראמפ: הסכם שלום. הורמוז נפתח. נפט מטה. DXY ירד. ריסק-און גדול."},
  {t:"ETF inflows — היפוך מגמה",v:"85.8 מיליון דולר: iBIT +35M, FBTC +42M. אחרי שבועות של outflows."},
  {t:"פד FOMC מחר 17 יוני",v:"60%+ סיכוי להורדת ריבית. הורדה = ריסק-און = BTC מעלה."}
 ],
 news:[
  {c:"#22C55E",t:"BTC +2.08% ל-65,695: הסכם שלום ארהב-איראן. הורמוז נפתח. נפט מטה."},
  {c:"#22C55E",t:"ETF inflows 85.8 מיליון דולר — iBIT +35M, FBTC +42M. היפוך מגמה."},
  {c:"#22C55E",t:"DXY ירד ל-99.56, S&P 500 +0.5%. דולר חלש = BTC חזק."},
  {c:"#3B6FE8",t:"פד מחר 17 יוני: 60%+ סיכוי להורדת ריבית. הורדה = ריסק-און נוסף."}
 ],
 outlet:"bullish",
 outlook:"שורי לטווח קצר. קטליזטורים: פד מחר + הסכם איראן + ETF inflows חזרו. תמיכה: 63,000. סיכון: פד מאכזב = ירידה ל-60,000."
},

NVDA:{name:"Nvidia",mkt:"Nasdaq",price:"211.14 דולר",chg:"+3.54%",dir:1,color:"#76B900",init:"N",
 summary:"Nvidia ב-211.14 דולר. Nasdaq +3.07% — ריסק-און גדול על הסכם איראן. שווי שוק 4.97 טריליון. EPS Q1: 1.866 דולר. Vera Rubin בייצור המוני. FOMC מחר = Warsh. Dovish = NVDA שוברת 220 ומעלה. קונצנזוס: 273 דולר (+29%).",
 scen:[{l:"שמרני",v:"185",p:"-11%",c:"scb"},{l:"קונצנזוס",v:"273",p:"+31%",c:"scm"},{l:"Cantor",v:"350",p:"+68%",c:"scu"}],
 analysts:[
  {w:"Cantor Fitzgerald",n:"Vera Rubin + Agentic AI",t:"350 דולר",u:"+68%",uc:"up"},
  {w:"מורגן סטנלי",n:"Overweight",t:"285 דולר",u:"+37%",uc:"up"},
  {w:"UBS",n:"Buy",t:"275 דולר",u:"+32%",uc:"up"},
  {w:"קונצנזוס 40 אנל'",n:"Strong Buy",t:"273 דולר",u:"+31%",uc:"up"},
  {w:"שמרני",n:"יצוא לסין / Senate",t:"185 דולר",u:"-11%",uc:"dn"}
 ],
 sl:"200 דולר",
 tech:[{l:"שיא 52 שבועות",v:"236.54"},{l:"תמיכה",v:"200"},{l:"התנגדות",v:"232"},{l:"MA200",v:"מעל — שורי"}],
 fin:[{l:"שווי שוק",v:"5.1T"},{l:"EPS Q1",v:"1.87"},{l:"הכנסות Q1",v:"81.6B"},{l:"שולי גולמי",v:"75.2%"},{l:"הדרכה Q2",v:"87.5B"},{l:"דוח Q2",v:"26 אוגוסט"}],
 deals:[
  {t:"Apple tie-up (2026)",v:"Apple אישרה שילוב Nvidia AI ב-iPhone ו-Mac. TipRanks: massive victory."},
  {t:"SpaceX IPO — 161 דולר",v:"SpaceX (לקוחה) נסחרת ב-161. AI data centers בחלל = שוק חדש."},
  {t:"Vera Rubin — ייצור המוני",v:"פלטפורמה לאחר Blackwell. Agentic AI. ג'נסן: AI שימושי הגיע."}
 ],
 news:[
  {c:"#22C55E",t:"הסכם ארהב-איראן: נפט מטה = אינפלציה נמוכה = פד מוריד ריבית = NVDA עולה."},
  {c:"#22C55E",t:"Vera Rubin בייצור המוני. Apple tie-up: Nvidia AI ב-iPhone ו-Mac."},
  {c:"#22C55E",t:"SpaceX ב-161 דולר (+19%). SpaceX = לקוחת Nvidia. AI בחלל."},
  {c:"#3B6FE8",t:"פד מחר: הורדת ריבית = ריסק-און = NVDA עולה חזק. 40 אנליסטים: Strong Buy."}
 ],
 outlook:"שורי. הסכם איראן + פד מחר = רוח גבית. קונצנזוס: 273 דולר (+31%). Stop Loss: 200 דולר."
},

IBM:{name:"IBM",mkt:"NYSE",price:"269.37 דולר",chg:"-1.2%",dir:-1,color:"#054ADA",init:"I",
 summary:"IBM ב-269.37 דולר — ממשיכה לתקן מהשיא 332.46. IBM ייסד את יום הולדתה ה-115 ב-16 יוני. IBM + ServiceNow שיתוף AI מורחב. Warsh מחר = הורדת ריבית עתידית = חיובי לתוכנה ארגונית. Citi: יעד 375. Beta 0.58 + דיבידנד 2.27% = יציבות יחסית.",
 scen:[{l:"Morningstar",v:"290",p:"+6%",c:"scb"},{l:"קונצנזוס",v:"334",p:"+22%",c:"scm"},{l:"Citi",v:"375",p:"+37%",c:"scu"}],
 analysts:[
  {w:"Citi (יוני 2026)",n:"הועלה מ-285",t:"375 דולר",u:"+37%",uc:"up"},
  {w:"Wedbush",n:"Agentic AI",t:"350 דולר",u:"+28%",uc:"up"},
  {w:"Barclays",n:"Quantum Playbook",t:"350 דולר",u:"+28%",uc:"up"},
  {w:"TipRanks קונצנזוס",n:"21 אנליסטים",t:"334 דולר",u:"+22%",uc:"up"},
  {w:"Morningstar",n:"שווי הוגן",t:"290 דולר",u:"+6%",uc:"nt"}
 ],
 sl:"255 דולר",
 tech:[{l:"שיא 52 שבועות",v:"332.46"},{l:"מחיר נוכחי",v:"272.75"},{l:"Beta",v:"0.58 — נמוך"},{l:"תמיכה",v:"260"}],
 fin:[{l:"שווי שוק",v:"255B"},{l:"P/E TTM",v:"~26x"},{l:"דיבידנד",v:"2.27%"},{l:"EPS Q1",v:"1.91"},{l:"הכנסות Q1",v:"15.92B"},{l:"Beta",v:"0.58"}],
 deals:[
  {t:"IBM + ServiceNow (11 יוני)",v:"שיתוף פעולה מורחב: AI, hybrid cloud, אוטומציה."},
  {t:"Quantum Foundry — Anderon",v:"IBM + ממשל ארהב: 1 מיליארד דולר כל אחד. מניה +8% על ההכרזה."},
  {t:"Citi: יעד 375 דולר",v:"הועלה מ-285 לאחר quantum momentum. Wedbush: 350. Barclays: Overweight."}
 ],
 news:[
  {c:"#22C55E",t:"IBM + ServiceNow: שיתוף פעולה מורחב — AI, hybrid cloud, אוטומציה (11 יוני)."},
  {c:"#22C55E",t:"Bernstein: Quantum = Next Major Compute Paradigm. IBM + IONQ = הנבנות הגדולות."},
  {c:"#3B6FE8",t:"Citi: יעד 375 דולר. Wedbush: 350. Barclays: Overweight. 21 אנליסטים: Buy."},
  {c:"#F59E0B",t:"IBM ב-272.75 — תיקון 18% מהשיא. Beta 0.58 + דיבידנד 2.27% = יציבות."}
 ],
 outlook:"ניטרלי-שורי. תיקון טבעי אחרי +28% בחודש. Citi: 375 דולר. IBM נהנית מ-Agentic AI + Quantum. Stop Loss: 255."
},

IREN:{name:"IREN",mkt:"Nasdaq",price:"57.50 דולר",chg:"+5.0% Ingenostrum",dir:1,color:"#06B6D4",init:"IR",
 summary:"IREN +5% ל-57.50 דולר אחרי רכישת Ingenostrum המלאה — כניסה לאירופה. CoreWeave, Nebius ו-IREN עלו יחד ב-15 יוני. Russell 3000 ב-26 יוני = 10 ימים. Brent ל-82.25, נפט מטה = עלויות DC יורדות. Cantor: יעד 99 דולר.",
 scen:[{l:"Goldman",v:"50",p:"-7%",c:"scb"},{l:"קונצנזוס 14",v:"75",p:"+39%",c:"scm"},{l:"Bernstein",v:"105",p:"+94%",c:"scu"}],
 analysts:[
  {w:"Bernstein SocGen",n:"5GW = נכס אסטרטגי",t:"105 דולר",u:"+94%",uc:"up"},
  {w:"Cantor Fitzgerald",n:"Overweight — 28 מאי",t:"99 דולר",u:"+83%",uc:"up"},
  {w:"B. Riley",n:"הועלה מ-88",t:"96 דולר",u:"+78%",uc:"up"},
  {w:"BTIG",n:"הכנסות 2027: 2.9B",t:"80 דולר",u:"+48%",uc:"up"},
  {w:"Goldman Sachs",n:"הועלה מ-44",t:"50 דולר",u:"-7%",uc:"dn"},
  {w:"JPMorgan",n:"Underweight",t:"46 דולר",u:"-15%",uc:"dn"}
 ],
 sl:"48.41 דולר",
 tech:[{l:"שיא 52 שבועות",v:"76.87"},{l:"שפל 52 שבועות",v:"7.35"},{l:"תמיכה",v:"50"},{l:"Russell 3000",v:"26 יוני"}],
 fin:[{l:"שווי שוק",v:"18.5B"},{l:"עלייה YTD",v:"+50%"},{l:"ARR חתום",v:"3.1B"},{l:"מימון GPU",v:"3.65B"},{l:"Russell 3000",v:"26 יוני"},{l:"עלייה 12M",v:"+500%"}],
 deals:[
  {t:"Russell 3000 — 26 יוני (11 ימים)",v:"גל ביקוש פסיבי מקרנות אינדקס. קטליזטור ספציפי ל-IREN."},
  {t:"הסכם ארהב-איראן (15 יוני)",v:"נפט מטה = עלויות אנרגיה לDC יורדות = margin IREN משתפר."},
  {t:"מימון GPU 3.65 מיליארד",v:"מימון בדרגת השקעה לרכישת Blackwell. פריסה Q1 2027."}
 ],
 news:[
  {c:"#22C55E",t:"הסכם ארהב-איראן = נפט מטה = עלויות DC יורדות = margin IREN משתפר."},
  {c:"#22C55E",t:"Russell 3000 ב-26 יוני = 11 ימים. גל ביקוש פסיבי מקרנות אינדקס."},
  {c:"#22C55E",t:"פד מחר: הורדת ריבית = ריסק-און = נאוקלאוד (IREN, CoreWeave) עולים."},
  {c:"#3B6FE8",t:"Cantor: 99. B.Riley: 96. BTIG: 80. 14 אנליסטים: Buy. ARR: 4.4B."}
 ],
 outlook:"שורי לטווח בינוני. קטליזטורים: Russell 3000 (26/6) + פד + הסכם איראן. Stop Loss: 48.41."
}
};

// ── NASDAQ 100 + Popular Extras ───────────────────────────────────────────
var EXTRA=[
  // ── Big Tech ──
  {sym:"AAPL", name:"Apple",            color:"#1C1C1E", mkt:"Nasdaq", init:"AP"},
  {sym:"MSFT", name:"Microsoft",        color:"#00A4EF", mkt:"Nasdaq", init:"MS"},
  {sym:"AMZN", name:"Amazon",           color:"#FF9900", mkt:"Nasdaq", init:"AM"},
  {sym:"META", name:"Meta",             color:"#1877F2", mkt:"Nasdaq", init:"ME"},
  {sym:"GOOGL",name:"Alphabet A",       color:"#EA4335", mkt:"Nasdaq", init:"GO"},
  {sym:"GOOG", name:"Alphabet C",       color:"#4285F4", mkt:"Nasdaq", init:"GC"},
  {sym:"TSLA", name:"Tesla",            color:"#CC0000", mkt:"Nasdaq", init:"TE"},
  {sym:"COST", name:"Costco",           color:"#005DAA", mkt:"Nasdaq", init:"CO"},
  {sym:"NFLX", name:"Netflix",          color:"#E50914", mkt:"Nasdaq", init:"NF"},
  // ── Semiconductors ──
  {sym:"AVGO", name:"Broadcom",         color:"#CC0000", mkt:"Nasdaq", init:"AV"},
  {sym:"AMD",  name:"AMD",              color:"#ED1C24", mkt:"Nasdaq", init:"AD"},
  {sym:"QCOM", name:"Qualcomm",         color:"#3253DC", mkt:"Nasdaq", init:"QC"},
  {sym:"AMAT", name:"Applied Materials",color:"#00A0DC", mkt:"Nasdaq", init:"AM"},
  {sym:"MU",   name:"Micron",           color:"#0033A0", mkt:"Nasdaq", init:"MU"},
  {sym:"LRCX", name:"Lam Research",     color:"#0064A4", mkt:"Nasdaq", init:"LR"},
  {sym:"KLAC", name:"KLA Corp",         color:"#003087", mkt:"Nasdaq", init:"KL"},
  {sym:"MRVL", name:"Marvell",          color:"#1B5299", mkt:"Nasdaq", init:"MV"},
  {sym:"NXPI", name:"NXP Semiconductors",color:"#009FE3",mkt:"Nasdaq", init:"NX"},
  {sym:"ON",   name:"ON Semiconductor", color:"#00A651", mkt:"Nasdaq", init:"ON"},
  {sym:"ARM",  name:"Arm Holdings",     color:"#0091BD", mkt:"Nasdaq", init:"AR"},
  {sym:"TXN",  name:"Texas Instruments",color:"#C8102E", mkt:"Nasdaq", init:"TX"},
  {sym:"MCHP", name:"Microchip Technology",color:"#C41230",mkt:"Nasdaq",init:"MC"},
  // ── Software & Cloud ──
  {sym:"ADBE", name:"Adobe",            color:"#FF0000", mkt:"Nasdaq", init:"AD"},
  {sym:"INTU", name:"Intuit",           color:"#236CFF", mkt:"Nasdaq", init:"IN"},
  {sym:"PANW", name:"Palo Alto Networks",color:"#00C7B1",mkt:"Nasdaq", init:"PA"},
  {sym:"SNPS", name:"Synopsys",         color:"#4B0082", mkt:"Nasdaq", init:"SN"},
  {sym:"CDNS", name:"Cadence",          color:"#0066CC", mkt:"Nasdaq", init:"CD"},
  {sym:"FTNT", name:"Fortinet",         color:"#DA1F25", mkt:"Nasdaq", init:"FT"},
  {sym:"CRWD", name:"CrowdStrike",      color:"#E0173D", mkt:"Nasdaq", init:"CR"},
  {sym:"DDOG", name:"Datadog",          color:"#632CA6", mkt:"Nasdaq", init:"DD"},
  {sym:"ZS",   name:"Zscaler",          color:"#00AAE4", mkt:"Nasdaq", init:"ZS"},
  {sym:"TEAM", name:"Atlassian",        color:"#0052CC", mkt:"Nasdaq", init:"AT"},
  {sym:"WDAY", name:"Workday",          color:"#F98900", mkt:"Nasdaq", init:"WD"},
  {sym:"ANSS", name:"ANSYS",            color:"#FFB71B", mkt:"Nasdaq", init:"AN"},
  {sym:"CSCO", name:"Cisco",            color:"#1BA0D7", mkt:"Nasdaq", init:"CS"},
  {sym:"TTD",  name:"Trade Desk",       color:"#3D3935", mkt:"Nasdaq", init:"TD"},
  {sym:"APP",  name:"AppLovin",         color:"#111111", mkt:"Nasdaq", init:"AP"},
  {sym:"ZM",   name:"Zoom",             color:"#2D8CFF", mkt:"Nasdaq", init:"ZM"},
  // ── E-commerce & Platforms ──
  {sym:"MELI", name:"MercadoLibre",     color:"#FFE600", mkt:"Nasdaq", init:"ML"},
  {sym:"ABNB", name:"Airbnb",           color:"#FF5A5F", mkt:"Nasdaq", init:"AB"},
  {sym:"UBER", name:"Uber",             color:"#000000", mkt:"NYSE",   init:"UB"},
  {sym:"DASH", name:"DoorDash",         color:"#FF3008", mkt:"NYSE",   init:"DA"},
  {sym:"PDD",  name:"PDD Holdings",     color:"#FF5722", mkt:"Nasdaq", init:"PD"},
  // ── Biotech & Healthcare ──
  {sym:"REGN", name:"Regeneron",        color:"#004B87", mkt:"Nasdaq", init:"RG"},
  {sym:"GILD", name:"Gilead Sciences",  color:"#C8102E", mkt:"Nasdaq", init:"GI"},
  {sym:"VRTX", name:"Vertex Pharma",    color:"#6F2DA8", mkt:"Nasdaq", init:"VX"},
  {sym:"AMGN", name:"Amgen",            color:"#003087", mkt:"Nasdaq", init:"AG"},
  {sym:"ISRG", name:"Intuitive Surgical",color:"#004F9F",mkt:"Nasdaq", init:"IS"},
  {sym:"DXCM", name:"DexCom",           color:"#00B140", mkt:"Nasdaq", init:"DX"},
  {sym:"IDXX", name:"IDEXX Labs",       color:"#E4002B", mkt:"Nasdaq", init:"ID"},
  {sym:"ILMN", name:"Illumina",         color:"#6600CC", mkt:"Nasdaq", init:"IL"},
  {sym:"BIIB", name:"Biogen",           color:"#E4002B", mkt:"Nasdaq", init:"BI"},
  {sym:"GEHC", name:"GE Healthcare",    color:"#004B87", mkt:"Nasdaq", init:"GH"},
  // ── Consumer ──
  {sym:"PEP",  name:"PepsiCo",          color:"#004B93", mkt:"Nasdaq", init:"PE"},
  {sym:"SBUX", name:"Starbucks",        color:"#00704A", mkt:"Nasdaq", init:"SB"},
  {sym:"MDLZ", name:"Mondelez",         color:"#8B0000", mkt:"Nasdaq", init:"MD"},
  {sym:"KHC",  name:"Kraft Heinz",      color:"#E4002B", mkt:"Nasdaq", init:"KH"},
  {sym:"MNST", name:"Monster Beverage", color:"#111111", mkt:"Nasdaq", init:"MN"},
  {sym:"KDP",  name:"Keurig Dr Pepper", color:"#8B0000", mkt:"Nasdaq", init:"KD"},
  {sym:"LULU", name:"Lululemon",        color:"#000000", mkt:"Nasdaq", init:"LL"},
  {sym:"ROST", name:"Ross Stores",      color:"#003087", mkt:"Nasdaq", init:"RS"},
  {sym:"DLTR", name:"Dollar Tree",      color:"#00843D", mkt:"Nasdaq", init:"DL"},
  {sym:"MAR",  name:"Marriott",         color:"#C8102E", mkt:"Nasdaq", init:"MA"},
  {sym:"ORLY", name:"O'Reilly Auto",    color:"#003087", mkt:"Nasdaq", init:"OR"},
  // ── Industrials & Infrastructure ──
  {sym:"HON",  name:"Honeywell",        color:"#E4002B", mkt:"Nasdaq", init:"HN"},
  {sym:"CSX",  name:"CSX Corp",         color:"#004F9F", mkt:"Nasdaq", init:"CS"},
  {sym:"PCAR", name:"PACCAR",           color:"#003087", mkt:"Nasdaq", init:"PC"},
  {sym:"ODFL", name:"Old Dominion",     color:"#003087", mkt:"Nasdaq", init:"OD"},
  {sym:"FAST", name:"Fastenal",         color:"#003087", mkt:"Nasdaq", init:"FA"},
  {sym:"VRSK", name:"Verisk",           color:"#003087", mkt:"Nasdaq", init:"VR"},
  {sym:"FANG", name:"Diamondback Energy",color:"#FF6B00",mkt:"Nasdaq", init:"FG"},
  {sym:"CEG",  name:"Constellation Energy",color:"#00457C",mkt:"Nasdaq",init:"CE"},
  {sym:"EXC",  name:"Exelon",           color:"#003087", mkt:"Nasdaq", init:"EX"},
  {sym:"XEL",  name:"Xcel Energy",      color:"#003087", mkt:"Nasdaq", init:"XE"},
  // ── Services & Telecom ──
  {sym:"CTAS", name:"Cintas",           color:"#E4002B", mkt:"Nasdaq", init:"CT"},
  {sym:"ADP",  name:"ADP",              color:"#D50000", mkt:"Nasdaq", init:"AD"},
  {sym:"PAYX", name:"Paychex",          color:"#004B87", mkt:"Nasdaq", init:"PX"},
  {sym:"TMUS", name:"T-Mobile",         color:"#E20074", mkt:"Nasdaq", init:"TM"},
  {sym:"CMCSA",name:"Comcast",          color:"#CC0000", mkt:"Nasdaq", init:"CM"},
  {sym:"CHTR", name:"Charter Comm",     color:"#0066CC", mkt:"Nasdaq", init:"CH"},
  {sym:"CTSH", name:"Cognizant",        color:"#1B5299", mkt:"Nasdaq", init:"CG"},
  {sym:"EA",   name:"Electronic Arts",  color:"#252525", mkt:"Nasdaq", init:"EA"},
  {sym:"WBD",  name:"Warner Bros Discovery",color:"#003087",mkt:"Nasdaq",init:"WB"},
  // ── Crypto & Fintech ──
  {sym:"COIN", name:"Coinbase",         color:"#0052FF", mkt:"Nasdaq", init:"CB"},
  {sym:"MSTR", name:"Strategy",         color:"#E4002B", mkt:"Nasdaq", init:"ST"},
  // ── Israeli ──
  {sym:"AFCN", name:"אפקון החזקות",    color:"#F59E0B", mkt:'ת"א',    init:"אפ"},
  {sym:"GNRS", name:"גנריישן קפיטל",   color:"#10B981", mkt:'ת"א',    init:"גנ"},
  // ── Crypto ──
  {sym:"ETH",  name:"את'ריום",          color:"#627EEA", mkt:"קריפטו", init:"ET"},
  {sym:"XRP",  name:"ריפל",             color:"#00AAE4", mkt:"קריפטו", init:"XR"},
  // ── Already in SD but also here for search ──
  {sym:"MBLY", name:"Mobileye",         color:"#0066CC", mkt:"Nasdaq", init:"MB"},
  {sym:"SOFI", name:"SoFi Technologies",color:"#9B59B6", mkt:"Nasdaq", init:"SF"},
  {sym:"PLTR", name:"Palantir",         color:"#1A1A2E", mkt:"NYSE",   init:"PL"}
];

var UID=(function(){var id=localStorage.getItem("mb_uid");if(!id){id="u"+Date.now().toString(36)+Math.random().toString(36).slice(2,5);localStorage.setItem("mb_uid",id);}return id;})();
var WLK="mb_wl_"+UID;
var WL=JSON.parse(localStorage.getItem(WLK)||'["BTC","NVDA","IBM"]');
function saveWL(){localStorage.setItem(WLK,JSON.stringify(WL));}

// ── FLASH FEED DATA ─────────────────────────────────────────────────
