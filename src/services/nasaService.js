// Module 2: NASA Open API Service (Images API & DONKI SEP)
// [Module 2: NASA Data & Mars Weather Service]
// =========================================================================
const NasaService = (() => {
  const NASA_IMAGE_API = 'https://images-api.nasa.gov/search';
  const NASA_DONKI_SEP_API = 'https://api.nasa.gov/DONKI/SEP';
  const API_KEY = 'DEMO_KEY';
  const TIMEOUT_MS = 6000;

  let cachedCuriosityPhotos = [];
  let cachedSepEventsCount = null;
  let donkiApiStatus = 'PENDING';

  async function fetchWithTimeout(url, timeoutMs = TIMEOUT_MS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);
      return response;
    } catch (err) {
      clearTimeout(timer);
      throw err;
    }
  }

  async function fetchNextCuriosityPhoto(usedIds) {
    try {
      if (cachedCuriosityPhotos.length === 0) {
        const query = encodeURIComponent('Curiosity Mastcam Gale Crater');
        const response = await fetchWithTimeout(`${NASA_IMAGE_API}?q=${query}&media_type=image&page_size=60`);
        if (response.ok) {
          const json = await response.json();
          const items = json?.collection?.items || [];

          cachedCuriosityPhotos = items
            .filter((item) => {
              const info = item.data?.[0];
              if (!info?.nasa_id || !item.links?.[0]?.href) return false;
              const text = `${info.title || ''} ${info.description || ''}`.toLowerCase();
              const isCuriosity = text.includes('curiosity');
              const isNotArt = !text.includes('artist') && !text.includes('illustration') && !text.includes('concept');
              return isCuriosity && isNotArt;
            })
            .map((item) => {
              const info = item.data[0];
              const rawDesc = (info.description || info.title || '').replace(/<[^>]*>?/gm, '');
              const shortDesc = rawDesc.length > 130 ? `${rawDesc.slice(0, 130)}...` : rawDesc;
              return {
                id: info.nasa_id,
                title: info.title,
                imageUrl: item.links[0].href,
                nasaCaption: shortDesc,
              };
            });
        }
      }
    } catch (err) {
      cachedCuriosityPhotos = [];
    }

    if (cachedCuriosityPhotos.length === 0) {
      return {
        id: 'PIA16764',
        title: 'Curiosity Rover at John Klein Drill Site',
        imageUrl: 'https://images-assets.nasa.gov/image/PIA16764/PIA16764~medium.jpg',
        nasaCaption: 'Official NASA photo: Curiosity rover self-portrait at John Klein drill site in Gale Crater.',
      };
    }

    const available = cachedCuriosityPhotos.filter((p) => !usedIds.has(p.id));
    const pool = available.length > 0 ? available : cachedCuriosityPhotos;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  async function generateDailyMarsEnvironment(sol) {
    if (cachedSepEventsCount === null) {
      try {
        const endDate = new Date().toISOString().slice(0, 10);
        const startObj = new Date();
        startObj.setDate(startObj.getDate() - 60);
        const startDate = startObj.toISOString().slice(0, 10);

        const res = await fetchWithTimeout(
          `${NASA_DONKI_SEP_API}?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`
        );
        if (res.ok) {
          const events = await res.json();
          if (Array.isArray(events)) {
            cachedSepEventsCount = events.length;
            donkiApiStatus = events.length === 0 ? 'NO_EVENTS' : 'SUCCESS';
          } else {
            cachedSepEventsCount = 0;
            donkiApiStatus = 'FAILED';
          }
        } else {
          cachedSepEventsCount = 0;
          donkiApiStatus = 'FAILED';
        }
      } catch (err) {
        cachedSepEventsCount = 0;
        donkiApiStatus = 'NETWORK_FALLBACK';
      }
    }

    const baseWeather = HISTORICAL_MARS_WEATHER[Math.floor(Math.random() * HISTORICAL_MARS_WEATHER.length)];
    const stormChance = sol <= 5 ? 0.15 : sol <= 10 ? 0.25 : sol <= 15 ? 0.40 : 0.50;
    const isDustStorm = Math.random() < stormChance;

    const activityBias = Math.min(2, Math.floor(cachedSepEventsCount / 2));
    const phaseBias = sol <= 5 ? 0 : sol <= 12 ? 1 : 2;
    const rawLevel = 1 + Math.floor(Math.random() * 2) + Math.floor((activityBias + phaseBias) / 2);
    const radiationLevel = Math.min(5, Math.max(1, rawLevel));

    return {
      tempMax: baseWeather.tempMax,
      tempMin: baseWeather.tempMin,
      windSpeedMs: isDustStorm ? +(baseWeather.windSpeedMs + 8.5).toFixed(1) : baseWeather.windSpeedMs,
      isDustStorm,
      radiationLevel,
      isSimulatedWeather: true,
      donkiSepEventsCount: cachedSepEventsCount,
      donkiStatus: donkiApiStatus,
      dataSourceNote: 'Mars conditions are simulated for gameplay. Space weather is inspired by NASA data.',
    };
  }

  return { fetchNextCuriosityPhoto, generateDailyMarsEnvironment };
})();

    // =========================================================================
