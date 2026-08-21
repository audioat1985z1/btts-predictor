# BTTS Predictor

Both Teams To Score probability calculator (Poisson + Dixon-Coles correlation
adjustment), with free team-stats pulled from football-data.co.uk.

- `index.html` — the frontend (static, no build step).
- `api/csv.js` — a Vercel serverless function that fetches the CSV from
  football-data.co.uk server-side and returns it to the frontend, same-origin.
  This is what fixes the CORS error you get when the browser tries to call
  football-data.co.uk directly.

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
