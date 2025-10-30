const express = require('express');
const axios = require('axios');

const router = express.Router();

// Small helper for JSON GETs (adds headers and disables system proxies that can cause HTML redirects)
async function getJson(url, params = {}) {
  return axios.get(url, {
    params,
    headers: { Accept: 'application/json', 'User-Agent': 'astroai-server/1.0' },
    proxy: false,
    validateStatus: () => true,
  });
}

// GET /api/nasa/apod -> Astronomy Picture of the Day
router.get('/apod', async (req, res) => {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';    // fallback demo key
    const { date } = req.query;                 // optional: ?date=YYYY-MM-DD

    const { data } = await axios.get('https://api.nasa.gov/planetary/apod', {
      params: {
        api_key: apiKey,
        ...(date ? { date } : {}),              // add date param only if provided
      },
    });

    res.json(data);                             // send NASA response to client
  } catch (err) {
    console.error('APOD error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: 'Failed to fetch APOD',
      details: err.response?.data || err.message,
    });
  }
});

// GET /api/nasa/mars -> Mars Rover Photos
// Example: /api/nasa/mars?rover=curiosity&sol=1000
router.get('/mars', async (req, res) => {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  const rover = (req.query.rover || 'curiosity').toString();
  const solParam = req.query.sol;
  const earthDate = req.query.earth_date;

  const baseUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${encodeURIComponent(rover)}`;
  // Allow forcing mock data for development: /api/nasa/mars?mock=1
  if (req.query.mock === '1') {
    return res.json({
      photos: [
        {
          id: 102693,
          sol: 1000,
          camera: { id: 20, name: 'FHAZ', rover_id: 5, full_name: 'Front Hazard Avoidance Camera' },
          img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FRB_488897928EDR_F0481570FHAZ00323M_.JPG',
          earth_date: '2015-05-30',
          rover: { id: 5, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active' },
        },
        {
          id: 102694,
          sol: 1000,
          camera: { id: 21, name: 'RHAZ', rover_id: 5, full_name: 'Rear Hazard Avoidance Camera' },
          img_src: 'https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/rcam/RRB_488897928EDR_F0481570RHAZ00323M_.JPG',
          earth_date: '2015-05-30',
          rover: { id: 5, name: 'Curiosity', landing_date: '2012-08-06', launch_date: '2011-11-26', status: 'active' },
        },
      ],
    });
  }
  const primaryParams = { api_key: apiKey };
  if (earthDate) {
    primaryParams.earth_date = earthDate;
  } else if (typeof solParam !== 'undefined') {
    primaryParams.sol = Number(solParam);
  }

  try {
    let primary = null;
    let latest = null;

    // If neither sol nor earth_date provided, go straight to latest_photos
    if (typeof primaryParams.sol === 'undefined' && typeof primaryParams.earth_date === 'undefined') {
      latest = await axios.get(`${baseUrl}/latest_photos`, {
        params: { api_key: apiKey },
        headers: { Accept: 'application/json', 'User-Agent': 'astroai-server/1.0' },
        proxy: false,
        validateStatus: () => true,
      });
      if (latest.status >= 200 && latest.status < 300 && Array.isArray(latest.data?.latest_photos)) {
        return res.json({ photos: latest.data.latest_photos });
      }
    } else {
      // Primary: /photos with sol or earth_date
      primary = await axios.get(`${baseUrl}/photos`, {
        params: primaryParams,
        headers: { Accept: 'application/json', 'User-Agent': 'astroai-server/1.0' },
        proxy: false,
        validateStatus: () => true, // treat any status as a response we can inspect
      });

      if (primary.status >= 200 && primary.status < 300 && Array.isArray(primary.data?.photos)) {
        return res.json(primary.data);
      }
    }

    // Fallback: latest_photos (works even if primary path has issues)
    const fallback = await axios.get(`${baseUrl}/latest_photos`, {
      params: { api_key: apiKey },
      headers: { Accept: 'application/json', 'User-Agent': 'astroai-server/1.0' },
      proxy: false,
      validateStatus: () => true,
    });

    if (fallback.status >= 200 && fallback.status < 300 && Array.isArray(fallback.data?.latest_photos)) {
      return res.json({ photos: fallback.data.latest_photos });
    }

    // If both failed, try manifest -> max_date as a last live fallback
    try {
      const manifest = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/manifests/${encodeURIComponent(rover)}`, {
        params: { api_key: apiKey },
        headers: { Accept: 'application/json', 'User-Agent': 'astroai-server/1.0' },
        proxy: false,
        validateStatus: () => true,
      });
      const maxDate = manifest.data?.photo_manifest?.max_date;
      if (manifest.status >= 200 && manifest.status < 300 && maxDate) {
        const fromMax = await axios.get(`${baseUrl}/photos`, {
          params: { api_key: apiKey, earth_date: maxDate },
          headers: { Accept: 'application/json', 'User-Agent': 'astroai-server/1.0' },
          proxy: false,
          validateStatus: () => true,
        });
        if (fromMax.status >= 200 && fromMax.status < 300 && Array.isArray(fromMax.data?.photos)) {
          return res.json(fromMax.data);
        }
      }
    } catch (ignore) {
      // continue to diagnostics
    }

    // If all failed, return the best available diagnostics
    // If we hit a redirect, expose the Location header to help diagnose local proxies/CDNs
    const redirectInfo = ((primary && primary.status >= 300 && primary.status < 400 && primary.headers?.location)
      ? { redirect: primary.headers.location }
      : null) || ((fallback && fallback.status >= 300 && fallback.status < 400 && fallback.headers?.location)
      ? { redirect: fallback.headers.location }
      : null) || ((latest && latest.status >= 300 && latest.status < 400 && latest.headers?.location)
      ? { redirect: latest.headers.location }
      : null);

    // Simplified: do not fallback to NASA Images API here; new /mars/daily route handles user-friendly fallback

    const details = (primary && primary.data) || (fallback && fallback.data) || (latest && latest.data) || redirectInfo || { message: 'Unknown error from NASA Mars API' };
    const status = (primary && primary.status) || (fallback && fallback.status) || (latest && latest.status) || 500;
    console.error('Mars error:', details);
    return res.status(status).json({ error: 'Failed to fetch Mars photos', details });
  } catch (err) {
    console.error('Mars error (exception):', err.message);
    return res.status(500).json({ error: 'Failed to fetch Mars photos', details: err.message });
  }
});

// GET /api/nasa/mars/daily -> A single daily Mars image with brief info and weather
router.get('/mars/daily', async (req, res) => {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';

  // Helper: try a rover for a specific earth_date, then fall back to latest_photos
  const tryRover = async (rover, dateISO) => {
    const base = `https://api.nasa.gov/mars-photos/api/v1/rovers/${encodeURIComponent(rover)}`;
    // First try the specific date
    let r = await getJson(`${base}/photos`, { api_key: apiKey, earth_date: dateISO });
    if (r.status >= 200 && r.status < 300 && Array.isArray(r.data?.photos) && r.data.photos.length > 0) {
      return { source: rover, photo: r.data.photos[0] };
    }
    // Then try latest_photos for that rover
    r = await getJson(`${base}/latest_photos`, { api_key: apiKey });
    if (r.status >= 200 && r.status < 300 && Array.isArray(r.data?.latest_photos) && r.data.latest_photos.length > 0) {
      return { source: rover, photo: r.data.latest_photos[0] };
    }
    return null;
  };

  // Helper: NASA Images API fallback for Mars surface (avoid rover/selfie/mock-up)
  const tryImagesApi = async () => {
    const r = await getJson('https://images-api.nasa.gov/search', { q: 'Mars surface', media_type: 'image' });
    if (r.status >= 200 && r.status < 300 && Array.isArray(r.data?.collection?.items)) {
      const excludeRe = /(rover|curiosity|perseverance|opportunity|spirit|self\-?portrait|selfie|wheel|mock|mahli|drill|instrument|mastcam)/i;
      const item = r.data.collection.items.find((it) => {
        const d = it.data?.[0];
        const title = (d?.title || '').toString();
        const desc = (d?.description || '').toString();
        return !(excludeRe.test(title) || excludeRe.test(desc));
      });
      if (item) {
        const d = item.data?.[0] || {};
        const link = (Array.isArray(item.links) && item.links[0]?.href) || item.href || '';
        return {
          source: 'images-api',
          photo: {
            id: d.nasa_id || 'mars-image',
            sol: null,
            camera: { id: 0, name: 'N/A', rover_id: 0, full_name: d.title || 'Mars surface image' },
            img_src: link,
            earth_date: (d.date_created || '').slice(0, 10) || new Date().toISOString().slice(0, 10),
            rover: { id: 0, name: 'Mars', landing_date: '', launch_date: '', status: '' },
          },
        };
      }
    }
    return null;
  };

  // Helper: fetch weather from NASA InSight; if not available, mark stale
  const getWeather = async () => {
    try {
      const r = await getJson('https://api.nasa.gov/insight_weather/', { api_key: apiKey, feedtype: 'json', ver: '1.0' });
      const keys = r.data?.sol_keys || [];
      if (r.status >= 200 && r.status < 300 && Array.isArray(keys) && keys.length > 0) {
        const lastSol = keys[keys.length - 1];
        const entry = r.data[lastSol];
        const terrestrial = (entry?.First_UTC || '').slice(0, 10);
        const today = new Date().toISOString().slice(0, 10);
        const stale = terrestrial !== today;
        return {
          source: 'nasa-insight',
          sol: lastSol,
          terrestrial_date: terrestrial,
          min_temp: entry?.AT?.mn ?? null,
          max_temp: entry?.AT?.mx ?? null,
          pressure: entry?.PRE?.av ?? null,
          season: entry?.Season ?? null,
          stale,
        };
      }
    } catch (e) {
      // ignore and fall through
    }
    return { source: 'nasa-insight', stale: true, note: 'Weather unavailable; using last known or none' };
  };

  try {
    const today = new Date().toISOString().slice(0, 10);
    // Order: perseverance -> curiosity
    let result = await tryRover('perseverance', today);
    if (!result) result = await tryRover('curiosity', today);
    // If neither returns anything for today, try yesterday
    if (!result) {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yesterday = y.toISOString().slice(0, 10);
      result = await tryRover('perseverance', yesterday) || await tryRover('curiosity', yesterday);
    }
    // Final fallback: NASA Images API Mars surface
    if (!result) result = await tryImagesApi();

    if (!result) {
      return res.status(502).json({ error: 'No Mars image available right now' });
    }

    const weather = await getWeather();

    return res.json({
      date: result.photo?.earth_date || today,
      source: result.source,
      photo: result.photo,
      weather,
    });
  } catch (err) {
    console.error('Mars daily error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch daily Mars image', details: err.message });
  }
});

// GET /api/nasa/asteroids -> Near Earth Objects feed
// Example: /api/nasa/asteroids?start_date=2025-10-30&end_date=2025-10-30
router.get('/asteroids', async (req, res) => {
  try {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const { start_date, end_date } = req.query;

    const { data } = await axios.get('https://api.nasa.gov/neo/rest/v1/feed', {
      params: {
        start_date,
        end_date,
        api_key: apiKey,
      },
    });

    res.json(data);
  } catch (err) {
    console.error('Asteroids error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: 'Failed to fetch asteroid feed',
      details: err.response?.data || err.message,
    });
  }
});

module.exports = router;