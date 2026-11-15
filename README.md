# LITTLE MARSONAUT — NASA Space Apps Challenge 2026

> A retro-warm hand-drawn Mars survival & exploration web simulator for young astronauts (ages 7–12), integrating authentic NASA planetary science, live space weather APIs, and real rover exploration data.

---

## 🌟 Project Highlights

- **NASA Space Weather & Image Integration**: Live integration with the NASA DONKI Solar Energetic Particle (SEP) API and the NASA Image and Video Library API with automatic fallbacks and offline resilience.
- **Scientific Accuracy & Transparency**: Clear distinction between live NASA space weather data and simulated Martian gameplay parameters (see [SCIENCE_SOURCES.md](./SCIENCE_SOURCES.md)).
- **Self-Sustaining Life Support Loop**: Manage Air (O₂), Power (⚡), Water (💧), and Food (🍅) through authentic scientific processes:
  - **Power Lab**: Solar collection with InSight-inspired dust accumulation; water electrolysis for breathable oxygen; subsurface ice extraction.
  - **Tomato Greenhouse**: Realistic 90-second tomato growth cycle with grow lamp boost and a 70-second unharvested rot timer.
  - **Rover Bay (Curiosity Jr.)**: Dispatch expeditions with custom battery power (10 ⚡ / 70s, 20 ⚡ / 100s, 30 ⚡ / 130s) to discover real Martian mineral specimens and ancient biosignature clues.
- **Verified NASA/CSA Science Facts**: 25 curated, child-friendly scientific fact cards verified against official NASA missions (Curiosity, Perseverance, InSight, MRO, Veggie-05).

---

## 🗂️ Project Structure

```text
mars-crew/
├── index.html                    # Main entry point (loads modular scripts via Babel)
├── game.html                     # Alternate entry point for local testing & preview
├── README.md                     # Project overview and instructions
├── SCIENCE_SOURCES.md            # NASA science documentation & API compliance guide
├── docs/
│   └── TEAM_CHANGELOG.md         # Team collaboration changelog & patch history
└── src/
    ├── App.jsx                   # Main React controller, Sol game loop (1 Sol = 100s)
    ├── constants.js              # Game constants, rock catalog, rover dispatch modes
    ├── styles.css                # Retro-warm hand-drawn UI styling & keyframe animations
    ├── components/
    │   ├── SharedUI.jsx          # Reusable UI cards, buttons, resource pills
    │   ├── TitleCoverPage.jsx    # Mission launch cover screen & guide
    │   └── MarsLaunchTransition.jsx # Earth-to-Mars flight animation with science facts
    ├── data/
    │   └── scienceFactsDatabase.js # 25 audited NASA/CSA scientific educational facts
    ├── logic/
    │   ├── gameLogic.js          # Core math, consumption formulas, hazard checks
    │   └── palette.js            # Dynamic Martian diurnal sky & lighting interpolator
    ├── modals/
    │   ├── MorningBriefingModal.jsx # Daily simulated Mars conditions & weather report
    │   ├── ScienceExplanationModal.jsx # Topic deep-dives (MOXIE, Solar, Water Ice)
    │   ├── SolarMiniGameModal.jsx  # Interactive solar beam collection mini-game
    │   ├── RandomScienceFactModal.jsx # Random educational fact card with official links
    │   └── EndGameModal.jsx      # Mission debriefing & unlocked badges settlement
    ├── scenes/
    │   ├── BaseExteriorScene.jsx # Exterior base overview, supply rocket, building access
    │   ├── PowerRoomScene.jsx    # Solar observation window, O₂ electrolysis & ice well
    │   ├── GreenhouseRoomScene.jsx # 4 tomato planter beds, watering can & grow lamps
    │   ├── RoverRoomScene.jsx    # Curiosity Jr. dispatch slider & findings review
    │   └── MissionControlScene.jsx # Rock specimen vault & real NASA Curiosity photos
    └── services/
        └── nasaService.js        # NASA DONKI SEP API & Image Library API service
```

---

## 🚀 How to Run Locally

Because the modular frontend loads scripts using `<script type="text/babel" src="...">`, run a local static file server to avoid browser CORS restrictions on `file://`:

```bash
# Using Python (standard macOS / Linux / Windows)
python3 -m http.server 5173

# Or using Node.js / npx
npx serve .
```

Open your browser at `http://127.0.0.1:5173/` or `http://localhost:5173/`.

---

## 📜 Scientific References

For detailed mapping of all 25 scientific fact cards, official NASA Photo IDs (`PIA25286`, `PIA26045`, `PIA24203`, etc.), and API endpoint documentation, refer to [SCIENCE_SOURCES.md](./SCIENCE_SOURCES.md).
