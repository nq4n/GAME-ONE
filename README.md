# 🚀 ECHOES OF SPACE: THE LAST SIGNAL
### أصداء الفضاء: الإشارة الأخيرة
> **NASA Space Apps Challenge 2026**  
> *Challenge: "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars"*

[![NASA Space Apps](https://img.shields.io/badge/NASA%20Space%20Apps-Challenge%202026-blue?style=for-the-badge&logo=nasa)](https://www.spaceappschallenge.org/2026/challenges/abandoned-but-not-forgotten-storytelling-about-nasas-discarded-equipment-on-the-moon-and-mars/)
[![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-success?style=for-the-badge&logo=github)](https://pages.github.com/)
[![WebGL 3D](https://img.shields.io/badge/Renderer-WebGL%203D-cyan?style=for-the-badge&logo=webgl)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
[![Bilingual](https://img.shields.io/badge/Language-English%20%7C%20%D8%A7%D9%84%D8%B9%D8%B1%D8%A8%D9%8A%D8%A9-gold?style=for-the-badge)](#bilingual-experience)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 🌌 Project Overview | نظرة عامة

Across the Moon and Mars, dozens of historic spacecraft remain exactly where their operational lives ended. To an untrained observer, they may seem like quiet metal husks—yet every single component holds an enduring legacy that transformed humanity's understanding of our solar system.

**ECHOES OF SPACE: THE LAST SIGNAL** turns historic space equipment left on alien surfaces into an **interactive 3D WebGL simulator, educational narrative adventure, and hands-on STEM physics laboratory**. 

* **Live Demo:** `https://<your-username>.github.io/<your-repo-name>/`
* **Direct 3D Game Link:** `https://<your-username>.github.io/<your-repo-name>/game.html`

---

## 🎮 Key Features & Playable Modules

### 1. ☾ Apollo 15 Lunar Rover 3D Simulator (Genesis II)
* **Real-time 3D lunar surface rendering:** Procedural Hadley-Apennine terrain, craters, boulders, and distant Earth in the cosmos.
* **Manned surface exploration:** Control the astronaut to recover 3 primary scientific evidence signals (Mobility Powertrain, Drilling Tools, Geological Context) plus the hidden Genesis Rock cache.
* **Traverse configuration:** Choose between 3 routes:
  * **Route A (Safe Traverse):** 1.3 km of smooth regolith.
  * **Route B (Apennine Ridge):** 0.9 km shortcut through steep, rocky terrain.
  * **Route C (Rille Overlook):** 1.6 km science detour for maximum field observations.
* **3D Rover Driving Physics:** Independent 4-wheel drive, speed telemetry, odometer, terrain collisions, recovery mechanism (`R`), and audio synthesis.
* **Scientific Reconstruction:** Reconnect the archival data and prove how vehicular mobility expanded Apollo 15 field science from hundreds of meters to dozens of kilometers.

### 2. ♂ Opportunity Mars Rover 4-Sol Survival Simulator (PZ10–PZ14)
* **Resource management:** Allocate daily watt-hours between Wheel Mobility, Alpha Particle X-Ray Spectrometer (APXS), Rock Abrasion Tool (RAT), Survival Thermal Heaters, and Deep Space Radio Communications.
* **Atmospheric Dust Simulation:** Survive escalating dust levels ($\tau$) during the historic June 2018 planet-encircling storm.
* **Telemetry Decryption:** Input the correct Deep Space Network transmission frequency to decrypt Opportunity's final historic transmission: *"My battery is low and it's getting dark"*.

### 3. 🏛️ Interactive 3D Equipment Museum
* **Orbit Controls:** 360° mouse/touch rotation, zoom, and wireframe inspection mode.
* **Featured 3D Exhibits:**
  * **Apollo 15 Lunar Roving Vehicle (LRV-1)** — 1971, Hadley–Apennine.
  * **Opportunity Rover (MER-B)** — 2004–2018, Meridiani Planum.
  * **InSight Mars Lander (SEIS)** — 2018–2022, Elysium Planitia.
* **Detailed Technical Specs:** Mass, dimensions, top speed, power system, scientific payload, what we learned, and direct links to official NASA archives.

### 4. 🔬 STEM Mobility Physics Lab (SIM01–SIM04)
* **Mathematical Model:** Implements real mission planning trade-off equations ($t = d / v$).
* **Interactive Sliders:** Adjust Route Distance (300m–3000m), Rover Speed (4–15 km/h), Total EVA Time Budget (60–240 min), and Observation Duration per stop.
* **Real-time Comparison:** Immediate calculation comparing walking astronaut vs. rover transport, net time gained, and feasible geological sampling stops.

### 5. 📖 Stories from Space & Web Speech Audio Narration
* *"The Silent Guardian of Hadley Rille"* (The Apollo 15 LRV story).
* *"The Last Sunset of Perseverance Valley"* (Opportunity's 15-year epic).
* Built-in text-to-speech audio narration with bilingual voice synthesis.

### 6. 🧠 STEM Knowledge Quizzes & XP Progression
* Multiple-choice questions verified with official NASA mission facts.
* Instant scientific explanations, XP rewards, and explorer rank progression (Cadet → Surveyor → Specialist → Archive Commander).

### 7. 📜 43-Sheet Master Game Bible Explorer
* Direct interactive browser for the complete competition document (`ECHOES_OF_SPACE_MASTER_GAME_BIBLE_2026.xlsx`):
  * **35 Puzzles Catalog** (PZ01 to PZ35).
  * **24 Verified Scientific Claims** (CL01 to CL24).
  * **Judges Q&A** with recommended answers and evidence citations.
  * **35 Reference Games Analysis** and NASA sources (S01–S37).

---

## 🕹️ Game Controls

| Key / Action | Function |
| :--- | :--- |
| **W / Up Arrow** | Move forward / Accelerate Rover |
| **S / Down Arrow** | Move backward / Brake Rover |
| **A / D (Left / Right)** | Steer Rover or turn astronaut |
| **E** | Scan evidence beacons / Inspect rover / Interact with research beacon |
| **R** | Recover rover if stuck on boulders |
| **Mouse Drag / Touch** | Rotate third-person orbital camera 360° |
| **Escape** | Pause simulation |
| **On-screen buttons** | Touch-friendly controls for mobile devices |

---

## 🚀 How to Deploy on GitHub Pages (Step-by-Step)

This repository is **100% prepared and optimized for zero-config GitHub Pages deployment**! All scripts and assets use relative paths.

### Method 1: Using GitHub Actions (Automated — Recommended)

1. **Initialize and Push to your GitHub repo:**
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit for NASA Space Apps 2026 platform"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages via Actions:**
   * Go to your repository on GitHub.
   * Click **Settings** ⚙️.
   * In the left sidebar, click **Pages**.
   * Under **Build and deployment** > **Source**, choose **GitHub Actions**.
   * The included `.github/workflows/deploy.yml` workflow will automatically run, build, and publish your site!

---

### Method 2: Deploy from Branch (Standard GitHub Pages)

1. In your GitHub repository, go to **Settings** ⚙️ -> **Pages**.
2. Under **Build and deployment** > **Source**, select **Deploy from a branch**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Within 1–2 minutes, your website will be live at:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

---

## 💻 Running Locally

### Option A: Open directly in your browser (No installation required)
Simply double-click [`index.html`](index.html) or [`game.html`](game.html). Everything is completely self-contained and runs immediately offline.

### Option B: Run via Node.js Server (Full-Stack Mode)
```bash
# Start the local server
node server.js
```
Then navigate to `http://localhost:3000` in your browser.

---

## 📁 Repository Structure

```
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions automated Pages deployment
├── assets/
│   └── hero-rover.jpg        # High-resolution cinematic render of Apollo LRV
├── css/
│   └── style.css             # Glassmorphism, cosmic animations & RTL styling
├── data/
│   ├── db.json               # Missions, exhibits, quizzes, leaderboard database
│   └── master_bible.json     # Extracted 43-sheet Master Game Bible dataset
├── js/
│   ├── app.js                # Master coordinator, i18n, quiz logic, physics lab
│   ├── webgl_game.js         # Procedural 3D WebGL simulator engine
│   ├── mars_sim.js           # Mars Opportunity 4-Sol resource & dust simulator
│   ├── museum_3d.js          # Interactive 3D Equipment Museum viewer
│   └── evidence_graph.js     # Archive knowledge graph canvas (PZ15)
├── echoes_space_v2/
│   └── index.html            # Standalone WebGL game vertical slice
├── echoes_of_space_prototype.html    # Arabic prototype page
├── echoes_of_space_prototype_en.html # English prototype page
├── game.html                 # Standalone full-screen 3D game
├── index.html                # Master portal & platform
├── package.json              # Project metadata & npm scripts
├── server.js                 # Optional Node.js REST API server
└── README.md                 # Project documentation
```

---

## 📚 Scientific Sources & Verification

All educational claims, vehicle parameters, and historical facts in this project are verified against official NASA mission documentation:
1. **NASA Apollo 15 Mission Overview & LRV Specifications:** [https://www.nasa.gov/mission/apollo-15/](https://www.nasa.gov/mission/apollo-15/)
2. **NASA Mars Exploration Rover (Opportunity MER-B) Archive:** [https://mars.nasa.gov/mer/](https://mars.nasa.gov/mer/)
3. **NASA InSight Lander Geophysics & SEIS Mission:** [https://mars.nasa.gov/insight/](https://mars.nasa.gov/insight/)
4. **NASA Lunar Roving Vehicle Operations Handbook (LRV-1):** Marshall Space Flight Center records.

---

## ⚖️ NASA Space Apps Challenge Notice

*This is an independent educational submission developed for the NASA Space Apps Challenge 2026. This project is not affiliated with, funded, or endorsed by NASA.*
