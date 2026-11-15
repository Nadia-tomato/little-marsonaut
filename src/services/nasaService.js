// Module 2: NASA Open API Service (Images API & DONKI SEP)
// [Module 2: NASA Data & Mars Weather Service]
    // =========================================================================
    const NasaService = (() => {
      const NASA_IMAGE_API = 'https://images-api.nasa.gov/search';
      const NASA_DONKI_SEP_API = 'https://api.nasa.gov/DONKI/SEP';
      const API_KEY = 'DEMO_KEY';

      let cachedCuriosityPhotos = [];
      let cachedSepEventsCount = null;

      async function fetchNextCuriosityPhoto(usedIds) {
        try {
          if (cachedCuriosityPhotos.length === 0) {
            const query = encodeURIComponent('Curiosity Mastcam Gale Crater');
            const response = await fetch(`${NASA_IMAGE_API}?q=${query}&media_type=image&page_size=60`);
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
        } catch (err) {
          cachedCuriosityPhotos = [];
        }

        if (cachedCuriosityPhotos.length === 0) {
          return {
            id: 'FALLBACK_MARS',
            title: 'Mars Rocks and Sand Dunes',
            imageUrl: 'https://images-assets.nasa.gov/image/PIA16764/PIA16764~thumb.jpg',
            nasaCaption: 'Real Mars rocks and sandy ground taken by NASA Curiosity Rover.',
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

            const res = await fetch(`${NASA_DONKI_SEP_API}?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`);
            const events = await res.json();
            cachedSepEventsCount = Array.isArray(events) ? events.length : 1;
          } catch (err) {
            cachedSepEventsCount = 1;
          }
        }

        const baseWeather = HISTORICAL_MARS_WEATHER[Math.floor(Math.random() * HISTORICAL_MARS_WEATHER.length)];
        const stormChance = sol <= 5 ? 0.20 : sol <= 10 ? 0.35 : sol <= 15 ? 0.50 : 0.60;
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
        };
      }

      return { fetchNextCuriosityPhoto, generateDailyMarsEnvironment };
    })();

    // =========================================================================
