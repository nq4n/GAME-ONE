// WebGL 3D Lunar Rover Simulation for Apollo 15 Mission
// Embedded self-contained renderer with zero external dependencies
window.Apollo15Game = (function() {
  let canvas, gl;
  let running = false;
  let initialized = false;
  let currentPhase = 'investigate'; // investigate -> route -> drive -> lab -> reconstruct -> complete
  let selectedRoute = 'safe';
  let evidenceFound = [];
  let driveProgress = 0;
  let roverHealth = 100;
  let keys = {};
  let player = { x: 0, z: 11, a: Math.PI, v: 0 };
  let camYaw = 0, camPitch = 0.35, isDragging = false, lastMouseX = 0, lastMouseY = 0;
  let elapsed = 0;
  let audioCtx = null;
  
  // Routes specifications
  const ROUTES = {
    safe: { length: 130, rough: 0.65, offset: 0, name_en: 'Route A: Hadley Plains', name_ar: 'المسار أ: سهول هادلي' },
    ridge: { length: 90, rough: 1.7, offset: -18, name_en: 'Route B: Apennine Ridge', name_ar: 'المسار ب: اختصار التلال' },
    science: { length: 160, rough: 1.05, offset: 23, name_en: 'Route C: Rille Overlook', name_ar: 'المسار ج: أخدود هادلي' }
  };

  // 4 Evidence locations on the Moon
  const EVIDENCE_POINTS = [
    { x: -7, z: 1, id: 'C01', title_en: 'Mobility Powertrain', title_ar: 'نظام الحركة والدفع' },
    { x: 8, z: -4, id: 'C02', title_en: 'Scientific Tools', title_ar: 'الأدوات العلمية' },
    { x: -5, z: -13, id: 'C03', title_en: 'Field Science Range', title_ar: 'توسيع النطاق العلمي' },
    { x: 15, z: -19, id: 'C04', title_en: 'Genesis Rock Cache', title_ar: 'حجر سفر التكوين' }
  ];

  // Matrices & Shader variables
  let program, loc = {}, cubeMesh, sphereMesh, terrainMesh;
  let groundObjects = [], starObjects = [];
  let projection, view, camera = [0, 9, 18], fog = [0.105, 0.11, 0.14];

  function mat4() { return new Float32Array(16); }
  function identity() {
    let a = mat4(); a[0] = a[5] = a[10] = a[15] = 1; return a;
  }
  function mul(a, b) {
    let r = mat4();
    for (let c = 0; c < 4; c++) {
      for (let row = 0; row < 4; row++) {
        for (let k = 0; k < 4; k++) r[c * 4 + row] += a[k * 4 + row] * b[c * 4 + k];
      }
    }
    return r;
  }
  function translate(x, y, z) {
    let m = identity(); m[12] = x; m[13] = y; m[14] = z; return m;
  }
  function scale(x, y, z) {
    let m = identity(); m[0] = x; m[5] = y; m[10] = z; return m;
  }
  function rotY(a) {
    let m = identity(), c = Math.cos(a), s = Math.sin(a);
    m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m;
  }
  function perspective(fovy, aspect, near, far) {
    let f = 1 / Math.tan(fovy / 2), r = mat4();
    r[0] = f / aspect; r[5] = f; r[10] = (far + near) / (near - far);
    r[11] = -1; r[14] = 2 * far * near / (near - far); return r;
  }
  function sub(a, b) { return a.map((v, i) => v - b[i]); }
  function dot(a, b) { return a.reduce((s, v, i) => s + v * b[i], 0); }
  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function norm(a) {
    let l = Math.hypot(...a) || 1; return a.map(v => v / l);
  }
  function lookAt(eye, target) {
    let z = norm(sub(eye, target)), x = norm(cross([0, 1, 0], z)), y = cross(z, x), m = identity();
    m[0] = x[0]; m[1] = y[0]; m[2] = z[0];
    m[4] = x[1]; m[5] = y[1]; m[6] = z[1];
    m[8] = x[2]; m[9] = y[2]; m[10] = z[2];
    m[12] = -dot(x, eye); m[13] = -dot(y, eye); m[14] = -dot(z, eye);
    return m;
  }

  function compileShader(type, source) {
    let sh = gl.createShader(type);
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(sh));
      return null;
    }
    return sh;
  }

  function createMesh(pos, normals, indices) {
    let v = gl.createBuffer(), n = gl.createBuffer(), i = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, v);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, n);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, i);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    return { v, n, i, count: indices.length };
  }

  function makeCube() {
    let p = [], n = [], ind = [];
    let faces = [
      [[0, 0, 1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]],
      [[0, 0, -1], [1, -1, -1], [-1, -1, -1], [-1, 1, -1], [1, 1, -1]],
      [[1, 0, 0], [1, -1, 1], [1, -1, -1], [1, 1, -1], [1, 1, 1]],
      [[-1, 0, 0], [-1, -1, -1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]],
      [[0, 1, 0], [-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]],
      [[0, -1, 0], [-1, -1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1]]
    ];
    faces.forEach((f, j) => {
      for (let k = 1; k <= 4; k++) { p.push(...f[k]); n.push(...f[0]); }
      ind.push(j * 4, j * 4 + 1, j * 4 + 2, j * 4, j * 4 + 2, j * 4 + 3);
    });
    return createMesh(p, n, ind);
  }

  function makeSphere() {
    let p = [], n = [], idx = [], lat = 12, lon = 18;
    for (let j = 0; j <= lat; j++) {
      let v = j / lat * Math.PI;
      for (let i = 0; i <= lon; i++) {
        let u = i / lon * Math.PI * 2;
        let x = Math.sin(v) * Math.cos(u), y = Math.cos(v), z = Math.sin(v) * Math.sin(u);
        p.push(x, y, z); n.push(x, y, z);
      }
    }
    for (let j = 0; j < lat; j++) {
      for (let i = 0; i < lon; i++) {
        let a = j * (lon + 1) + i, b = a + lon + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    return createMesh(p, n, idx);
  }

  function height(x, z) {
    return 0.26 * Math.sin(x * 0.17) * Math.cos(z * 0.12) +
           0.18 * Math.sin(x * 0.48 + z * 0.29) +
           0.10 * Math.cos(z * 0.54);
  }

  function makeTerrain() {
    let p = [], n = [], idx = [], size = 420, steps = 80;
    for (let j = 0; j <= steps; j++) {
      for (let i = 0; i <= steps; i++) {
        let x = (i / steps - 0.5) * size, z = (j / steps - 0.5) * size, y = height(x, z);
        p.push(x, y, z);
        let dx = height(x + 0.1, z) - height(x - 0.1, z);
        let dz = height(x, z + 0.1) - height(x, z - 0.1);
        n.push(...norm([-dx, 1, -dz]));
      }
    }
    for (let j = 0; j < steps; j++) {
      for (let i = 0; i < steps; i++) {
        let a = j * (steps + 1) + i, b = a + steps + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    return createMesh(p, n, idx);
  }

  function rng(seed) {
    let x = Math.sin(seed * 127.1 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function initGL() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) return false;
    gl = canvas.getContext('webgl', { antialias: true, alpha: false });
    if (!gl) return false;

    const vs = `
      attribute vec3 aPos;
      attribute vec3 aNormal;
      uniform mat4 uMVP;
      uniform mat4 uModel;
      varying vec3 vNormal;
      varying vec3 vWorld;
      void main(){
        vec4 w = uModel * vec4(aPos, 1.0);
        vWorld = w.xyz;
        vNormal = mat3(uModel) * aNormal;
        gl_Position = uMVP * vec4(aPos, 1.0);
      }
    `;
    const fs = `
      precision mediump float;
      varying vec3 vNormal;
      varying vec3 vWorld;
      uniform vec3 uColor;
      uniform vec3 uFog;
      uniform vec3 uCamera;
      uniform float uEmissive;
      uniform float uTerrain;
      void main(){
        vec3 N = normalize(vNormal);
        float diff = max(dot(N, normalize(vec3(-0.55, 0.85, 0.35))), 0.0);
        float light = 0.32 + diff * 0.75;
        vec3 col = uColor * light;
        if(uTerrain > 0.5){
          float speck = fract(sin(dot(vWorld.xz, vec2(12.9898, 78.233))) * 43758.5453);
          col *= 0.88 + speck * 0.16;
        }
        col += uColor * uEmissive;
        float d = distance(vWorld, uCamera);
        float fog = clamp((d - 35.0) / 140.0, 0.0, 0.85);
        gl_FragColor = vec4(mix(col, uFog, fog), 1.0);
      }
    `;

    program = gl.createProgram();
    gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);

    ['aPos', 'aNormal'].forEach(k => loc[k] = gl.getAttribLocation(program, k));
    ['uMVP', 'uModel', 'uColor', 'uFog', 'uCamera', 'uEmissive', 'uTerrain'].forEach(k => loc[k] = gl.getUniformLocation(program, k));

    cubeMesh = makeCube();
    sphereMesh = makeSphere();
    terrainMesh = makeTerrain();

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    // Populate rocks and stars
    groundObjects = [];
    for (let i = 0; i < 160; i++) {
      let x = (rng(i + 30) - 0.5) * 220, z = (rng(i + 600) - 0.5) * 220;
      if (Math.abs(x) < 8 && z > -20 && z < 20) continue;
      groundObjects.push({ x, z, size: 0.2 + rng(i + 100) * 1.3, angle: rng(i + 800) * 6.28 });
    }
    starObjects = [];
    for (let i = 0; i < 80; i++) {
      starObjects.push({
        x: (rng(i + 330) - 0.5) * 160,
        y: 35 + rng(i + 500) * 70,
        z: (rng(i + 200) - 0.5) * 160,
        r: 0.03 + rng(i + 800) * 0.06
      });
    }

    setupInput();
    initialized = true;
    return true;
  }

  function drawMesh(meshData, model, color, emissive = 0, isTerrain = 0) {
    gl.bindBuffer(gl.ARRAY_BUFFER, meshData.v);
    gl.enableVertexAttribArray(loc.aPos);
    gl.vertexAttribPointer(loc.aPos, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, meshData.n);
    gl.enableVertexAttribArray(loc.aNormal);
    gl.vertexAttribPointer(loc.aNormal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshData.i);
    gl.uniformMatrix4fv(loc.uModel, false, model);
    gl.uniformMatrix4fv(loc.uMVP, false, mul(mul(projection, view), model));
    gl.uniform3fv(loc.uColor, color);
    gl.uniform3fv(loc.uFog, fog);
    gl.uniform3fv(loc.uCamera, camera);
    gl.uniform1f(loc.uEmissive, emissive);
    gl.uniform1f(loc.uTerrain, isTerrain);
    gl.drawElements(gl.TRIANGLES, meshData.count, gl.UNSIGNED_SHORT, 0);
  }

  function box(x, y, z, sx, sy, sz, color, em = 0) {
    drawMesh(cubeMesh, mul(translate(x, y, z), scale(sx, sy, sz)), color, em);
  }
  function orb(x, y, z, r, color, em = 0) {
    drawMesh(sphereMesh, mul(translate(x, y, z), scale(r, r, r)), color, em);
  }
  function groupBox(parent, x, y, z, sx, sy, sz, color, em = 0) {
    drawMesh(cubeMesh, mul(parent, mul(translate(x, y, z), scale(sx, sy, sz))), color, em);
  }
  function groupOrb(parent, x, y, z, r, color, em = 0) {
    drawMesh(sphereMesh, mul(parent, mul(translate(x, y, z), scale(r, r, r))), color, em);
  }

  function beacon(x, z, index, active = true) {
    let y = height(x, z), pulse = 1 + Math.sin(elapsed * 3 + index) * 0.15;
    box(x, y + 0.9, z, 0.06, 0.9, 0.06, [0.15, 0.55, 0.65], 0.8);
    orb(x, y + 2, z, 0.35 * pulse, active ? [0.35, 0.92, 1] : [0.4, 0.4, 0.4], active ? 1.4 : 0.05);
    box(x, y + 0.06, z, 0.7, 0.08, 0.7, [0.25, 0.6, 0.7], 0.4);
  }

  function renderRover(x, z, a) {
    let base = mul(translate(x, height(x, z) + 0.8, z), rotY(a));
    // Chassis frame
    groupBox(base, 0, 0, 0, 1.1, 0.16, 1.75, [0.78, 0.7, 0.5]);
    // Seat and control console
    groupBox(base, 0, 0.26, -0.15, 0.82, 0.22, 0.72, [0.22, 0.32, 0.38]);
    groupBox(base, 0, 0.38, 0.68, 0.68, 0.08, 0.5, [0.82, 0.68, 0.4]);
    // Wheels (4 independent hubs)
    for (let s of [-1, 1]) {
      for (let dz of [-0.64, 0, 0.64]) {
        groupBox(base, s * 1.12, -0.44, dz, 0.28, 0.48, 0.36, [0.12, 0.14, 0.18]);
        groupBox(base, s * 0.8, -0.22, dz, 0.46, 0.06, 0.06, [0.65, 0.6, 0.48]);
      }
    }
    // High gain dish antenna & Color TV Camera
    groupBox(base, 0, 0.88, -0.65, 0.04, 0.65, 0.04, [0.8, 0.8, 0.7]);
    groupBox(base, 0.25, 1.18, -0.68, 0.45, 0.24, 0.05, [0.22, 0.55, 0.62], 0.25);
    groupBox(base, -0.42, 0.6, 0.42, 0.16, 0.34, 0.19, [0.76, 0.77, 0.7]);
    groupOrb(base, -0.42, 0.82, 0.42, 0.13, [0.8, 0.94, 0.98], 0.3);
  }

  function renderAstronaut(x, z, a) {
    let base = mul(translate(x, height(x, z) + 0.5, z), rotY(a));
    groupBox(base, 0, 0.1, 0, 0.28, 0.44, 0.22, [0.8, 0.84, 0.8]);
    groupBox(base, 0, 0.16, 0.28, 0.24, 0.3, 0.13, [0.62, 0.68, 0.64]);
    groupOrb(base, 0, 0.7, -0.04, 0.24, [0.9, 0.93, 0.9]);
    groupBox(base, 0, 0.72, -0.22, 0.2, 0.14, 0.07, [0.2, 0.45, 0.55], 0.5);
    for (let s of [-1, 1]) {
      groupBox(base, s * 0.2, -0.32, 0, 0.11, 0.32, 0.13, [0.78, 0.82, 0.79]);
      groupBox(base, s * 0.4, 0.08, 0, 0.1, 0.28, 0.12, [0.85, 0.87, 0.83]);
    }
  }

  function pathX(z) {
    let routeInfo = ROUTES[selectedRoute] || ROUTES.safe;
    let p = Math.max(0, Math.min(1, -z / routeInfo.length));
    return routeInfo.offset * p + Math.sin(p * 6.2) * (selectedRoute === 'ridge' ? 8 : selectedRoute === 'science' ? 6 : 2);
  }

  function playTone(freq = 440) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      let o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, audioCtx.currentTime);
      o.frequency.exponentialRampToValueAtTime(freq * 0.6, audioCtx.currentTime + 0.25);
      g.gain.setValueAtTime(0.04, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.28);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + 0.29);
    } catch (e) {}
  }

  function setupInput() {
    window.addEventListener('keydown', e => {
      keys[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e') handleInteract();
      if (e.key.toLowerCase() === 'r') handleRecover();
    });
    window.addEventListener('keyup', e => {
      keys[e.key.toLowerCase()] = false;
    });

    canvas.addEventListener('mousedown', e => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      let dx = e.clientX - lastMouseX;
      let dy = e.clientY - lastMouseY;
      camYaw -= dx * 0.007;
      camPitch = Math.max(-0.2, Math.min(1.1, camPitch - dy * 0.007));
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    });

    // Touch support for mobile/tablets
    canvas.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        isDragging = true;
        lastMouseX = e.touches[0].clientX;
        lastMouseY = e.touches[0].clientY;
      }
    });
    window.addEventListener('touchend', () => isDragging = false);
    window.addEventListener('touchmove', e => {
      if (!isDragging || e.touches.length !== 1) return;
      let dx = e.touches[0].clientX - lastMouseX;
      let dy = e.touches[0].clientY - lastMouseY;
      camYaw -= dx * 0.008;
      camPitch = Math.max(-0.2, Math.min(1.1, camPitch - dy * 0.008));
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    });
  }

  function handleInteract() {
    if (currentPhase === 'investigate') {
      let target = getInteractTarget();
      if (!target) return;
      if (target.type === 'evidence') {
        if (!evidenceFound.includes(target.id)) {
          evidenceFound.push(target.id);
          playTone(520 + evidenceFound.length * 90);
          updateHUD();
          if (evidenceFound.length >= 3) {
            showToast(window.i18n ? window.i18n.t('allEvidenceFound') : 'All primary signals recovered! Approach the rover to begin traverse.');
          }
        }
      } else if (target.type === 'rover') {
        if (evidenceFound.length < 3) {
          showToast(window.i18n ? window.i18n.t('needMoreEvidence') : 'Recover at least 3 evidence signals first!');
          return;
        }
        openRouteSelection();
      }
    } else if (currentPhase === 'drive') {
      let routeInfo = ROUTES[selectedRoute];
      let endDist = Math.hypot(player.x - pathX(-routeInfo.length), player.z + routeInfo.length);
      if (endDist < 8) {
        completeDrive();
      }
    }
  }

  function handleRecover() {
    if (currentPhase !== 'drive') return;
    player.x = pathX(Math.min(0, player.z));
    player.v = 0;
    roverHealth = Math.min(100, roverHealth + 20);
    showToast(window.i18n ? window.i18n.t('roverRecovered') : 'Rover repositioned on safe path.');
    updateHUD();
  }

  function getInteractTarget() {
    for (let pt of EVIDENCE_POINTS) {
      if (!evidenceFound.includes(pt.id)) {
        let d = Math.hypot(player.x - pt.x, player.z - pt.z);
        if (d < 3.8) return { type: 'evidence', id: pt.id, title_en: pt.title_en, title_ar: pt.title_ar };
      }
    }
    let dRover = Math.hypot(player.x, player.z + 5);
    if (dRover < 4.8) return { type: 'rover' };
    return null;
  }

  function openRouteSelection() {
    currentPhase = 'route';
    const modal = document.getElementById('gameCustomOverlay');
    if (!modal) return;
    const isAr = document.documentElement.dir === 'rtl';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="hud-panel" style="max-width: 600px; width: 100%; pointer-events: auto;">
        <h3 style="color: var(--cyan); margin-bottom: 8px;">${isAr ? 'إعداد مسار الرحلة القمرية' : 'APOLLO 15 // TRAVERSE SETUP'}</h3>
        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 20px;">
          ${isAr ? 'اختر مسار الاستكشاف من موقع الهبوط إلى منارة البحث:' : 'Select your traverse route from Falcon landing site to the research beacon:'}
        </p>
        <div style="display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 24px;">
          <button class="btn-secondary route-opt" data-route="safe" style="text-align: left; justify-content: space-between; border-color: var(--cyan);">
            <div><strong>${isAr ? 'المسار أ: سهول هادلي (الآمن)' : 'Route A: Hadley Plains (Safe)'}</strong><br><small style="color: var(--text-muted);">${isAr ? '1.3 كم · أرض ممهدة · توجيه مريح' : '1.3 km · Smooth ground · Easy steering'}</small></div>
            <span style="color: var(--cyan); font-weight: bold;">1.3 KM</span>
          </button>
          <button class="btn-secondary route-opt" data-route="ridge" style="text-align: left; justify-content: space-between;">
            <div><strong>${isAr ? 'المسار ب: اختصار التلال' : 'Route B: Apennine Ridge (Shortcut)'}</strong><br><small style="color: var(--text-muted);">${isAr ? '0.9 كم · تضاريس وعرة · قيادة تتطلب تركيزاً' : '0.9 km · High boulder density · Hard handling'}</small></div>
            <span style="color: var(--gold); font-weight: bold;">0.9 KM</span>
          </button>
          <button class="btn-secondary route-opt" data-route="science" style="text-align: left; justify-content: space-between;">
            <div><strong>${isAr ? 'المسار ج: أخدود هادلي (المسار العلمي)' : 'Route C: Rille Overlook (Science Detour)'}</strong><br><small style="color: var(--text-muted);">${isAr ? '1.6 كم · ملاحظات علمية إضافية · مسافة أطول' : '1.6 km · Extra observations · Maximum field science'}</small></div>
            <span style="color: var(--green); font-weight: bold;">1.6 KM</span>
          </button>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button class="btn-primary" id="btnConfirmRoute">${isAr ? 'ابدأ قيادة العربة' : 'START ROVER TRAVERSE'}</button>
        </div>
      </div>
    `;

    modal.querySelectorAll('.route-opt').forEach(btn => {
      btn.onclick = () => {
        modal.querySelectorAll('.route-opt').forEach(b => b.style.borderColor = 'var(--border-line)');
        btn.style.borderColor = 'var(--cyan)';
        selectedRoute = btn.dataset.route;
      };
    });

    document.getElementById('btnConfirmRoute').onclick = () => {
      modal.style.display = 'none';
      currentPhase = 'drive';
      player.x = 0; player.z = 0; player.a = Math.PI; player.v = 0;
      driveProgress = 0;
      roverHealth = 100;
      showToast(isAr ? 'بدأت القيادة! اتبع المنارات المضيئة حتى النهاية.' : 'Traverse active! Follow the cyan beacons to the research site.');
      updateHUD();
    };
  }

  function completeDrive() {
    currentPhase = 'complete';
    player.v = 0;
    const isAr = document.documentElement.dir === 'rtl';
    const modal = document.getElementById('gameCustomOverlay');
    if (!modal) return;
    
    // Award XP
    const earned = 600;
    if (window.ExplorerProfile) {
      window.ExplorerProfile.addXp(earned, 'Apollo 15 Lunar Traverse Complete');
    }

    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="hud-panel" style="max-width: 620px; width: 100%; pointer-events: auto; text-align: center;">
        <span style="font-size: 50px;">🏆</span>
        <h2 style="color: var(--gold); margin: 12px 0 6px;">${isAr ? 'استُعيد الرابط العلمي بنجاح!' : 'CONNECTION RESTORED!'}</h2>
        <p style="color: var(--cyan); font-weight: bold; letter-spacing: 0.1em;">+${earned} XP EARNED // ARCHIVE COMMENDATION</p>
        <p style="color: var(--text-secondary); margin: 16px 0; font-size: 15px; line-height: 1.6;">
          ${isAr 
            ? 'لقد أثبتت بنجاح كيف حولت المركبة القمرية مهمة أبولو 15 من استكشاف محدود حول نقطة الهبوط إلى دراسة جيولوجية إقليمية مكنت الرواد من الوصول إلى أخدود هادلي وجلب حجر سفر التكوين.'
            : 'You have proven how the Lunar Roving Vehicle transformed Apollo 15 from a restricted landing perimeter into regional fieldwork, reaching Hadley Rille and preserving primordial lunar history.'
          }
        </p>
        <div style="display: flex; justify-content: center; gap: 12px; margin-top: 24px;">
          <button class="btn-primary" id="btnFinishGame">${isAr ? 'العودة للمنصة وفتح المعرض' : 'RETURN TO PLATFORM & MUSEUM'}</button>
        </div>
      </div>
    `;

    document.getElementById('btnFinishGame').onclick = () => {
      modal.style.display = 'none';
      Apollo15Game.stop();
      if (document.getElementById('museum')) {
        document.getElementById('museum').scrollIntoView({ behavior: 'smooth' });
      }
    };
  }

  function showToast(msg) {
    const toast = document.getElementById('gameToast');
    if (!toast) return;
    toast.textContent = msg;
    toast.style.display = 'block';
    setTimeout(() => { toast.style.display = 'none'; }, 3400);
  }

  function updateHUD() {
    const isAr = document.documentElement.dir === 'rtl';
    const statusElem = document.getElementById('gamePhaseText');
    const evidenceElem = document.getElementById('gameEvidenceCount');
    const speedElem = document.getElementById('gameSpeedVal');
    const distElem = document.getElementById('gameDistVal');
    const promptElem = document.getElementById('gameInteractPrompt');

    if (statusElem) {
      statusElem.textContent = currentPhase === 'investigate' 
        ? (isAr ? 'المرحلة 1: جمع الأدلة العلمية' : 'Phase 1: Evidence Investigation')
        : currentPhase === 'drive'
        ? (isAr ? 'المرحلة 2: قيادة المركبة القمرية' : 'Phase 2: Lunar Surface Traverse')
        : (isAr ? 'المهمة مكتملة' : 'Mission Complete');
    }
    if (evidenceElem) {
      evidenceElem.textContent = `${evidenceFound.length} / 4`;
    }
    if (speedElem) {
      speedElem.textContent = `${Math.abs(player.v * 3.6).toFixed(1)} km/h`;
    }
    if (distElem) {
      distElem.textContent = currentPhase === 'drive' ? `${Math.abs(player.z).toFixed(0)} m` : '0 m';
    }

    if (promptElem && currentPhase === 'investigate') {
      let t = getInteractTarget();
      if (t) {
        promptElem.style.display = 'block';
        promptElem.innerHTML = t.type === 'evidence' 
          ? `[E] ${isAr ? 'افحص الدليل' : 'INSPECT EVIDENCE'}: <strong style="color:var(--gold)">${isAr ? t.title_ar : t.title_en}</strong>`
          : `[E] <strong style="color:var(--cyan)">${isAr ? 'ادخل المركبة القمرية' : 'INSPECT LUNAR ROVER'}</strong>`;
      } else {
        promptElem.style.display = 'none';
      }
    }
  }

  function update(dt) {
    elapsed += dt;
    if (currentPhase === 'investigate') {
      let forward = (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0);
      let turn = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0);
      player.a += turn * dt * 2.5;
      let spd = forward * 4.5;
      player.x += -Math.sin(player.a) * spd * dt;
      player.z += -Math.cos(player.a) * spd * dt;
    } else if (currentPhase === 'drive') {
      let forward = (keys.w || keys.arrowup ? 1 : 0) - (keys.s || keys.arrowdown ? 1 : 0);
      let turn = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0);
      if (forward > 0) player.v = Math.min(player.v + dt * 4.5, 3.8);
      else if (forward < 0) player.v = Math.max(player.v - dt * 6.0, -1.8);
      else player.v *= 0.96;

      player.a += turn * dt * 1.8 * (Math.abs(player.v) > 0.1 ? Math.sign(player.v) : 0);
      player.x += -Math.sin(player.a) * player.v * dt;
      player.z += -Math.cos(player.a) * player.v * dt;

      let routeInfo = ROUTES[selectedRoute];
      let endDist = Math.hypot(player.x - pathX(-routeInfo.length), player.z + routeInfo.length);
      const promptElem = document.getElementById('gameInteractPrompt');
      if (promptElem) {
        if (endDist < 8) {
          promptElem.style.display = 'block';
          promptElem.innerHTML = `[E] <strong style="color:var(--gold);">${document.documentElement.dir === 'rtl' ? 'بلوغ منارة البحث واستعادة الرابط' : 'REACH RESEARCH BEACON & RESTORE'}</strong>`;
        } else {
          promptElem.style.display = 'none';
        }
      }
    }
    updateHUD();
  }

  function render() {
    if (!gl) return;
    let w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.016, 0.022, 0.035, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let target = [player.x, height(player.x, player.z) + 1, player.z];
    let behind = [-Math.sin(player.a + camYaw) * 11, 8 + camPitch * 6, -Math.cos(player.a + camYaw) * 11];
    camera = [target[0] + behind[0], target[1] + behind[1], target[2] + behind[2]];

    projection = perspective(Math.PI / 3, canvas.width / canvas.height, 0.1, 380);
    view = lookAt(camera, target);

    // Render terrain
    drawMesh(terrainMesh, identity(), [0.45, 0.43, 0.40], 0, 1);

    // Render boulders
    for (let r of groundObjects) {
      if (Math.abs(r.x - player.x) > 90 || Math.abs(r.z - player.z) > 90) continue;
      let base = mul(translate(r.x, height(r.x, r.z) + r.size * 0.25, r.z), rotY(r.angle));
      drawMesh(cubeMesh, mul(base, scale(r.size * 0.55, r.size * 0.4, r.size * 0.75)), [0.42, 0.42, 0.41]);
    }

    // Render stars & Earth in sky
    for (let s of starObjects) {
      orb(s.x, s.y, s.z, s.r, [0.75, 0.85, 0.95], 0.8);
    }
    orb(52, 38, -95, 8.5, [0.18, 0.45, 0.72], 0.35); // Blue Planet Earth
    orb(54, 39, -94, 2.2, [0.22, 0.62, 0.42], 0.1);  // Continents

    // Render Apollo 15 Lunar Module (Descent stage) at (0, -22)
    let lmBase = mul(translate(0, height(0, -22) + 1.2, -22), identity());
    groupBox(lmBase, 0, 0, 0, 2.2, 1.0, 2.2, [0.75, 0.62, 0.35], 0.1); // Gold foil base
    groupBox(lmBase, 0, 1.4, 0, 1.6, 0.9, 1.6, [0.72, 0.75, 0.8]);     // Ascent cabin

    if (currentPhase === 'investigate') {
      renderRover(0, -5, Math.PI);
      renderAstronaut(player.x, player.z, player.a);
      // Evidence markers
      EVIDENCE_POINTS.forEach((pt, idx) => {
        if (!evidenceFound.includes(pt.id)) {
          beacon(pt.x, pt.z, idx, true);
        }
      });
    } else {
      // Traverse mode: render path beacons and moving rover
      let routeInfo = ROUTES[selectedRoute];
      let len = routeInfo.length;
      for (let j = 1; j <= 12; j++) {
        let z = -len * j / 12, x = pathX(z);
        box(x, height(x, z) + 0.04, z, 0.65, 0.04, 0.65, [0.2, 0.65, 0.75], 0.8);
        if (j % 3 === 0) beacon(x, z, j, true);
      }
      beacon(pathX(-len), -len, 20, true); // Final research beacon
      renderRover(player.x, player.z, player.a);
    }
  }

  let lastTime = 0;
  function loop(now) {
    if (!running) return;
    let dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  return {
    start: function() {
      const modal = document.getElementById('gameModal');
      if (modal) modal.classList.add('active');
      if (!initialized) initGL();
      running = true;
      lastTime = performance.now();
      requestAnimationFrame(loop);
      updateHUD();
    },
    stop: function() {
      running = false;
      const modal = document.getElementById('gameModal');
      if (modal) modal.classList.remove('active');
    },
    reset: function() {
      evidenceFound = [];
      player = { x: 0, z: 11, a: Math.PI, v: 0 };
      currentPhase = 'investigate';
      updateHUD();
    }
  };
})();
