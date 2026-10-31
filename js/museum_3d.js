// 3D Museum Interactive WebGL Viewer
window.Museum3D = (function() {
  let canvas, gl;
  let running = false;
  let currentModel = 'lrv-apollo15';
  let rotX = 0.25, rotY = 0.8, zoom = 14;
  let isDragging = false, lastX = 0, lastY = 0;
  let autoRotate = true;
  let wireframe = false;
  let program, loc = {}, cubeMesh, sphereMesh, cylinderMesh;

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
  function rotYMatrix(a) {
    let m = identity(), c = Math.cos(a), s = Math.sin(a);
    m[0] = c; m[2] = -s; m[8] = s; m[10] = c; return m;
  }
  function rotXMatrix(a) {
    let m = identity(), c = Math.cos(a), s = Math.sin(a);
    m[5] = c; m[6] = s; m[9] = -s; m[10] = c; return m;
  }
  function perspective(fovy, aspect, near, far) {
    let f = 1 / Math.tan(fovy / 2), r = mat4();
    r[0] = f / aspect; r[5] = f; r[10] = (far + near) / (near - far);
    r[11] = -1; r[14] = 2 * far * near / (near - far); return r;
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
    let p = [], n = [], idx = [], lat = 16, lon = 24;
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

  function init() {
    canvas = document.getElementById('museumCanvas');
    if (!canvas) return;
    gl = canvas.getContext('webgl', { antialias: true, alpha: true });
    if (!gl) return;

    const vs = `
      attribute vec3 aPos;
      attribute vec3 aNormal;
      uniform mat4 uMVP;
      uniform mat4 uModel;
      varying vec3 vNormal;
      void main(){
        vNormal = mat3(uModel) * aNormal;
        gl_Position = uMVP * vec4(aPos, 1.0);
      }
    `;
    const fs = `
      precision mediump float;
      varying vec3 vNormal;
      uniform vec3 uColor;
      uniform float uEmissive;
      void main(){
        vec3 N = normalize(vNormal);
        float diff = max(dot(N, normalize(vec3(0.5, 0.8, 0.6))), 0.0);
        float light = 0.35 + diff * 0.75;
        vec3 col = uColor * light + uColor * uEmissive;
        gl_FragColor = vec4(col, 1.0);
      }
    `;

    program = gl.createProgram();
    let vsh = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vsh, vs); gl.compileShader(vsh);
    let fsh = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fsh, fs); gl.compileShader(fsh);
    gl.attachShader(program, vsh);
    gl.attachShader(program, fsh);
    gl.linkProgram(program);
    gl.useProgram(program);

    ['aPos', 'aNormal'].forEach(k => loc[k] = gl.getAttribLocation(program, k));
    ['uMVP', 'uModel', 'uColor', 'uEmissive'].forEach(k => loc[k] = gl.getUniformLocation(program, k));

    cubeMesh = makeCube();
    sphereMesh = makeSphere();

    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.02, 0.05, 0.1, 1.0);

    // Mouse drag controls
    canvas.addEventListener('mousedown', e => {
      isDragging = true;
      lastX = e.clientX; lastY = e.clientY;
    });
    window.addEventListener('mouseup', () => isDragging = false);
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      let dx = e.clientX - lastX;
      let dy = e.clientY - lastY;
      rotY += dx * 0.01;
      rotX = Math.max(-1.1, Math.min(1.1, rotX + dy * 0.01));
      lastX = e.clientX; lastY = e.clientY;
      autoRotate = false;
    });

    // Zoom on wheel
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      zoom = Math.max(6, Math.min(25, zoom + e.deltaY * 0.015));
    }, { passive: false });

    running = true;
    requestAnimationFrame(renderLoop);
  }

  function drawPart(mesh, parent, x, y, z, sx, sy, sz, color, em = 0) {
    let model = mul(parent, mul(translate(x, y, z), scale(sx, sy, sz)));
    let mvp = mul(perspective(Math.PI / 4, canvas.width / canvas.height, 0.1, 100),
                  mul(translate(0, 0, -zoom),
                      mul(rotXMatrix(rotX),
                          mul(rotYMatrix(rotY), model))));

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.v);
    gl.enableVertexAttribArray(loc.aPos);
    gl.vertexAttribPointer(loc.aPos, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mesh.n);
    gl.enableVertexAttribArray(loc.aNormal);
    gl.vertexAttribPointer(loc.aNormal, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.i);
    gl.uniformMatrix4fv(loc.uModel, false, model);
    gl.uniformMatrix4fv(loc.uMVP, false, mvp);
    gl.uniform3fv(loc.uColor, color);
    gl.uniform1f(loc.uEmissive, em);

    gl.drawElements(wireframe ? gl.LINES : gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
  }

  function renderLRV(parent) {
    // Chassis & tubular frame
    drawPart(cubeMesh, parent, 0, -0.4, 0, 2.2, 0.15, 3.2, [0.75, 0.68, 0.52]);
    // Seats (lawn-chair tubular mesh)
    drawPart(cubeMesh, parent, -0.5, 0.2, -0.2, 0.45, 0.45, 0.4, [0.25, 0.35, 0.45]);
    drawPart(cubeMesh, parent, 0.5, 0.2, -0.2, 0.45, 0.45, 0.4, [0.25, 0.35, 0.45]);
    // Forward equipment console & T-handle joystick
    drawPart(cubeMesh, parent, 0, 0.35, 0.5, 0.35, 0.35, 0.45, [0.8, 0.75, 0.65]);
    // High-gain mesh antenna mast & dish
    drawPart(cubeMesh, parent, -0.8, 1.1, 1.2, 0.05, 0.9, 0.05, [0.8, 0.8, 0.8]);
    drawPart(sphereMesh, parent, -0.8, 1.6, 1.2, 0.6, 0.1, 0.6, [0.25, 0.65, 0.75], 0.2);
    // Color TV Camera
    drawPart(cubeMesh, parent, 0.8, 0.7, 1.2, 0.25, 0.25, 0.35, [0.75, 0.75, 0.7]);
    drawPart(sphereMesh, parent, 0.8, 0.7, 1.45, 0.12, 0.12, 0.12, [0.1, 0.1, 0.1], 0.8);
    // 4 Wheels
    for (let s of [-1, 1]) {
      for (let dz of [-1.2, 1.2]) {
        drawPart(cubeMesh, parent, s * 2.4, -0.8, dz, 0.35, 0.7, 0.55, [0.15, 0.17, 0.2]);
        drawPart(cubeMesh, parent, s * 1.8, -0.5, dz, 0.6, 0.08, 0.08, [0.65, 0.6, 0.5]);
      }
    }
  }

  function renderOpportunity(parent) {
    // Triangular central body
    drawPart(cubeMesh, parent, 0, 0.2, 0, 1.6, 0.35, 1.8, [0.8, 0.72, 0.55]);
    // Solar array wings
    drawPart(cubeMesh, parent, 0, 0.42, 0, 2.6, 0.05, 2.2, [0.15, 0.22, 0.45], 0.15);
    drawPart(cubeMesh, parent, 0, 0.44, 0, 2.5, 0.02, 2.1, [0.1, 0.15, 0.3], 0.2);
    // Pancam camera mast
    drawPart(cubeMesh, parent, 0, 1.3, 0.6, 0.06, 0.9, 0.06, [0.75, 0.75, 0.75]);
    drawPart(cubeMesh, parent, 0, 2.1, 0.6, 0.35, 0.18, 0.25, [0.85, 0.85, 0.85]);
    drawPart(sphereMesh, parent, -0.15, 2.1, 0.72, 0.08, 0.08, 0.08, [0.1, 0.4, 0.6], 0.4);
    drawPart(sphereMesh, parent, 0.15, 2.1, 0.72, 0.08, 0.08, 0.08, [0.1, 0.4, 0.6], 0.4);
    // Robotic Arm (IDD)
    drawPart(cubeMesh, parent, 0, -0.2, 1.2, 0.1, 0.5, 0.1, [0.7, 0.7, 0.7]);
    drawPart(sphereMesh, parent, 0, -0.45, 1.3, 0.18, 0.18, 0.18, [0.85, 0.4, 0.2], 0.3);
    // 6 Rocker-Bogie wheels
    for (let s of [-1, 1]) {
      for (let dz of [-1.1, 0, 1.1]) {
        drawPart(cubeMesh, parent, s * 1.9, -0.85, dz, 0.3, 0.45, 0.3, [0.25, 0.25, 0.28]);
      }
    }
  }

  function renderInSight(parent) {
    // Octagonal lander body
    drawPart(cubeMesh, parent, 0, 0.2, 0, 1.8, 0.5, 1.8, [0.8, 0.78, 0.72]);
    // Dual circular solar arrays
    drawPart(sphereMesh, parent, -2.6, 0.3, 0, 1.4, 0.04, 1.4, [0.15, 0.25, 0.5], 0.2);
    drawPart(sphereMesh, parent, 2.6, 0.3, 0, 1.4, 0.04, 1.4, [0.15, 0.25, 0.5], 0.2);
    // SEIS Seismometer dome
    drawPart(sphereMesh, parent, 0, 0.8, 0.3, 0.6, 0.45, 0.6, [0.85, 0.75, 0.4], 0.4);
    // HP3 Mole probe housing
    drawPart(cubeMesh, parent, 0.6, 0.6, -0.5, 0.3, 0.4, 0.3, [0.7, 0.7, 0.7]);
    // 3 Landing shock struts / legs
    for (let a of [0, 2.09, 4.18]) {
      let x = Math.cos(a) * 1.7, z = Math.sin(a) * 1.7;
      drawPart(cubeMesh, parent, x, -0.6, z, 0.1, 0.6, 0.1, [0.55, 0.55, 0.55]);
      drawPart(cubeMesh, parent, x * 1.2, -0.9, z * 1.2, 0.35, 0.08, 0.35, [0.4, 0.4, 0.4]);
    }
  }

  function renderLoop() {
    if (!running) return;
    if (autoRotate) {
      rotY += 0.006;
    }

    let w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let root = identity();
    if (currentModel === 'lrv-apollo15') {
      renderLRV(root);
    } else if (currentModel === 'mer-opportunity') {
      renderOpportunity(root);
    } else if (currentModel === 'insight-lander') {
      renderInSight(root);
    }

    requestAnimationFrame(renderLoop);
  }

  return {
    init,
    setModel: function(id) {
      currentModel = id;
    },
    toggleWireframe: function() {
      wireframe = !wireframe;
      return wireframe;
    },
    resetView: function() {
      rotX = 0.25; rotY = 0.8; zoom = 14;
      autoRotate = true;
    }
  };
})();
