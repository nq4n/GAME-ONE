// Interactive Knowledge & Evidence Graph (PZ15: Archive Graph)
window.EvidenceGraph = (function() {
  let canvas, ctx;
  let running = false;
  let hoveredNode = null;
  let selectedNode = null;
  let nodes = [];
  let links = [];

  function init() {
    canvas = document.getElementById('graphCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);

    setupData();
    setupEvents();
    running = true;
    requestAnimationFrame(renderLoop);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 420;
    setupData();
  }

  function setupData() {
    const isAr = document.documentElement.dir === 'rtl';
    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2;

    nodes = [
      // Core Center Hub
      { id: 'origin', label_en: 'ORIGIN ARCHIVE', label_ar: 'أرشيف أوريجين', x: cx, y: cy, r: 24, type: 'hub', color: '#64e3f3' },
      
      // Equipment
      { id: 'lrv', label_en: 'Apollo 15 LRV', label_ar: 'مركبة أبولو 15', x: cx - w * 0.28, y: cy - h * 0.25, r: 18, type: 'equipment', color: '#f8cb6e' },
      { id: 'mer', label_en: 'Opportunity MER', label_ar: 'أوبورتونيتي', x: cx + w * 0.28, y: cy - h * 0.25, r: 18, type: 'equipment', color: '#ff7253' },
      { id: 'insight', label_en: 'InSight Lander', label_ar: 'إنسايت', x: cx, y: cy + h * 0.32, r: 16, type: 'equipment', color: '#a78bfa' },

      // Evidence
      { id: 'c01', label_en: 'Wire Mesh Wheels', label_ar: 'عجلات التيتانيوم', x: cx - w * 0.38, y: cy - h * 0.05, r: 12, type: 'evidence', color: '#38bdf8' },
      { id: 'c02', label_en: 'Lunar Core Drill', label_ar: 'مثقاب الأعماق', x: cx - w * 0.32, y: cy + h * 0.22, r: 12, type: 'evidence', color: '#38bdf8' },
      { id: 'c03', label_en: 'Solar Arrays & Dust', label_ar: 'الألواح والغبار', x: cx + w * 0.38, y: cy - h * 0.05, r: 12, type: 'evidence', color: '#fb923c' },
      { id: 'c04', label_en: 'RAT Rock Tool', label_ar: 'أداة سحق الصخور', x: cx + w * 0.32, y: cy + h * 0.22, r: 12, type: 'evidence', color: '#fb923c' },
      { id: 'c05', label_en: 'SEIS Vacuum Dome', label_ar: 'قبة قياس الزلازل', x: cx + w * 0.15, y: cy + h * 0.36, r: 12, type: 'evidence', color: '#c084fc' },

      // Discoveries
      { id: 'd01', label_en: 'Genesis Rock (4B yrs)', label_ar: 'حجر سفر التكوين', x: cx - w * 0.18, y: cy - h * 0.36, r: 14, type: 'discovery', color: '#4ade80' },
      { id: 'd02', label_en: 'Hematite Water Proof', label_ar: 'إثبات مياه المريخ', x: cx + w * 0.18, y: cy - h * 0.36, r: 14, type: 'discovery', color: '#4ade80' },
      { id: 'd03', label_en: 'Liquid Mars Core', label_ar: 'لب المريخ السائل', x: cx - w * 0.15, y: cy + h * 0.36, r: 14, type: 'discovery', color: '#4ade80' }
    ];

    links = [
      { from: 'origin', to: 'lrv' },
      { from: 'origin', to: 'mer' },
      { from: 'origin', to: 'insight' },
      
      { from: 'lrv', to: 'c01' },
      { from: 'lrv', to: 'c02' },
      { from: 'lrv', to: 'd01' },

      { from: 'mer', to: 'c03' },
      { from: 'mer', to: 'c04' },
      { from: 'mer', to: 'd02' },

      { from: 'insight', to: 'c05' },
      { from: 'insight', to: 'd03' }
    ];
  }

  function setupEvents() {
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      hoveredNode = null;
      for (let n of nodes) {
        if (Math.hypot(n.x - mx, n.y - my) < n.r + 5) {
          hoveredNode = n;
          break;
        }
      }
      canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
    });

    canvas.addEventListener('click', () => {
      if (hoveredNode) {
        selectedNode = hoveredNode;
        showNodeDetails(selectedNode);
      }
    });
  }

  function showNodeDetails(node) {
    const isAr = document.documentElement.dir === 'rtl';
    const detailBox = document.getElementById('graphDetailBox');
    if (!detailBox) return;

    detailBox.innerHTML = `
      <div style="background: rgba(14,28,50,0.85); border: 1px solid ${node.color}; border-radius: var(--radius-md); padding: 16px; margin-top: 14px;">
        <span style="color: ${node.color}; font-size: 11px; font-weight: 700; text-transform: uppercase;">
          ${node.type.toUpperCase()} // ARCHIVE NODE
        </span>
        <h4 style="color: #fff; margin: 4px 0 8px;">${isAr ? node.label_ar : node.label_en}</h4>
        <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.5; margin: 0;">
          ${isAr 
            ? 'عنصر موثق داخل شبكة الأدلة العلمية، يربط المعدات الفضائية المتروكة بالمعرفة التاريخية التي فتحتها للبشرية.' 
            : 'Archival node verified in the master scientific chain, linking historic hardware to groundbreaking cosmic discoveries.'
          }
        </p>
      </div>
    `;
  }

  let time = 0;
  function renderLoop() {
    if (!running || !ctx) return;
    time += 0.02;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw links
    for (let link of links) {
      const src = nodes.find(n => n.id === link.from);
      const dst = nodes.find(n => n.id === link.to);
      if (!src || !dst) continue;

      const isHighlighted = (hoveredNode && (hoveredNode.id === src.id || hoveredNode.id === dst.id));

      ctx.beginPath();
      ctx.moveTo(src.x, src.y);
      ctx.lineTo(dst.x, dst.y);
      ctx.strokeStyle = isHighlighted ? 'rgba(100, 227, 243, 0.8)' : 'rgba(100, 227, 243, 0.16)';
      ctx.lineWidth = isHighlighted ? 2.5 : 1.2;
      ctx.stroke();

      // Animated energy pulse on link
      if (isHighlighted) {
        let p = (time * 1.5) % 1;
        let px = src.x + (dst.x - src.x) * p;
        let py = src.y + (dst.y - src.y) * p;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#64e3f3';
        ctx.shadowColor = '#64e3f3';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // Draw nodes
    const isAr = document.documentElement.dir === 'rtl';
    for (let n of nodes) {
      const isHov = (hoveredNode && hoveredNode.id === n.id);
      const r = isHov ? n.r * 1.25 : n.r;

      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = isHov ? 20 : 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = '#061324';
      ctx.fill();

      // Label text
      ctx.font = isHov ? 'bold 12px sans-serif' : '11px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(isAr ? n.label_ar : n.label_en, n.x, n.y + r + 16);
    }

    requestAnimationFrame(renderLoop);
  }

  return { init };
})();
