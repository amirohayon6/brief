# Market Brief — Claude Code Project

## מבנה הפרויקט

```
market-brief-project/
├── content/
│   └── daily.md          ← ✏️  רק זה משתנה כל יום
├── src/
│   ├── analysts.js       ← נתוני אנליסטים (מתעדכן שבועי)
│   ├── ui.js             ← כל לוגיקת ה-rendering (לא נוגעים בזה)
│   └── style.css         ← כל העיצוב (לא נוגעים בזה)
├── scripts/
│   └── build.py          ← סקריפט build (מריץ פעם ביום)
├── dist/
│   └── index.html        ← 📤 זה מה שמועלה ל-Netlify
└── README.md
```

## תהליך עדכון יומי

### שלב 1 — עדכן content/daily.md
זה הקובץ היחיד שנוגעים בו כל יום. פשוט עדכן:
- `date` — התאריך של היום
- `ticker` — המחירים הנוכחיים
- `stocks` — price, chg, dir, summary, news לכל מניה
- `flash` — עדכונים חמים וחדשות

### שלב 2 — הרץ build
```bash
python3 scripts/build.py
```
זה ייצור את `dist/index.html` תוך שניה.

### שלב 3 — העלה ל-Netlify
גרור את `dist/index.html` ל-Netlify Drop.

---

## עם Claude Code

בכל שינוי יומי, שלח לקלוד:
> "עדכן את daily.md לתאריך היום עם הנתונים הבאים: [נתונים]"

קלוד יעדכן רק את `content/daily.md` — כמה שורות בלבד.
אחר כך הרץ build ותעלה.

## מה לא לשנות
- `src/` — לא נוגעים כלל (עיצוב + לוגיקה)
- `scripts/build.py` — לא נוגעים
- `dist/` — נוצר אוטומטית

## פורמט daily.md

### ticker
```
| sym | price | chg | dir |
|-----|-------|-----|-----|
| BTC | 66,340 | +1.8% | 1 |
```
- dir: 1=עלייה, -1=ירידה, 0=ניטרלי

### stocks
```
### BTC
price: 66,340 דולר
chg: +1.8%
dir: 1
summary: סיכום קצר...
news:
- color: "#22C55E"
  text: חדשה חיובית
- color: "#EF4444"
  text: חדשה שלילית
```

### flash
```
- type: bull|bear|event|info
  time: "היום"
  tag: "כותרת"
  tickers: [BTC, NVDA]
  txt: "טקסט העדכון"
```
