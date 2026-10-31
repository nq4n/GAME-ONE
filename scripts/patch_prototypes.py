# Update echoes_of_space_prototype.html
with open('echoes_of_space_prototype.html', 'r', encoding='utf-8') as f:
    ar_html = f.read()

# Replace placeholder alerts
ar_html = ar_html.replace(
    "onclick=\"alert('هذا القسم نموذج توضيحي — سيتم دمج اللعبة الحالية هنا.')\"",
    "onclick=\"window.location.href='echoes_space_v2/index.html'\""
)
ar_html = ar_html.replace(
    "onclick=\"alert('في النسخة الكاملة: عرض نموذج 3D قابل للدوران والتكبير.')\"",
    "onclick=\"window.location.href='index.html#museum'\""
)
ar_html = ar_html.replace(
    "onclick=\"alert('سيُضاف نص القصة التفاعلي في النسخة التالية.')\"",
    "onclick=\"window.location.href='index.html#stories'\""
)

# Add top banner under <body>
banner_ar = """<body>
<div style="background:linear-gradient(90deg,#0a213a,#164b73);padding:10px 6%;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #70e1f555;font-size:14px;gap:10px;flex-wrap:wrap;">
  <span>🚀 <b>تم تفعيل اللعبة ثلاثية الأبعاد والمنصة الكاملة!</b> انقر لبدء اللعبة أو فتح المنصة الكاملة:</span>
  <div style="display:flex;gap:8px;">
    <a href="echoes_space_v2/index.html" style="background:#70e1f5;color:#061321;padding:6px 16px;border-radius:20px;text-decoration:none;font-weight:bold;">▶ تشغيل اللعبة 3D</a>
    <a href="index.html" style="background:rgba(255,255,255,0.15);color:#fff;padding:6px 14px;border-radius:20px;text-decoration:none;font-weight:bold;border:1px solid rgba(255,255,255,0.3);">المنصة الكاملة ↗</a>
  </div>
</div>"""

ar_html = ar_html.replace("<body>", banner_ar, 1)

with open('echoes_of_space_prototype.html', 'w', encoding='utf-8') as f:
    f.write(ar_html)

# Update echoes_of_space_prototype_en.html
with open('echoes_of_space_prototype_en.html', 'r', encoding='utf-8') as f:
    en_html = f.read()

en_html = en_html.replace(
    "onclick=\"alert('This is a placeholder section — the existing game will be integrated here.')\"",
    "onclick=\"window.location.href='echoes_space_v2/index.html'\""
)
en_html = en_html.replace(
    "onclick=\"alert('In the full version: an interactive 3D model that can be rotated and zoomed.')\"",
    "onclick=\"window.location.href='index.html#museum'\""
)
en_html = en_html.replace(
    "onclick=\"alert('The interactive story will be added in the next version.')\"",
    "onclick=\"window.location.href='index.html#stories'\""
)

banner_en = """<body>
<div style="background:linear-gradient(90deg,#0a213a,#164b73);padding:10px 6%;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #70e1f555;font-size:14px;gap:10px;flex-wrap:wrap;">
  <span>🚀 <b>3D Game and Full-Stack Platform Active!</b> Click to launch game or explore platform:</span>
  <div style="display:flex;gap:8px;">
    <a href="echoes_space_v2/index.html" style="background:#70e1f5;color:#061321;padding:6px 16px;border-radius:20px;text-decoration:none;font-weight:bold;">▶ Play 3D Game</a>
    <a href="index.html" style="background:rgba(255,255,255,0.15);color:#fff;padding:6px 14px;border-radius:20px;text-decoration:none;font-weight:bold;border:1px solid rgba(255,255,255,0.3);">Full Platform ↗</a>
  </div>
</div>"""

en_html = en_html.replace("<body>", banner_en, 1)

with open('echoes_of_space_prototype_en.html', 'w', encoding='utf-8') as f:
    f.write(en_html)

print("Updated prototype files successfully!")
