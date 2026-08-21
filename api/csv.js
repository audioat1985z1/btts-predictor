// Server-side proxy for football-data.co.uk CSV files.
// Browsers get blocked by CORS calling football-data.co.uk directly;
// this endpoint fetches it server-to-server (no CORS involved) and
// hands the CSV back to our own frontend, same-origin.

const LEAGUE_RE = /^[A-Za-z0-9]{1,6}$/;
const SEASON_RE = /^[0-9]{4}$/;

export default async function handler(req, res) {
  const { league, season } = req.query;

  if (!league || !season) {
    res.status(400).json({ error: 'Missing "league" or "season" query parameter' });
    return;
  }
  if (!LEAGUE_RE.test(league) || !SEASON_RE.test(season)) {
    res.status(400).json({ error: 'Invalid "league" or "season" format' });
    return;
  }

  const upstreamUrl = `https://www.football-data.co.uk/mmz4281/${season}/${league}.csv`;

  try {
    const upstream = await fetch(upstreamUrl);
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `Upstream returned HTTP ${upstream.status}`, url: upstreamUrl });
      return;
    }
    const text = await upstream.text();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(text);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach football-data.co.uk: ' + err.message });
  }
}
