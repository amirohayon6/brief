# Market Brief — Project Context

## What is this
Hebrew stock market daily review website. Static site, auto-deploys to Vercel on git push.
- Live: https://brief-z29m.vercel.app/
- Repo: https://github.com/amirohayon6/brief
- Local: /Users/amirohayon/market-brief-local/market-brief-project

## The golden rule
**Only edit `content/daily.md` for daily updates.**
Never touch: `src/ui.js` · `src/style.css` · `src/analysts.js` · `scripts/build.py`

## Design tokens
- Navy: `#0F2044` — headers, nav, buttons
- Gold: `#F5C842` — accents, highlights
- White: `#fff` — card backgrounds
- Red: `#EF4444` — negative/bear
- Green: `#22C55E` — positive/bull
- Amber: `#F59E0B` — events/warnings
- Font: Heebo (Hebrew RTL)

## Architecture
- `content/daily.md` → `scripts/build.py` → `dist/index.html` → Vercel
- `api/price.js` — Vercel proxy for Yahoo Finance (CORS bypass)
- `api/news.js` — Vercel proxy for Yahoo Finance RSS (live news, 15min refresh)
- `src/analysts.js` — 43 stock definitions (SD + EXTRA arrays)
- `src/ui.js` — all rendering logic
- `src/style.css` — all styles

## daily.md format

```markdown
# סקירה יומית — DD חודש YYYY

## meta
date: יום, DD חודש YYYY
date_short: DD חודש
updated: "10:30"
next_brief: [next event]

## ticker
| sym | price | chg | dir |
|-----|-------|-----|-----|
| BTC | price | chg% | 1 or -1 or 0 |
| NVDA | price | chg% | 1 or -1 or 0 |
| IBM | price | chg% | 1 or -1 or 0 |
| IREN | price | chg% | 1 or -1 or 0 |
| Nasdaq | desc | desc | 1 or -1 or 0 |
| Brent | price$ | desc | 1 or -1 or 0 |
| [macro] | value | desc | 0 |

## stocks

### SYMBOL
price: X,XXX דולר
chg: +/-X.X%
dir: 1 or -1 or 0
summary: 2-3 Hebrew sentences
news:
- color: "#22C55E"
  text: Hebrew news item
- color: "#EF4444"
  text: Hebrew news item

## flash

- type: bull
  time: "HH:MM ET"
  tag: "max 3 words"
  tickers: [SYM1, SYM2]
  txt: "Hebrew description"
```

## User watchlist (source of truth for the brief)
**Before writing daily.md**, read `content/watchlist.json` to get the user's current stock list.
Every symbol in that file MUST appear in the `## stocks` section of daily.md.
If a symbol is not in the 43 below, search for its current price and write a 2-3 sentence Hebrew summary.

## All 43 tickers (in order)
BTC ETH XRP NVDA AAPL MSFT AMZN META GOOGL TSLA
AVGO AMD CRWD PANW PLTR DDOG APP TTD QCOM AMAT
MU MRVL ARM TXN ADBE INTU NFLX COST SBUX TMUS
AMGN GILD VRTX REGN ISRG IBM IREN COIN MSTR SOFI
TEAM WDAY CEG

## Flash format rules
- MUST be bullet list (- type:) NOT ### headings
- 8 items per day
- types: bull / bear / event / info

## dir field: 1=up · -1=down · 0=neutral
## color: #22C55E=positive · #EF4444=negative · #F59E0B=event

## Build & deploy
```bash
cd /Users/amirohayon/market-brief-local/market-brief-project
python3 scripts/build.py
# verify: ✅ Done! and Flash items: 8
git add content/daily.md dist/index.html
git commit -m "Daily update — DD חודש YYYY"
git push
```

## Hebrew days: ראשון שני שלישי רביעי חמישי שישי שבת
## Hebrew months: ינואר פברואר מרץ אפריל מאי יוני יולי אוגוסט ספטמבר אוקטובר נובמבר דצמבר
