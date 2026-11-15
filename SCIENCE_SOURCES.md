# LITTLE MARSONAUT — NASA & CSA Science Sources & Integration Reference
**Project Submission Reference | NASA Space Apps Challenge 2026**

---

## 1. Overview of NASA & CSA Resources / 官方資源整合總覽

This document provides a rigorous, transparent account of the NASA and CSA resources, APIs, and educational materials integrated into **LITTLE MARSONAUT**.

To maintain scientific integrity for the NASA Space Apps Challenge 2026, this document clearly distinguishes between:
1. **Live NASA Open APIs** actively queried at runtime.
2. **Verified Static Educational Content** derived from official NASA/CSA mission archives.
3. **Gameplay Simulations** (e.g. simulated surface weather and base radiation levels inspired by space science principles).

---

## 2. Resource Matrix / 官方資源使用明細表

| Resource Name (官方名稱) | Official URL (官方網址) | Integration Type (整合方式) | Live API? (真實 API) | Static Fact? (本地科普) | Corresponding Game Feature (對應遊戲功能) |
|---|---|---|:---:|:---:|---|
| **NASA Image and Video Library API** | `https://images-api.nasa.gov/search` | Dynamic Query via HTTP GET | **Yes** | Fallback only | **Rover Exploration Photos**: Automatically queries real Curiosity Mastcam photos taken in Gale Crater. |
| **NASA DONKI SEP API** | `https://api.nasa.gov/DONKI/SEP` | Dynamic Query via HTTP GET | **Yes** | No | **Space Weather Monitoring**: Retrieves real-time solar energetic particle events from NASA Goddard Space Weather Research Center. |
| **NASA Mars Trek** | `https://trek.nasa.gov/mars/` | Static Educational Attribution | No | **Yes** | **Mars & Geology Facts**: Olympus Mons, Valles Marineris topography and surface features. |
| **NASA DONKI Web Portal** | `https://ccmc.gsfc.nasa.gov/tools/DONKI/` | Educational Reference | No | **Yes** | **Solar Storms & Space Weather Facts**: Coronal mass ejections and solar flare early-warning science. |
| **CSA Space Food Production Toolkit** | `https://www.asc-csa.gc.ca/eng/youth-educators/toolkits/food-production/` | Educational Attribution | No | **Yes** | **Space Farming & Food Facts**: Deep-space food production, water efficiency, and lunar/Martian agricultural technologies. |
| **NASA Open Science Data Repository (OSDR)** | `https://osdr.nasa.gov/` | Educational Reference | No | **Yes** | **Astronauts & Space Science Facts**: Space biology data and astronaut radiation mitigation vests (AstroRad). |
| **NASA Human Research Program (HRP)** | `https://www.nasa.gov/hrp/` | Educational Reference | No | **Yes** | **Astronauts & Space Science Facts**: Microgravity bone/muscle conditioning and cephalad fluid shifts ("puffy face"). |
| **NASA Space Station Research Explorer (Veggie & APH)** | `https://www.nasa.gov/mission/station/` | Educational Reference | No | **Yes** | **Space Farming & Food Facts**: Dwarf tomato cultivation (VEG-05) and Hatch green chile pepper experiments. |
| **NASA MOXIE Instrument (Mars 2020)** | `https://mars.nasa.gov/technology/moxie/` | Educational Reference | No | **Yes** | **Power Lab Science Guide**: In-situ oxygen generation via solid oxide electrolysis from atmospheric CO₂. |
| **NASA Mars Subsurface Water Ice Mapping (SWIM)** | `https://swim.psi.edu/` & `https://images.nasa.gov/details/PIA26045` | Educational Photo & Guide | No | **Yes** | **Water Extraction Science Guide**: Detection and mapping of subsurface water ice in mid-latitude Martian terrain. |
| **NASA Mars Reconnaissance Orbiter (MRO)** | `https://science.nasa.gov/mission/mars-reconnaissance-orbiter/` | Educational Reference | No | **Yes** | **Dust Storm Science Guide**: Planet-encircling dust storms and atmospheric opacity observations. |
| **NASA Mars Helicopter Ingenuity** | `https://mars.nasa.gov/technology/helicopter/` | Educational Reference | No | **Yes** | **Rovers & Exploration Facts**: Aerodynamic rotorcraft flight in the thin (1% Earth density) Martian atmosphere. |

---

## 3. Real Live APIs vs. Simulated Data / 真實 API 與遊戲模擬資料區隔

### 3.1 Live NASA APIs Actively Used
1. **NASA Image and Video Library API** (`https://images-api.nasa.gov/search`):
   - **Query**: Mastcam photographs of Gale Crater filtered by `"curiosity"` and exclusion of concept art.
   - **Error Handling**: Equipped with a 6-second timeout (`AbortController`). If the API connection fails, it falls back to a verified official NASA image (`PIA16764`) with accurate attribution, avoiding any broken UI states.
2. **NASA DONKI SEP API** (`https://api.nasa.gov/DONKI/SEP`):
   - **Query**: Solar Energetic Particle events across the preceding 60 days.
   - **Error Handling**: Handles 200 OK, 429 rate limits, and network errors. Crucially, an empty array (`[]`) is correctly interpreted as **"Query successful; no energetic particle events occurred during this observation window"**, rather than as an API failure.

### 3.2 Simulated Mars Conditions (遊戲模擬資料說明)
- **Temperature, Wind Speed, and Atmospheric Pressure**:
  - Mars surface temperatures (e.g., -15°C to -75°C) and average wind speeds (e.g., 4.1 to 13.7 m/s during dust storms) are based on historical ranges from NASA Viking, Curiosity, and InSight records, but specific daily fluctuations are simulated for interactive gameplay.
- **Surface Radiation Level**:
  - In *LITTLE MARSONAUT*, space radiation risks are modulated based on real DONKI solar storm activity combined with game Sol progression. 
  - **Scientific Clarification**: DONKI SEP event counts are orbital/heliospheric observations and are not equivalent to measured ground-level radiation doses on the Martian surface (which are moderated by the Martian atmosphere and terrain). The in-game HUD explicitly displays:
    > *"SIMULATED MARS CONDITIONS: Mars conditions are simulated for gameplay. Space weather is inspired by NASA data."*

### 3.3 Unused / Proposed Future APIs (尚未實際整合但可供未來擴充之 API)
- **NASA Mars Trek API**: Currently referenced for static geographical facts (Olympus Mons, Valles Marineris); direct interactive 3D tile streaming is not integrated to maintain fast client-side performance for elementary school devices.
- **NASA OSDR REST API**: Currently referenced for static space biology facts; raw genomics and transcriptomics API queries are planned for advanced educational extensions.

---

## 4. NASA Image Audit & Corrections / 本次 NASA 圖片修正明細

The table below documents all NASA Image IDs audited, verified, and updated to ensure complete correspondence between visual assets and scientific text:

| NASA Image ID | Previous Status / Issue (修正前狀況) | Correction Applied (本次修正) | Accurate Subject & Description (官方正確影像內容) | Verified Asset URL |
|---|---|---|---|---|
| **PIA25286** | Replaced non-existent `PIA24836` in `SOLAR_POWER` guide | **Replaced** | **InSight's Dusty Solar Panel**: Captured by InSight on Sol 1,211 (April 24, 2022) showing dense red dust layer on solar arrays. | `https://images-assets.nasa.gov/image/PIA25286/PIA25286~orig.jpg` |
| **PIA26045** | Replaced `PIA23516` (which showed a rover comparison diagram instead of an ice map) in `LOCAL_WATER` guide | **Replaced** | **SWIM Subsurface Water Ice Map**: Composite map based on NASA orbiter data showing regions of shallow buried ice across Mars. | `https://images-assets.nasa.gov/image/PIA26045/PIA26045~medium.jpg` |
| **PIA24203** | Replaced `PIA24533` (which was an Earth sea level satellite map) in `OXYGEN_ELECTROLYSIS` guide | **Replaced** | **MOXIE All Tucked In**: Golden MOXIE solid oxide electrolysis instrument installed inside the chassis of the Perseverance rover. | `https://images-assets.nasa.gov/image/PIA24203/PIA24203~medium.jpg` |
| **PIA24261** | Replaced misplaced `PIA24203` in `astro_mars_spacesuit` science fact | **Replaced** | **SHERLOC Calibration Target with Spacesuit Fabric**: Perseverance rover calibration target carrying spacesuit material samples to monitor degradation under Mars UV and dust. | `https://images-assets.nasa.gov/image/PIA24261/PIA24261~medium.jpg` |
| **PIA16764** | Previously labeled as generic "Mars rocks and sand dunes" in fallback | **Caption Updated** | **Curiosity Self-Portrait at John Klein Drill Site**: Official self-portrait stitched from MAHLI exposures at the first Martian rock drilling site. | `https://images-assets.nasa.gov/image/PIA16764/PIA16764~medium.jpg` |

### Image Fallback Redundancy Fix
In prior builds, a broken image link would automatically substitute an unrelated Curiosity selfie (`PIA19920`) while leaving the original fact's title, caption, and credit unchanged.
- **Fixed**: Both `RandomScienceFactModal` and `ScienceExplanationModal` now render a dedicated, clean SVG placeholder with the clear notification `Image unavailable`. When an image cannot be loaded, mismatched photo captions and credits are suppressed, preventing any false attribution or confusion.

---

## 5. Audit of 25 Science Facts / 25 則科普事實校對

All 25 facts in `src/data/scienceFactsDatabase.js` were comprehensively audited for child-friendly phrasing (ages 7–12), factual accuracy, and live URL availability:

1. **Space Tomatoes (`farm_veggie_tomatoes` / VEG-05)**:
   - *Previous*: Claimed tomatoes were harvested as fresh snacks for the crew.
   - *Updated*: Accurately notes that dwarf 'Red Robin' tomatoes were grown on the International Space Station to study crop yield, safety, and nutritional viability for future Mars crews.
2. **Mars Sample Return (`rov_sample_tubes`)**:
   - *Previous*: Overly definitive claim that "Future space missions will bring these rocks home to Earth!"
   - *Updated*: Adopted cautious, scientifically accurate language: *"Scientists hope to bring these Mars samples to Earth in the future!"*
3. **Broken URLs Repaired**:
   - `rov_ingenuity_helicopter`: Updated from 404 URL to official NASA rotorcraft hub: `https://mars.nasa.gov/technology/helicopter/`
   - `sol_dust_storm_dimming`: Updated from 404 URL to official MRO mission hub: `https://science.nasa.gov/mission/mars-reconnaissance-orbiter/`
   - `farm_water_recycling`: Updated from 404 URL to NASA Space Station Research Explorer ECLSS facility: `https://www.nasa.gov/mission/station/research-explorer/facility/?#id=343`

---

*This document was generated in compliance with NASA Space Apps Challenge 2026 scientific accuracy guidelines.*
