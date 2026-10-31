# ECHOES OF SPACE — THE LAST SIGNAL
## Genesis II — Playable WebGL Prototype

### Launch
Open `index.html` in Chrome, Edge, Firefox, or another browser with WebGL enabled. No installation, game engine, or server is required. The 3D renderer and game logic are embedded in one HTML file and do not depend on external game libraries.

### Controls
- **W / Up:** Move forward or accelerate.
- **S / Down:** Move backward or brake.
- **A / D:** Turn.
- **E:** Scan evidence or interact with the rover / research beacon.
- **R:** Recover rover during a traverse.
- **Mouse drag:** Rotate third-person camera.
- **Escape:** Pause.
- Touch controls appear on touch devices.

### Playable flow
ORIGIN hub → Apollo 15 lunar investigation → collect three scientific evidence signals → inspect rover → choose one of three fictional traverse routes → drive to research beacon → interactive travel-time experiment → evidence-based scientific conclusion → restored archive / museum.

### What is real vs simulated
- Apollo 15 and the Lunar Roving Vehicle are historical.
- ORIGIN, ECHO, signal beacons, the playable routes, and player activities are fictional educational reconstructions.
- The travel-time experiment uses illustrative values and a simplified equation; it is not a reconstruction of historical Apollo 15 mission measurements.
- Reference: https://www.nasa.gov/mission/apollo-15/
- This is an independent educational prototype and does not imply NASA endorsement.

### Implementation
Self-contained HTML/CSS/JavaScript; raw WebGL with procedural meshes, simplified 3D rover and terrain, bilingual interface, localStorage progress, basic sound synthesis.

### Known limitations
This is an **alpha prototype**, not an AAA game or competition-ready release. Models are stylized, collision handling is simplified, and the Mars missions are intentionally not implemented. No comprehensive browser, device, accessibility, performance, scientific, or child-user acceptance testing has been completed. Real playtesting and content review are necessary before submitting to a competition.
