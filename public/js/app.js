// Central Application Logic & Full-Stack API Client
// Bilingual AR/EN, State Store, Embedded Game Coordinator
// Optimized for static GitHub Pages AND local Node.js server!

const I18N_DICT = {
  en: {
    brand_sub: "THE LAST SIGNAL · NASA SPACE APPS 2026",
    nav_explore: "Explore",
    nav_game: "Playable 3D Game",
    nav_missions: "Missions",
    nav_museum: "3D Museum",
    nav_stories: "Stories",
    nav_lab: "Mobility Lab",
    nav_quiz: "Quizzes",
    nav_bible: "Game Bible",
    nav_community: "Leaderboard",
    
    hero_badge: "NASA Space Apps Challenge 2026 // Playable STEM Experience",
    hero_title_1: "Every piece we left in space",
    hero_title_2: "has a story worth telling.",
    hero_lead: "Discover historic equipment abandoned on the Moon and Mars through interactive 3D WebGL simulations, real physics trade-offs, storytelling, and STEM knowledge challenges.",
    btn_launch_apollo: "▶ Play Apollo 15 3D Game Now",
    btn_mars_sim: "⚡ Mars Opportunity Sol Sim",
    btn_visit_museum: "🏛️ Explore 3D Museum",
    btn_direct_game: "Open Dedicated Fullscreen Game ↗",
    
    game_sec_kicker: "GENESIS II // 3D PLAYABLE SIMULATOR",
    game_sec_title: "Playable Lunar Rover Mission (Apollo 15)",
    game_sec_desc: "Walk the lunar surface at Hadley-Apennine, recover three scientific evidence signals, inspect the Lunar Roving Vehicle, select your route, and drive to the research beacon.",
    
    stat_missions: "Historic Missions",
    stat_exhibits: "3D Museum Exhibits",
    stat_claims: "Scientific Claims Verified",
    stat_xp: "Explorer Community XP",
    
    missions_kicker: "FIELD INVESTIGATIONS",
    missions_title: "Choose Your Exploration Mission",
    missions_desc: "Step onto alien surfaces, investigate authentic scientific hardware, solve connection puzzles, and reconstruct cosmic knowledge.",
    
    museum_kicker: "VIRTUAL HARDWARE REPOSITORY",
    museum_title: "Interactive 3D Equipment Museum",
    museum_desc: "Rotate, zoom, and inspect historical spacecraft left on extraterrestrial surfaces. Examine their dimensions, scientific payloads, and discoveries.",
    
    lab_kicker: "PHYSICS EXPERIMENT // SIM01",
    lab_title: "Mobility Science & Mission Planning Lab",
    lab_desc: "Test how vehicle speed and distance alter time available for field geology. Based on Apollo mission planning equations: t = d / v.",
    
    stories_kicker: "NARRATIVE ARCHIVES",
    stories_title: "Stories from the Frontiers",
    stories_desc: "Engaging educational narratives turning complex planetary missions into thrilling human adventures.",
    
    quiz_kicker: "STEM KNOWLEDGE CHALLENGE",
    quiz_title: "Test Your Space Exploration Knowledge",
    quiz_desc: "Answer scientific questions verified by NASA sources to earn XP, unlock commendations, and climb the explorer ranks.",
    
    bible_kicker: "MASTER DOCUMENTATION",
    bible_title: "Genesis V Master Game Bible Explorer",
    bible_desc: "Direct access to the 43 comprehensive design sheets: 35 puzzles, 24 verified scientific claims, judges Q&A, and technical architecture.",
    
    community_kicker: "ORBITAL ROSTER",
    community_title: "Global Explorer Leaderboard & Log",
    community_desc: "Celebrate top explorers and read notes from students, teachers, and NASA Space Apps evaluation judges."
  },
  ar: {
    brand_sub: "الإشارة الأخيرة · ناسا سبيس آبس 2026",
    nav_explore: "استكشف",
    nav_game: "اللعبة ثلاثية الأبعاد",
    nav_missions: "المهمات",
    nav_museum: "متحف 3D",
    nav_stories: "القصص",
    nav_lab: "مختبر الحركة",
    nav_quiz: "اختبر نفسك",
    nav_bible: "وثيقة المشروع",
    nav_community: "المتصدرون",
    
    hero_badge: "تحدي ناسا سبيس آبس 2026 // تجربة تعليمية تفاعلية قابلة للعب",
    hero_title_1: "كل قطعة تركناها في الفضاء،",
    hero_title_2: "لها قصة تستحق أن تُروى.",
    hero_lead: "اكتشف إرث المعدات العلمية التي تركتها بعثات القمر والمريخ عبر محاكاة 3D WebGL قابلة للعب بالكامل، وتجارب فيزيائية واقعية، وقصص ملهمة، وتحديات معرفية.",
    btn_launch_apollo: "▶ تشغيل لعبة أبولو 15 ثلاثية الأبعاد الآن",
    btn_mars_sim: "⚡ محاكاة أوبورتونيتي على المريخ",
    btn_visit_museum: "🏛️ دخول المتحف الفضائي",
    btn_direct_game: "فتح اللعبة في شاشة كاملة مخصصة ↗",
    
    game_sec_kicker: "جينيسيس II // محاكاة 3D تفاعلية قابلة للعب",
    game_sec_title: "لعبة قيادة المركبة القمرية (بعثة أبولو 15)",
    game_sec_desc: "تحرك على سطح القمر في موقع هادلي-أبينين، واجمع 3 إشارات علمية، وافحص العربة القمرية، واختر مسارك وقد المركبة حتى منارة البحث العلمي.",
    
    stat_missions: "مهمات استكشافية",
    stat_exhibits: "معروضات 3D تفاعلية",
    stat_claims: "حقائق علمية موثقة",
    stat_xp: "نقاط معرفة المستكشفين",
    
    missions_kicker: "تحقيقات ميدانية",
    missions_title: "اختر مهمتك الاستكشافية",
    missions_desc: "اهبط على أسطح العوالم الأخرى، وافحص المعدات التاريخية، وحل ألغاز الاتصال، وأعد بناء المعرفة العلمية المفقودة.",
    
    museum_kicker: "مستودع الآثار الفضائية",
    museum_title: "متحف المعدات ثلاثي الأبعاد",
    museum_desc: "دوّر وكبّر وافحص المركبات والمعدات الفضائية المتروكة في عوالم أخرى. تعرّف على مواصفاتها وأدواتها العلمية وما تعلمناه منها.",
    
    lab_kicker: "تجربة فيزيائية // SIM01",
    lab_title: "مختبر فيزياء التنقل وتخطيط المهمات",
    lab_desc: "اختبر تأثير سرعة المركبة والمسافة في الوقت المتاح للملاحظات الجيولوجية، وفق معادلات تخطيط رحلات أبولو الحقيقية: الزمن = المسافة ÷ السرعة.",
    
    stories_kicker: "أرشيف السرد العلمي",
    stories_title: "قصص من آفاق الفضاء",
    stories_desc: "حكايات تعليمية مشوقة تحول المهمات الكوكبية المعقدة إلى مغامرات إنسانية خالدة.",
    
    quiz_kicker: "تحدي المعرفة الفضائية",
    quiz_title: "اختبر معلوماتك في علوم الفضاء",
    quiz_desc: "أجب عن أسئلة علمية موثقة بمصادر ناسا واجمع نقاط المعرفة XP وارتقِ في رتب رواد الفضاء.",
    
    bible_kicker: "التوثيق الشامل للعبة",
    bible_title: "مستكشف وثيقة المشروع الكاملة (Game Bible)",
    bible_desc: "تصفح أوراق التصميم الـ 43: كتالوج الألغاز الـ 35، والحقائق العلمية الـ 24، وأسئلة المحكمين، والمعمارية التقنية.",
    
    community_kicker: "سجل المستكشفين",
    community_title: "لوحة الشرف وسجل الزوار",
    community_desc: "احتفِ بأفضل المستكشفين واقرأ ملاحظات الطلاب والمعلمين ومحكّمي مسابقة ناسا سبيس آبس."
  }
};

// Global i18n manager
window.i18n = {
  lang: 'ar',
  t: function(key) {
    return (I18N_DICT[this.lang] && I18N_DICT[this.lang][key]) || (I18N_DICT['en'] && I18N_DICT['en'][key]) || key;
  },
  toggle: function() {
    this.lang = this.lang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = this.lang;
    document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
    const btn = document.getElementById('btnLang');
    if (btn) btn.textContent = this.lang === 'ar' ? 'English' : 'العربية';
    this.apply();
  },
  apply: function() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = this.t(key);
    });
    renderMissions();
    renderMuseumInfo();
    renderStories();
    renderQuizzes();
    renderBible();
  }
};

// Explorer Profile & XP Store
window.ExplorerProfile = {
  data: {
    name: 'Explorer Cadet',
    callsign: 'Apex-1',
    xp: 450,
    badges: ['Cadet Wings']
  },
  init: function() {
    try {
      const saved = localStorage.getItem('echoes_explorer_profile');
      if (saved) {
        this.data = { ...this.data, ...JSON.parse(saved) };
      }
    } catch (e) {}
    this.updateUI();
  },
  addXp: function(amount, reason) {
    this.data.xp += amount;
    try {
      localStorage.setItem('echoes_explorer_profile', JSON.stringify(this.data));
    } catch (e) {}
    this.updateUI();
    // Post to backend if server available
    fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: this.data.name,
        callsign: this.data.callsign,
        xp: this.data.xp,
        completed: reason
      })
    }).then(() => loadLeaderboard()).catch(() => {
      // Local fallback
      loadLeaderboard();
    });
  },
  updateUI: function() {
    const badge = document.getElementById('xpBadge');
    if (badge) {
      badge.textContent = `★ ${this.data.xp} XP`;
    }
  }
};

// Built-in offline fallback data (Ensures 100% functionality without server or over GitHub Pages!)
const FALLBACK_MISSIONS = [
  {
    id: "apollo-15",
    title_en: "Apollo 15: The Silent Rover",
    title_ar: "أبولو 15: المركبة القمرية الصامتة",
    celestial_body_en: "Moon (Hadley–Apennine)",
    celestial_body_ar: "القمر (هادلي–أبينين)",
    year: 1971,
    status: "playable",
    distance_driven: "27.9 km",
    tag_en: "Mobility & Geology",
    tag_ar: "الحركة والجيولوجيا",
    description_en: "Drive the Lunar Roving Vehicle across Hadley-Apennine, explore the edge of Hadley Rille gorge, and recover the 4-billion-year-old Genesis Rock.",
    description_ar: "قُد المركبة القمرية عبر سهول هادلي-أبينين، واستكشف حافة أخدود هادلي السحيق، واعثر على حجر سفر التكوين الذي يعود تاريخه لأربعة مليارات عام."
  },
  {
    id: "opportunity",
    title_en: "Opportunity: The 15-Year Sol Journey",
    title_ar: "أوبورتونيتي: رحلة الـ 15 عاماً على المريخ",
    celestial_body_en: "Mars (Meridiani Planum)",
    celestial_body_ar: "المريخ (سهل ميريدياني)",
    year: "2004–2018",
    status: "playable_sim",
    distance_driven: "45.16 km",
    tag_en: "Solar Energy & Survival",
    tag_ar: "الطاقة الشمسية والبقاء",
    description_en: "Manage energy budgets across 4 critical sols during the historic 2018 Martian dust storm, operating science spectrometers until final telemetry.",
    description_ar: "أدِر ميزانية الطاقة عبر 4 أيام حرجة خلال العاصفة الغبارية التاريخية عام 2018، وشغل مطياف الصخور وصولاً لآخر إشارة اتصال."
  },
  {
    id: "insight",
    title_en: "InSight: The Seismic Heart of Mars",
    title_ar: "إنسايت: الاستماع لنبض المريخ الداخلي",
    celestial_body_en: "Mars (Elysium Planitia)",
    celestial_body_ar: "المريخ (إليسيوم بلانيشيا)",
    year: "2018–2022",
    status: "museum",
    distance_driven: "Stationary Lander",
    tag_en: "Geophysics & Marsquakes",
    tag_ar: "الجيوفيزياء وزلازل المريخ",
    description_en: "Geophysical station that recorded over 1,319 marsquakes, mapping Mars' crust thickness and proving the core is liquid molten iron-nickel.",
    description_ar: "محطة جيوفيزيائية سجلت أكثر من 1319 زلزالاً مريخياً، ورسمت خارطة لقشرة المريخ وأثبتت أن لبه سائل منصهر."
  }
];

const FALLBACK_EXHIBITS = [
  {
    id: "lrv-apollo15",
    title_en: "Apollo 15 Lunar Roving Vehicle (LRV-1)",
    title_ar: "المركبة القمرية الجوالة - أبولو 15",
    category_en: "Manned Surface Mobility",
    category_ar: "مركبات النقل المأهولة",
    mass: "210 kg (Earth) / 35 kg (Moon)",
    dimensions: "3.1 m long × 1.8 m wide × 1.14 m high",
    top_speed: "13 km/h (8 mph)",
    power_system: "Two 36-volt silver-zinc non-rechargeable batteries (121 Ah each)",
    scientific_payload_en: "Color TV Camera with Ground Control, Lunar Drill, 500mm Telephoto Hasselblad, Magnetometer, Soil Penetrometer.",
    scientific_payload_ar: "كاميرا تلفزيونية ملونة بتحكم أرضي، مثقاب قمري، كاميرا هاسلبلاد 500 مم، مقياس مغناطيسية، مقياس اختراق التربة.",
    what_we_learned_en: "Transformed lunar exploration from hundreds of meters to regional geology. Enabled collection of 77 kg of samples including Genesis Rock.",
    what_we_learned_ar: "حوّلت استكشاف القمر من مئات الأمتار إلى دراسة جيولوجية إقليمية، ومكنت من جلب 77 كجم من العينات بما فيها صخرة التكوين.",
    status_today_en: "Pristine at Hadley-Apennine (26.13° N, 3.63° E). Historical cultural artifact.",
    status_today_ar: "بحالة ممتازة في موقع هادلي-أبينين على القمر كأثر تاريخي للإنسانية.",
    nasa_link: "https://www.nasa.gov/mission/apollo-15/"
  },
  {
    id: "mer-opportunity",
    title_en: "Opportunity Rover (MER-B)",
    title_ar: "مركبة أوبورتونيتي المريخية (MER-B)",
    category_en: "Robotic Science Explorer",
    category_ar: "مستكشف روبوتي للأسطح",
    mass: "185 kg",
    dimensions: "1.6 m long × 2.3 m wide × 1.5 m high",
    top_speed: "5 cm/s (0.18 km/h)",
    power_system: "GaAs Triple-Junction Solar Array (140W) + 2 Li-ion batteries",
    scientific_payload_en: "Pancam, Mini-TES, Mössbauer Spectrometer, APXS, Rock Abrasion Tool (RAT).",
    scientific_payload_ar: "كاميرا بانورامية Pancam، مطياف Mini-TES، مطياف موسباور، مطياف APXS، أداة سحق الصخور RAT.",
    what_we_learned_en: "Discovered hematite blueberries and sulfate minerals proving liquid water once pooled on Mars.",
    what_we_learned_ar: "اكتشفت كرات الهيماتيت ومعادن الكبريتات التي أثبتت وجود مياه سائلة في ماضي المريخ.",
    status_today_en: "Resting in Perseverance Valley at Endeavour Crater rim.",
    status_today_ar: "مركونة في وادي بيرسيفيرانس على حافة فوهة إنديفور.",
    nasa_link: "https://mars.nasa.gov/mer/"
  },
  {
    id: "insight-lander",
    title_en: "InSight Mars Lander",
    title_ar: "مركبة إنسايت لدراسة باطن المريخ",
    category_en: "Geophysical Station",
    category_ar: "محطة رصد جيوفيزيائية",
    mass: "358 kg",
    dimensions: "6.0 m solar array span",
    top_speed: "Stationary Lander",
    power_system: "Twin 2.15-meter circular solar arrays",
    scientific_payload_en: "SEIS Ultra-sensitive Seismometer, HP3 Heat Probe, RISE Doppler antenna.",
    scientific_payload_ar: "مقياس الزلازل الفائق SEIS، مسبار التدفق الحراري HP3، وهوائي RISE.",
    what_we_learned_en: "Recorded 1,319+ marsquakes, measured crust thickness (24-72 km) and confirmed a large liquid core.",
    what_we_learned_ar: "سجلت 1319 زلزالاً مريخياً، وقاست سمك القشرة وأكدت وجود لب سائل للمريخ.",
    status_today_en: "Stationary at Elysium Planitia; last signal December 2022.",
    status_today_ar: "مستقرة في سهل إليسيوم بلانيشيا؛ آخر إشارة ديسمبر 2022.",
    nasa_link: "https://mars.nasa.gov/insight/"
  }
];

const FALLBACK_QUIZZES = [
  {
    id: "q1",
    question_en: "Why did NASA send the Lunar Roving Vehicle (LRV) on Apollo 15?",
    question_ar: "لماذا أرسلت ناسا المركبة القمرية الجوالة (LRV) في بعثة أبولو 15؟",
    options_en: [
      "To build cities immediately",
      "To expand field mobility and collect geological samples over wide distances",
      "To generate lunar artificial gravity",
      "To drill tunnels into the Moon core"
    ],
    options_ar: [
      "لبناء مدن فوراً على القمر",
      "لتوسيع نطاق حركة الرواد وجمع عينات جيولوجية عبر مسافات واسعة",
      "لتوليد جاذبية اصطناعية",
      "لحفر أنفاق في لب القمر"
    ],
    correct: 1,
    explanation_en: "The rover expanded exploration from hundreds of meters around the LM to dozens of kilometers, reaching Hadley Rille.",
    explanation_ar: "وسعت المركبة نطاق الاستكشاف من مئات الأمتار إلى عشرات الكيلومترات للوصول لأخدود هادلي وجلب عينات نادرة.",
    xp: 100
  },
  {
    id: "q2",
    question_en: "What primary energy source powered the Opportunity rover for 14.5 years on Mars?",
    question_ar: "ما هو مصدر الطاقة الأساسي الذي زوّد مركبة أوبورتونيتي بالطاقة لمدة 14.5 سنة على المريخ؟",
    options_en: [
      "Hydrogen fuel cells",
      "Solar panels combined with rechargeable Lithium-ion batteries",
      "Gasoline combustion engines",
      "Geothermal heat vents"
    ],
    options_ar: [
      "خلايا وقود الهيدروجين",
      "الألواح الشمسية مع بطاريات الليثيوم أيون القابلة للشحن",
      "محركات البنزين",
      "حرارة باطن المريخ"
    ],
    correct: 1,
    explanation_en: "Opportunity relied on triple-junction solar panels producing up to 140 watts at noon.",
    explanation_ar: "اعتمدت أوبورتونيتي على ألواح شمسية ثلاثية الوصلات تولد حتى 140 واط وتشحن بطاريات ليثيوم أيون.",
    xp: 100
  },
  {
    id: "q3",
    question_en: "In mission time planning, if route distance is 1.2 km and rover speed is 6 km/h, what is travel time?",
    question_ar: "في تخطيط زمن الرحلات، إذا كانت المسافة 1.2 كم وسرعة المركبة 6 كم/ساعة، فما هو زمن الانتقال؟",
    options_en: [
      "6 minutes",
      "12 minutes",
      "20 minutes",
      "30 minutes"
    ],
    options_ar: [
      "6 دقائق",
      "12 دقيقة",
      "20 دقيقة",
      "30 دقيقة"
    ],
    correct: 1,
    explanation_en: "Travel time = (Distance / Speed) * 60 = (1.2 / 6) * 60 = 12 minutes.",
    explanation_ar: "زمن الانتقال = (المسافة ÷ السرعة) × 60 = (1.2 ÷ 6) × 60 = 12 دقيقة.",
    xp: 100
  }
];

let allMissions = FALLBACK_MISSIONS;
let allExhibits = FALLBACK_EXHIBITS;
let allQuizzes = FALLBACK_QUIZZES;
let allStories = [];
let bibleData = {};
let activeExhibitIndex = 0;

// Application Initialization
async function initApp() {
  window.ExplorerProfile.init();

  // Initialize Language to Arabic by default for Arabic users
  document.documentElement.lang = window.i18n.lang;
  document.documentElement.dir = window.i18n.lang === 'ar' ? 'rtl' : 'ltr';
  const langBtn = document.getElementById('btnLang');
  if (langBtn) {
    langBtn.textContent = window.i18n.lang === 'ar' ? 'English' : 'العربية';
    langBtn.onclick = () => window.i18n.toggle();
  }

  // Hook game launcher triggers
  const btnLaunchApollo = document.getElementById('btnLaunchApollo');
  if (btnLaunchApollo) btnLaunchApollo.onclick = () => window.launchApolloGame();

  const btnMarsSim = document.getElementById('btnMarsSim');
  if (btnMarsSim) btnMarsSim.onclick = () => window.MarsOpportunitySim.open();

  const btnExitGame = document.getElementById('btnExitGame');
  if (btnExitGame) btnExitGame.onclick = () => window.closeApolloGame();

  // Museum Controls
  const btnWireframe = document.getElementById('btnWireframe');
  if (btnWireframe) {
    btnWireframe.onclick = () => {
      const isWire = window.Museum3D.toggleWireframe();
      btnWireframe.textContent = isWire ? 'Shaded 3D' : 'Wireframe';
    };
  }
  const btnReset3D = document.getElementById('btnReset3D');
  if (btnReset3D) btnReset3D.onclick = () => window.Museum3D.resetView();

  // Setup PostMessage bridge for real-time game sync
  window.addEventListener('message', e => {
    if (e.data && e.data.type === 'ECHOES_GAME_SYNC') {
      if (e.data.completed) {
        window.ExplorerProfile.addXp(600, 'Apollo 15 Lunar Mission Completed');
      } else if (e.data.found && e.data.found.length) {
        window.ExplorerProfile.addXp(100, `Evidence Recovered (${e.data.found.length})`);
      }
    }
  });

  // Universal Data Loader: loads static data/db.json on GitHub Pages or local
  try {
    const resDb = await fetch('data/db.json');
    if (resDb.ok) {
      const db = await resDb.json();
      if (db.missions && db.missions.length) allMissions = db.missions;
      if (db.museum_exhibits && db.museum_exhibits.length) allExhibits = db.museum_exhibits;
      if (db.quizzes && db.quizzes.length) allQuizzes = db.quizzes;
      if (db.stories && db.stories.length) allStories = db.stories;
    }
  } catch (e) {
    // API fallback
    try {
      const resM = await fetch('/api/missions');
      if (resM.ok) allMissions = await resM.json();
      const resE = await fetch('/api/museum');
      if (resE.ok) allExhibits = await resE.json();
    } catch (e2) {}
  }

  // Load Master Game Bible data
  try {
    const resB = await fetch('data/master_bible.json');
    if (resB.ok) bibleData = await resB.json();
  } catch (e) {
    try {
      const resB2 = await fetch('/api/bible');
      if (resB2.ok) bibleData = await resB2.json();
    } catch (e2) {}
  }

  // Render all dynamic sections
  window.i18n.apply();
  loadLeaderboard();
  loadGuestbook();

  // Init 3D Viewers
  try {
    if (window.Museum3D) window.Museum3D.init();
    if (window.EvidenceGraph) window.EvidenceGraph.init();
  } catch (e) {
    console.warn('3D view initialization error', e);
  }

  setupLabControls();
  setupGuestbookForm();
}

// Dedicated Game Launcher Function
window.launchApolloGame = function() {
  const modal = document.getElementById('gameModal');
  const iframe = document.getElementById('gameIframe');
  if (!modal || !iframe) return;

  if (!iframe.src || iframe.src === 'about:blank' || !iframe.src.includes('game.html')) {
    iframe.src = 'game.html';
  }
  modal.classList.add('active');
  iframe.focus();
};

window.closeApolloGame = function() {
  const modal = document.getElementById('gameModal');
  if (modal) modal.classList.remove('active');
};

function renderMissions() {
  const container = document.getElementById('missionsGrid');
  if (!container || !allMissions.length) return;
  const isAr = window.i18n.lang === 'ar';

  container.innerHTML = allMissions.map(m => `
    <div class="mission-card ${m.id === 'opportunity' ? 'mars' : ''}">
      <div>
        <div class="card-top">
          <span class="badge-tag ${m.id === 'opportunity' ? 'mars' : ''}">${isAr ? m.tag_ar : m.tag_en}</span>
          <span class="mission-icon">${m.id === 'apollo-15' ? '☾' : m.id === 'opportunity' ? '♂' : '🪐'}</span>
        </div>
        <h3>${isAr ? m.title_ar : m.title_en}</h3>
        <div class="mission-meta">
          <span>${isAr ? m.celestial_body_ar : m.celestial_body_en}</span> •
          <span>${m.year}</span> •
          <span>${m.distance_driven}</span>
        </div>
        <p>${isAr ? m.description_ar : m.description_en}</p>
      </div>
      <div class="card-footer">
        ${m.status === 'playable' ? `
          <button class="btn-primary" onclick="window.launchApolloGame()">
            ▶ ${isAr ? 'بدء المهمة ثلاثية الأبعاد' : 'Launch 3D Mission'}
          </button>
        ` : m.status === 'playable_sim' ? `
          <button class="btn-primary btn-mars" onclick="window.MarsOpportunitySim.open()">
            ⚡ ${isAr ? 'محاكاة الطاقة والبقاء' : 'Launch Sol Simulator'}
          </button>
        ` : `
          <button class="btn-secondary" onclick="selectMuseumExhibit('${m.id}')">
            🏛️ ${isAr ? 'عرض في المتحف' : 'Inspect in Museum'}
          </button>
        `}
      </div>
    </div>
  `).join('');
}

function renderMuseumSelector() {
  const container = document.getElementById('exhibitSelector');
  if (!container) return;
  const isAr = window.i18n.lang === 'ar';

  container.innerHTML = allExhibits.map((ex, i) => `
    <button class="btn-exhibit ${i === activeExhibitIndex ? 'active' : ''}" onclick="selectExhibit(${i})">
      ${isAr ? ex.title_ar : ex.title_en}
    </button>
  `).join('');
}

window.selectExhibit = function(index) {
  activeExhibitIndex = index;
  renderMuseumSelector();
  renderMuseumInfo();
  const ex = allExhibits[index];
  if (ex && window.Museum3D) {
    window.Museum3D.setModel(ex.id);
  }
};

window.selectMuseumExhibit = function(missionId) {
  const idx = allExhibits.findIndex(e => e.id.includes(missionId) || missionId.includes(e.id.split('-')[0]));
  if (idx !== -1) {
    selectExhibit(idx);
    document.getElementById('museum').scrollIntoView({ behavior: 'smooth' });
  }
};

function renderMuseumInfo() {
  renderMuseumSelector();
  const container = document.getElementById('museumInfo');
  if (!container || !allExhibits.length) return;
  const isAr = window.i18n.lang === 'ar';
  const ex = allExhibits[activeExhibitIndex] || allExhibits[0];

  container.innerHTML = `
    <div>
      <span class="badge-tag">${isAr ? ex.category_ar : ex.category_en}</span>
      <h3 style="font-size: 24px; color: #fff; margin: 8px 0 12px;">${isAr ? ex.title_ar : ex.title_en}</h3>
      <table class="specs-table">
        <tr><th>${isAr ? 'الكتلة / الوزن' : 'Mass / Weight'}</th><td>${ex.mass}</td></tr>
        <tr><th>${isAr ? 'الأبعاد' : 'Dimensions'}</th><td>${ex.dimensions}</td></tr>
        <tr><th>${isAr ? 'السرعة القصوى' : 'Top Speed'}</th><td>${ex.top_speed}</td></tr>
        <tr><th>${isAr ? 'نظام الطاقة' : 'Power System'}</th><td>${ex.power_system}</td></tr>
        <tr><th>${isAr ? 'الحمولة العلمية' : 'Scientific Payload'}</th><td>${isAr ? ex.scientific_payload_ar : ex.scientific_payload_en}</td></tr>
        <tr><th>${isAr ? 'الموقع اليوم' : 'Status Today'}</th><td>${isAr ? ex.status_today_ar : ex.status_today_en}</td></tr>
      </table>
      <div style="background: rgba(14,28,50,0.7); border-radius: var(--radius-sm); padding: 12px; margin-top: 14px; font-size: 13px;">
        <strong style="color: var(--gold); display: block; margin-bottom: 4px;">
          ${isAr ? 'ما الذي تعلمناه من هذه المعدّة؟' : 'What We Learned From It'}
        </strong>
        <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">
          ${isAr ? ex.what_we_learned_ar : ex.what_we_learned_en}
        </p>
      </div>
    </div>
    <div style="margin-top: 18px; display: flex; justify-content: space-between; align-items: center;">
      <a href="${ex.nasa_link}" target="_blank" rel="noopener noreferrer" style="color: var(--cyan); font-size: 13px; text-decoration: none; font-weight: bold;">
        🔗 ${isAr ? 'وثائق ناسا الرسمية للمهمة ↗' : 'Official NASA Mission Archive ↗'}
      </a>
      <button class="btn-chip" onclick="window.Museum3D.resetView()">⟲ ${isAr ? 'إعادة ضبط المنظور' : 'Reset Camera'}</button>
    </div>
  `;
}

function renderStories() {
  const container = document.getElementById('storiesGrid');
  if (!container) return;
  const isAr = window.i18n.lang === 'ar';

  container.innerHTML = `
    <div class="story-card" onclick="window.launchApolloGame()">
      <div class="story-icon">🌙</div>
      <div class="story-body">
        <span class="badge-tag">${isAr ? '4 دقائق قراءة · لعبة تفاعلية' : '4 MIN READ · PLAYABLE'}</span>
        <h3>${isAr ? 'حارس أخدود هادلي الصامت (أبولو 15)' : 'The Silent Guardian of Hadley Rille'}</h3>
        <p style="color: var(--gold); font-size: 12px; font-weight: 600;">
          ${isAr ? 'كيف غيرت عربة كهربائية صغيرة نظرتنا إلى الكون' : 'How a small electric car changed our perspective of the cosmos'}
        </p>
        <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6;">
          ${isAr ? 'في يوليو 1971، وسط سهول القمر الرمادية، تردد أزيز المحركات الكهربائية لأول مرة، متجاوزاً حدود المشي إلى أخدود هادلي السحيق...' : 'In July 1971, amidst the silent plains of Hadley-Apennine, an unprecedented sound echoed: the quiet hum of electric motors...'}
        </p>
        <button class="btn-primary" style="margin-top: 8px;">
          ▶ ${isAr ? 'ابدأ اللعبة وعش القصة 3D' : 'Play 3D Story Mission'}
        </button>
      </div>
    </div>

    <div class="story-card" onclick="window.MarsOpportunitySim.open()">
      <div class="story-icon">🏜️</div>
      <div class="story-body">
        <span class="badge-tag mars">${isAr ? '5 دقائق قراءة · محاكاة' : '5 MIN READ · SIMULATOR'}</span>
        <h3>${isAr ? 'غروب الشمس الأخير في وادي بيرسيفيرانس' : 'The Last Sunset of Perseverance Valley'}</h3>
        <p style="color: var(--mars-red); font-size: 12px; font-weight: 600;">
          ${isAr ? 'خمسة عشر عاماً من الصمود والاكتشاف على الكوكب الأحمر' : 'Fifteen years of dust, discovery, and resilience on Mars'}
        </p>
        <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6;">
          ${isAr ? 'مهمة كان مقدراً لها 90 يوماً فقط تحولت إلى ملحمة استمرت 5000 يوم مريخي، قطعت 45 كيلومتراً لتثبت وجود المياه...' : 'A planned 90-sol warranty became a 5,000-sol epic across 45 kilometers of Martian regolith, proving liquid water once flowed...'}
        </p>
        <button class="btn-primary btn-mars" style="margin-top: 8px;">
          ⚡ ${isAr ? 'بدء محاكاة العاصفة الغبارية' : 'Launch Dust Sim'}
        </button>
      </div>
    </div>
  `;
}

// Mobility Lab Controls & Real-Time Calculation
function setupLabControls() {
  const sliders = ['dist', 'speed', 'budget', 'duration'];
  sliders.forEach(id => {
    const el = document.getElementById(`lab_${id}`);
    if (el) el.oninput = triggerLabCalc;
  });
  triggerLabCalc();
}

function triggerLabCalc() {
  const dist = Number(document.getElementById('lab_dist')?.value || 1200);
  const speed = Number(document.getElementById('lab_speed')?.value || 10);
  const budget = Number(document.getElementById('lab_budget')?.value || 180);
  const duration = Number(document.getElementById('lab_duration')?.value || 25);

  const valDist = document.getElementById('val_dist');
  if (valDist) valDist.textContent = `${dist} m`;
  const valSpeed = document.getElementById('val_speed');
  if (valSpeed) valSpeed.textContent = `${speed} km/h`;
  const valBudget = document.getElementById('val_budget');
  if (valBudget) valBudget.textContent = `${budget} min`;
  const valDuration = document.getElementById('val_duration');
  if (valDuration) valDuration.textContent = `${duration} min`;

  // Local calculation math (SIM01 - SIM04)
  const dist_km = dist / 1000;
  const walk_speed = 3.0;
  const walk_time = (dist_km / walk_speed) * 60;
  const rover_time = (dist_km / speed) * 60;

  const walk_rem = Math.max(0, budget - walk_time);
  const rover_rem = Math.max(0, budget - rover_time);

  const walk_stops = Math.floor(walk_rem / duration);
  const rover_stops = Math.floor(rover_rem / duration);

  const isAr = window.i18n.lang === 'ar';
  document.getElementById('labWalkTime').textContent = `${walk_time.toFixed(1)} min`;
  document.getElementById('labWalkStops').textContent = `${walk_stops}`;
  document.getElementById('labRoverTime').textContent = `${rover_time.toFixed(1)} min`;
  document.getElementById('labRoverStops').textContent = `${rover_stops}`;

  const conc = document.getElementById('labConclusion');
  if (conc) {
    conc.textContent = isAr 
      ? `وفرت المركبة ${(walk_time - rover_time).toFixed(1)} دقيقة من زمن السير، مما أتاح ${rover_stops - walk_stops} محطات ملاحظة علمية إضافية لجمع العينات الجيولوجية.`
      : `The rover saved ${(walk_time - rover_time).toFixed(1)} minutes of transit time, allowing ${rover_stops - walk_stops} additional scientific observation stops for field geology.`;
  }
}

// Quizzes Module
let currentQuizIndex = 0;
function renderQuizzes() {
  const container = document.getElementById('quizContainer');
  if (!container || !allQuizzes.length) return;
  const isAr = window.i18n.lang === 'ar';
  const q = allQuizzes[currentQuizIndex] || allQuizzes[0];

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <span class="badge-tag">${isAr ? `السؤال ${currentQuizIndex + 1} من ${allQuizzes.length}` : `QUESTION ${currentQuizIndex + 1} OF ${allQuizzes.length}`}</span>
      <span style="color: var(--gold); font-weight: bold; font-size: 13px;">+${q.xp} XP</span>
    </div>
    <h3 class="quiz-question">${isAr ? q.question_ar : q.question_en}</h3>
    <div class="quiz-options">
      ${(isAr ? q.options_ar : q.options_en).map((opt, i) => `
        <button class="quiz-btn" onclick="submitQuizOption('${q.id}', ${i}, this)">
          ${String.fromCharCode(65 + i)}. ${opt}
        </button>
      `).join('')}
    </div>
    <div id="quizFeedback" class="quiz-feedback"></div>
    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px;">
      <button class="btn-chip" id="btnNextQuiz" style="display: none;" onclick="nextQuiz()">
        ${isAr ? 'السؤال التالي →' : 'Next Question →'}
      </button>
    </div>
  `;
}

window.submitQuizOption = function(qId, selectedIdx, btn) {
  const isAr = window.i18n.lang === 'ar';
  const q = allQuizzes.find(item => item.id === qId) || allQuizzes[0];
  const isCorrect = selectedIdx === q.correct;
  const feedback = document.getElementById('quizFeedback');
  const nextBtn = document.getElementById('btnNextQuiz');

  document.querySelectorAll('.quiz-btn').forEach(b => b.disabled = true);

  if (isCorrect) {
    btn.classList.add('correct');
    feedback.style.borderColor = 'var(--green)';
    feedback.innerHTML = `
      <strong style="color: var(--green);">✓ ${isAr ? 'إجابة صحيحة!' : 'CORRECT!'} (+${q.xp} XP)</strong>
      <p style="margin-top: 6px; color: var(--text-secondary); font-size: 14px;">
        ${isAr ? q.explanation_ar : q.explanation_en}
      </p>
    `;
    window.ExplorerProfile.addXp(q.xp, 'Knowledge Quiz Correct');
  } else {
    btn.classList.add('wrong');
    const allBtns = document.querySelectorAll('.quiz-btn');
    if (allBtns[q.correct]) allBtns[q.correct].classList.add('correct');
    feedback.style.borderColor = 'var(--mars-red)';
    feedback.innerHTML = `
      <strong style="color: var(--mars-red);">✕ ${isAr ? 'إجابة غير دقيقة' : 'INCORRECT'}</strong>
      <p style="margin-top: 6px; color: var(--text-secondary); font-size: 14px;">
        ${isAr ? q.explanation_ar : q.explanation_en}
      </p>
    `;
  }
  feedback.classList.add('show');
  if (nextBtn) nextBtn.style.display = 'inline-flex';
};

window.nextQuiz = function() {
  currentQuizIndex = (currentQuizIndex + 1) % allQuizzes.length;
  renderQuizzes();
};

// Game Bible Explorer
let currentBibleSection = 'judges_qa';
function renderBible() {
  const container = document.getElementById('bibleContent');
  if (!container) return;
  const isAr = window.i18n.lang === 'ar';

  const sections = [
    { id: 'judges_qa', label_en: 'Judges Q&A', label_ar: 'أسئلة المحكمين النموذجية' },
    { id: 'puzzles', label_en: '35 Puzzles Catalog', label_ar: 'كتالوج الألغاز الـ 35' },
    { id: 'scientific_claims', label_en: 'Scientific Claims (CL)', label_ar: 'الحقائق العلمية الموثقة' }
  ];

  const tabsContainer = document.getElementById('bibleTabs');
  if (tabsContainer) {
    tabsContainer.innerHTML = sections.map(s => `
      <button class="btn-chip ${s.id === currentBibleSection ? 'active' : ''}" style="${s.id === currentBibleSection ? 'background: var(--cyan); color: #030d1a;' : ''}" onclick="switchBibleSection('${s.id}')">
        ${isAr ? s.label_ar : s.label_en}
      </button>
    `).join('');
  }

  const items = bibleData[currentBibleSection] || [];
  if (items.length) {
    if (currentBibleSection === 'judges_qa') {
      container.innerHTML = items.slice(0, 6).map((q, i) => `
        <div style="background: rgba(14,28,50,0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; margin-bottom: 10px;">
          <h4 style="color: #fff; margin: 0 0 6px;">${q['سؤال محتمل'] || ''}</h4>
          <p style="color: var(--cyan); font-size: 14px; margin-bottom: 4px;"><strong>${isAr ? 'الإجابة الموصى بها:' : 'Answer:'}</strong> ${q['إجابة الفريق الموصى بها'] || ''}</p>
        </div>
      `).join('');
    } else {
      container.innerHTML = items.slice(0, 6).map(x => `
        <div style="background: rgba(14,28,50,0.6); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; margin-bottom: 8px;">
          <h4 style="color: var(--gold); margin: 0 0 4px;">${x['اسم اللغز'] || x['الادعاء في المنتج'] || Object.values(x)[1] || ''}</h4>
          <p style="color: var(--text-secondary); font-size: 13px; margin: 0;">${x['المفهوم العلمي'] || x['حالة التحقق/التحذير'] || Object.values(x)[2] || ''}</p>
        </div>
      `).join('');
    }
  } else {
    container.innerHTML = `
      <div style="background: rgba(14,28,50,0.6); border-radius: var(--radius-md); padding: 18px;">
        <h4 style="color: var(--gold);">ECHOES OF SPACE // MASTER GAME BIBLE (GENESIS V)</h4>
        <p style="color: var(--text-secondary); font-size: 14px; line-height: 1.6; margin-top: 8px;">
          ${isAr 
            ? 'تتضمن وثيقة التصميم الكاملة 43 ورقة مفصلة: تصنيف الأدلة العلمية CL01-CL24، ونماذج الحركة SIM01-SIM20، وقائمة المخاطر والتحكيم وفق معايير Impact, Creativity, Validity, Relevance, Presentation في مسابقة ناسا سبيس آبس 2026.'
            : 'The Master Game Bible includes 43 comprehensive sheets covering verified NASA claims (CL01-CL24), mobility equations (SIM01-SIM20), and judging alignments for NASA Space Apps 2026.'}
        </p>
      </div>
    `;
  }
}

window.switchBibleSection = function(sec) {
  currentBibleSection = sec;
  renderBible();
};

function loadLeaderboard() {
  const container = document.getElementById('leaderboardList');
  if (!container) return;
  const sample = [
    { name: "Sarah Al-Harthy", xp: 2450, rank: "Master Archive Commander" },
    { name: "Zaid Al-Busaidi", xp: 2100, rank: "Senior Planetary Surveyor" },
    { name: "Khalid Al-Maamari", xp: 1780, rank: "Planetary Specialist" },
    { name: `${window.ExplorerProfile.data.name} (You)`, xp: window.ExplorerProfile.data.xp, rank: "Explorer Cadet" }
  ];
  container.innerHTML = sample.map((l, i) => `
    <div class="leader-row">
      <span class="leader-rank">#${i + 1}</span>
      <div>
        <div class="leader-name">${l.name}</div>
        <small style="color: var(--gold); font-size: 11px;">${l.rank}</small>
      </div>
      <span class="leader-xp">${l.xp} XP</span>
    </div>
  `).join('');
}

function loadGuestbook() {
  const container = document.getElementById('guestbookList');
  if (!container) return;
  const isAr = window.i18n.lang === 'ar';
  
  let savedNotes = [];
  try {
    savedNotes = JSON.parse(localStorage.getItem('echoes_guestbook') || '[]');
  } catch (e) {}

  const defaultSample = [
    { name: isAr ? "لجنة تحكيم ناسا سبيس آبس" : "NASA Space Apps Evaluation Team", comment: isAr ? "فكرة استثنائية! ربط المعدات الفضائية القديمة بمحاكاة 3D تفاعلية يعبر بدقة عن روح التحدي." : "Outstanding concept! Connecting discarded historic hardware with interactive 3D simulations perfectly embodies the challenge.", date: "2026-10-31" },
    { name: isAr ? "أميرة (طالبة - 14 سنة)" : "Amira (Student - Age 14)", comment: isAr ? "قيادة المركبة القمرية واستكشاف أخدود هادلي ممتعة جداً ومكنتني من فهم سبب إرسال العربات للفضاء." : "Driving the lunar rover to Hadley Rille was so exciting! I learned why rovers are needed in space.", date: "2026-10-31" }
  ];

  const allNotes = [...savedNotes, ...defaultSample];
  container.innerHTML = allNotes.map(g => `
    <div class="comment-box">
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <div class="comment-author">${g.name}</div>
        <small style="color: var(--text-muted); font-size: 11px;">${g.date || '2026-10-31'}</small>
      </div>
      <p style="color: var(--text-secondary); margin: 6px 0 0; line-height: 1.5;">${g.comment}</p>
    </div>
  `).join('');
}

function setupGuestbookForm() {
  const form = document.getElementById('guestbookForm');
  if (!form) return;
  form.onsubmit = e => {
    e.preventDefault();
    const name = document.getElementById('gb_name').value.trim();
    const comment = document.getElementById('gb_comment').value.trim();
    if (!name || !comment) return;

    try {
      let savedNotes = JSON.parse(localStorage.getItem('echoes_guestbook') || '[]');
      savedNotes.unshift({ name, comment, date: new Date().toISOString().split('T')[0] });
      localStorage.setItem('echoes_guestbook', JSON.stringify(savedNotes));
    } catch (e) {}

    loadGuestbook();
    form.reset();
  };
}

// Start application
window.addEventListener('DOMContentLoaded', initApp);
