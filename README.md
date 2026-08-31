# 1X2 Predictor

Match result (Home win / Draw / Away win) probability calculator, using a
Dixon-Coles attack/defense model fitted via iterative proportional fitting
(IPF, equivalent to maximum-likelihood Poisson regression) with recency
weighting, on free team-stats pulled from football-data.co.uk.

- `index.html` — the frontend (static, no build step).
- `api/csv.js` — a Vercel serverless function that fetches the season-results
  CSV from football-data.co.uk server-side and returns it to the frontend,
  same-origin. This is what fixes the CORS error you get when the browser
  tries to call football-data.co.uk directly.
- `api/fixtures.js` — a Vercel serverless function that fetches the day's
  fixtures from football-data.org (see setup below) and returns them
  same-origin, keeping the API token server-only.

## Fixtures calendar setup (football-data.org)

The "ตารางแข่งขันประจำวัน" (daily fixtures) section needs a free API token:

1. Register at https://www.football-data.org/client/register (free, no card).
2. Copy the API token from the confirmation email / your account page.
3. In the Vercel dashboard: **Project → Settings → Environment Variables**,
   add `FOOTBALL_DATA_ORG_TOKEN` = your token, for Production (and Preview/
   Development if you use them).
4. Redeploy (Settings change → trigger a new deployment, or just push again).

Only leagues covered by football-data.org's free tier get a fixtures list
(Premier League, Championship, Bundesliga, La Liga, Serie A, Ligue 1,
Eredivisie, Primeira Liga) — other leagues in the dropdown still work for
season stats, just fall back to the manual team pickers.

## Run locally

```bash
npm install -g vercel
vercel dev
```

Then open the printed localhost URL — `/api/csv` will run as a local
serverless function too.

## Deploy (Vercel, free tier)

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com, sign in with **Continue with GitHub**.
3. **Add New... > Project**, import the repo you just pushed.
4. Leave all settings as default (no framework, no build command needed) and
   click **Deploy**.
5. Vercel gives you a live `https://<project>.vercel.app` URL. Every push to
   the repo auto-redeploys.
