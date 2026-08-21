// Server-side proxy for football-data.org fixtures — keeps the API token
// server-only (never sent to the browser) and avoids browser CORS.
// Requires a free API key from https://www.football-data.org/client/register
// set as the FOOTBALL_DATA_ORG_TOKEN environment variable in Vercel.

const COMPETITION_MAP = {
  E0: 'PL',   // England - Premier League
  E1: 'ELC',  // England - Championship
  D1: 'BL1',  // Germany - Bundesliga
  SP1: 'PD',  // Spain - La Liga
  I1: 'SA',   // Italy - Serie A
  F1: 'FL1',  // France - Ligue 1
  N1: 'DED',  // Netherlands - Eredivisie
  P1: 'PPL',  // Portugal - Primeira Liga
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function handler(req, res) {
  const { league, date } = req.query;

  const token = process.env.FOOTBALL_DATA_ORG_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'Server missing FOOTBALL_DATA_ORG_TOKEN environment variable' });
    return;
  }

  const competition = COMPETITION_MAP[league];
  if (!competition) {
    res.status(400).json({ error: 'League not supported for fixtures', supported: Object.keys(COMPETITION_MAP) });
    return;
  }
  if (!DATE_RE.test(date || '')) {
    res.status(400).json({ error: 'Invalid or missing "date" (expected YYYY-MM-DD)' });
    return;
  }

  const upstreamUrl = `https://api.football-data.org/v4/competitions/${competition}/matches?dateFrom=${date}&dateTo=${date}`;

  try {
    const upstream = await fetch(upstreamUrl, { headers: { 'X-Auth-Token': token } });
    const data = await upstream.json();
    if (!upstream.ok) {
      res.status(upstream.status).json({ error: data.message || `Upstream returned HTTP ${upstream.status}` });
      return;
    }
    const matches = (data.matches || []).map(m => ({
      id: m.id,
      utcDate: m.utcDate,
      status: m.status,
      homeTeam: m.homeTeam?.name || m.homeTeam?.shortName || 'Unknown',
      awayTeam: m.awayTeam?.name || m.awayTeam?.shortName || 'Unknown',
    }));
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).json({ matches });
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach football-data.org: ' + err.message });
  }
}
