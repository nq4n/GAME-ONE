import json
import os

db = {
    "missions": [
        {
            "id": "apollo-15",
            "title_en": "Apollo 15: The Silent Rover",
            "title_ar": "أبولو 15: المركبة القمرية الصامتة",
            "celestial_body_en": "Moon (Hadley–Apennine)",
            "celestial_body_ar": "القمر (هادلي–أبينين)",
            "year": 1971,
            "status": "playable",
            "equipment_en": "Lunar Roving Vehicle (LRV-1)",
            "equipment_ar": "المركبة القمرية الجوالة (LRV-1)",
            "distance_driven": "27.9 km",
            "tag_en": "Mobility & Geology",
            "tag_ar": "الحركة والجيولوجيا",
            "description_en": "The first Apollo mission to bring a manned rover to the Moon. In July 1971, astronauts David Scott and James Irwin drove 27.9 km across the Hadley-Apennine region, expanding field exploration from hundreds of meters to dozens of kilometers.",
            "description_ar": "أول بعثة أبولو تنقل مركبة مأهولة إلى القمر. في يوليو 1971، قاد رائدا الفضاء ديفيد سكوت وجيمس إروين مسافة 27.9 كم عبر منطقة هادلي-أبينين، مما وسع نطاق الاستكشاف الميداني من مئات الأمتار إلى عشرات الكيلومترات.",
            "hero_image": "/assets/hero-rover.jpg",
            "historical_facts_en": [
                "Total distance traversed: 27.9 km (longest single traverse was 12.5 km).",
                "Weight on Earth: 210 kg (only 35 kg under lunar gravity 1/6 g).",
                "Four 0.25-horsepower electric drive motors, one in each wheel hub.",
                "Discovered the famous 'Genesis Rock' (Sample 15415), an anorthosite dating back 4 billion years.",
                "The rover was left parked 100 meters away from the Lunar Module to film the ascent stage lift-off with its color TV camera."
            ],
            "historical_facts_ar": [
                "إجمالي المسافة المقطوعة: 27.9 كم (كان أطول مسار منفرد 12.5 كم).",
                "الوزن على الأرض: 210 كجم (فقط 35 كجم تحت تأثير جاذبية القمر 1/6 g).",
                "أربعة محركات كهربائية بقدرة 0.25 حصان لكل محور عجلة.",
                "اكتشاف 'حجر سفر التكوين' الشهير (العينة 15415)، وهو صخر أنورثوسايت عمره 4 مليارات سنة.",
                "رُكنت المركبة على مسافة 100 متر من المركبة القمرية لتصوير لحظة إقلاع مرحلة الصعود بكاميرتها التلفزيونية."
            ],
            "evidence_signals": [
                {
                    "id": "C01",
                    "title_en": "Mobility Powertrain",
                    "title_ar": "نظام الحركة والدفع الكهربائي",
                    "xp": 100,
                    "desc_en": "Four independent DC wheel motors and wire-mesh chevron-tread titanium tires designed to navigate powdery regolith without pneumatic air pressure.",
                    "desc_ar": "أربعة محركات كهربائية مستقلة وعجلات شبكية مرنة من التيتانيوم مصممة للتحرك فوق الغبار القمري دون الحاجة لضغط الهواء."
                },
                {
                    "id": "C02",
                    "title_en": "Scientific Exploration Tools",
                    "title_ar": "حزمة الأدوات العلمية الميدانية",
                    "xp": 100,
                    "desc_en": "Deep core lunar drill, 500mm Hasselblad telephoto camera, gnomon calibration device, and lunar surface sample collection tongs.",
                    "desc_ar": "مثقاب أعماق التربة القمرية، وكاميرا هاسلبلاد المقربة، وجهاز عيار الظلال (Gnomon)، وملاقط جمع العينات الصخرية."
                },
                {
                    "id": "C03",
                    "title_en": "Field Science Range",
                    "title_ar": "توسيع النطاق العلمي الميداني",
                    "xp": 100,
                    "desc_en": "Allowed scientists on Earth and astronauts on the surface to reach the steep slopes of Mount Hadley Delta and the sheer 300m drop of Hadley Rille gorge.",
                    "desc_ar": "أتاح للعلماء على الأرض والرواد على السطح بلوغ منحدرات جبل هادلي دلتا الوعرة وحافة أخدود هادلي السحيق بعمق 300 متر."
                },
                {
                    "id": "C04",
                    "title_en": "Genesis Rock Cache",
                    "title_ar": "عينة سفر التكوين الجيولوجية",
                    "xp": 150,
                    "desc_en": "Secret geological cache demonstrating how mobile rovers enable discovery of rare pristine primordial crust materials.",
                    "desc_ar": "دليل جيولوجي استثنائي يبرهن كيف مكنت العربة الجوالة من العثور على أندر قطع القشرة القمرية الأصلية."
                }
            ],
            "routes": [
                {
                    "id": "safe",
                    "name_en": "Route A: Hadley Plains (Safe)",
                    "name_ar": "المسار أ: سهول هادلي (الآمن)",
                    "distance_m": 1300,
                    "terrain_en": "Smooth regolith, minimal crater clusters, steady steering.",
                    "terrain_ar": "تربة ناعمة، قليل من الفوهات الصخرية، توجيه مريح.",
                    "speed_kmh": 10
                },
                {
                    "id": "ridge",
                    "name_en": "Route B: Apennine Ridge (Shortcut)",
                    "name_ar": "المسار ب: اختصار التلال الجبلية",
                    "distance_m": 900,
                    "terrain_en": "Steep slopes, high boulder density, difficult handling.",
                    "terrain_ar": "منحدرات حادة، كثافة صخرية عالية، قيادة تتطلب تركيزاً.",
                    "speed_kmh": 7
                },
                {
                    "id": "science",
                    "name_en": "Route C: Rille Overlook (Science Detour)",
                    "name_ar": "المسار ج: أخدود هادلي (المسار العلمي)",
                    "distance_m": 1600,
                    "terrain_en": "Longer distance, rich scientific caches, maximum field observations.",
                    "terrain_ar": "مسافة أطول، محطات علمية ثرية، أعلى فرصة ملاحظات.",
                    "speed_kmh": 9
                }
            ]
        },
        {
            "id": "opportunity",
            "title_en": "Opportunity: The 15-Year Sol Journey",
            "title_ar": "أوبورتونيتي: رحلة الـ 15 عاماً على المريخ",
            "celestial_body_en": "Mars (Meridiani Planum)",
            "celestial_body_ar": "المريخ (سهل ميريدياني)",
            "year": "2004–2018",
            "status": "playable_sim",
            "equipment_en": "Mars Exploration Rover (MER-B)",
            "equipment_ar": "مركبة استكشاف المريخ (MER-B)",
            "distance_driven": "45.16 km (Off-Earth Driving Record)",
            "tag_en": "Solar Energy & Survival",
            "tag_ar": "الطاقة الشمسية والبقاء",
            "description_en": "Landed on Mars in January 2004 for a planned 90-day mission. Defying all odds, it operated for over 5,000 Martian Sols (14.5 Earth years) across 45.16 kilometers, discovering definitive sedimentary evidence that liquid water once flowed on ancient Mars.",
            "description_ar": "هبطت على المريخ في يناير 2004 لمهمة كان مخططاً لها 90 يوماً فقط. لكنها تجاوزت كل التوقعات وعملت لأكثر من 5000 يوم مريخي (14.5 سنة أرضية) وقطعت 45.16 كيلومتراً، لتكتشف أدلة قاطعة على جريان المياه السائلة في ماضي المريخ.",
            "hero_image": "/assets/hero-rover.jpg",
            "historical_facts_en": [
                "Landed in Eagle Crater and immediately discovered hematite 'blueberries' formed in water.",
                "Survived harsh Martian winters and cleanings by 'dust devils' that swept its solar panels.",
                "Total odometer: 45.16 km, breaking the Soviet Lunokhod 2 off-world distance record.",
                "In June 2018, a catastrophic planet-encircling dust storm engulfed Mars, dropping sunlight by 99%.",
                "Final transmission received on June 10, 2018 at Perseverance Valley. NASA officially concluded mission Feb 13, 2019."
            ],
            "historical_facts_ar": [
                "هبطت داخل فوهة إيغل وعثرت فوراً على كرات الهيماتيت 'العنب البري' المتكونة بالماء.",
                "صمدت أمام فصول الشتاء القاسية واستفادت من دوامات الغبار التي نظفت ألواحها الشمسية.",
                "إجمالي المسافة: 45.16 كم، محطمة الرقم القياسي لمركبة لونوخود 2 السوفيتية.",
                "في يونيو 2018، ضربت عاصفة غبارية كوكبية خفضت ضوء الشمس بأكثر من 99%.",
                "آخر إشارة وردت في 10 يونيو 2018 في وادي بيرسيفيرانس، وأعلنت ناسا انتهاء المهمة في 13 فبراير 2019."
            ],
            "sols": [
                {
                    "sol": 1,
                    "title_en": "Sol 1: Clear Horizons",
                    "title_ar": "اليوم 1: أفق نقي وطاقة وافرة",
                    "dust_level": 0.15,
                    "solar_generation": 650,
                    "battery_capacity": 600,
                    "desc_en": "Solar generation is high at 650 Wh. Choose your instrument payload and travel speed.",
                    "desc_ar": "التوليد الشمسي ممتاز بمعدل 650 واط/ساعة. اختر تخصيص الطاقة بين الحركة والأجهزة."
                },
                {
                    "sol": 2,
                    "title_en": "Sol 2: Dust Clouds Rising",
                    "title_ar": "اليوم 2: رياح الغبار تتجمع",
                    "dust_level": 0.40,
                    "solar_generation": 450,
                    "battery_capacity": 600,
                    "desc_en": "Atmospheric tau index increases. Solar generation falls to 450 Wh. Trade-offs between APXS spectroscopy and radio link.",
                    "desc_ar": "ارتفاع نسبة الغبار في الجو، وانخفاض الطاقة إلى 450 واط/ساعة. يلزم الموازنة بين التحليل الطيفي والاتصال."
                },
                {
                    "sol": 3,
                    "title_en": "Sol 3: The Gathering Storm",
                    "title_ar": "اليوم 3: اشتداد العاصفة الكوكبية",
                    "dust_level": 0.72,
                    "solar_generation": 210,
                    "battery_capacity": 600,
                    "desc_en": "Severe dust storm blocking sunlight. Power generation drops to 210 Wh. Heating the electronics must be prioritized.",
                    "desc_ar": "عاصفة تحجب معظم الضوء. التوليد يهبط إلى 210 واط/ساعة. يجب تدفئة النظم الداخلية لمنع تجمد البطاريات."
                },
                {
                    "sol": 4,
                    "title_en": "Sol 4: Final Transmission",
                    "title_ar": "اليوم 4: الإشارة الأخيرة من وادي بيرسيفيرانس",
                    "dust_level": 0.90,
                    "solar_generation": 88,
                    "battery_capacity": 600,
                    "desc_en": "Daylight is fading into dark twilight. Total generation only 88 Wh. Preserve critical reserve to transmit telemetry back to Deep Space Network.",
                    "desc_ar": "السماء تتحول إلى ظلام دامس. الطاقة 88 واط/ساعة فقط. حافظ على الاحتياطي لإرسال آخر حزمة بيانات إلى الأرض."
                }
            ]
        },
        {
            "id": "insight",
            "title_en": "InSight: The Seismic Heart of Mars",
            "title_ar": "إنسايت: الاستماع لنبض المريخ الداخلي",
            "celestial_body_en": "Mars (Elysium Planitia)",
            "celestial_body_ar": "المريخ (إليسيوم بلانيشيا)",
            "year": "2018–2022",
            "status": "museum",
            "equipment_en": "SEIS Seismometer & Heat Flow Probe",
            "equipment_ar": "مقياس الزلازل SEIS ومسبار التدفق الحراري",
            "distance_driven": "Stationary Lander",
            "tag_en": "Geophysics & Marsquakes",
            "tag_ar": "الجيوفيزياء وزلازل المريخ",
            "description_en": "NASA's stationary geophysical observatory on Mars. Using its ultra-sensitive French-built SEIS instrument under a vacuum dome, InSight recorded over 1,319 marsquakes, mapping the planet's layered crust, mantle, and giant liquid core.",
            "description_ar": "مرصد جيوفيزيائي ثابت على المريخ. باستخدام جهاز قياس الزلازل الفرنسي الفائق الحساسية SEIS المحمي بقبة عازلة، سجلت إنسايت أكثر من 1319 زلزالاً مريخياً، ورسمت خارطة لقشرة الكوكب ووشاحه ولبه السائل العملاق.",
            "hero_image": "/assets/hero-rover.jpg",
            "historical_facts_en": [
                "Detected the largest marsquake ever recorded: magnitude 4.7 on May 4, 2022.",
                "Revealed that the Martian crust is between 24 and 72 km thick.",
                "Proved that the core of Mars is completely molten liquid with a radius of approximately 1,830 km.",
                "Dust accumulation on its solar arrays gradually reduced power from 5,000 Wh/sol to under 500 Wh/sol.",
                "Mission concluded in December 2022 after four years of groundbreaking geophysics."
            ],
            "historical_facts_ar": [
                "رصدت أكبر زلزال مسجل على كوكب آخر: بقوة 4.7 درجة في 4 مايو 2022.",
                "كشفت أن قشرة المريخ تتراوح سماكتها بين 24 و72 كم.",
                "أثبتت أن لب المريخ سائل منصهر تماماً ويبلغ نصف قطره حوالي 1830 كم.",
                "تراكم الغبار خفض طاقتها تدريجياً من 5000 واط/ساعة إلى أقل من 500 واط/ساعة.",
                "انتهت المهمة رسمياً في ديسمبر 2022 بعد أربع سنوات من الاكتشافات التاريخية."
            ]
        }
    ],
    "museum_exhibits": [
        {
            "id": "lrv-apollo15",
            "title_en": "Apollo 15 Lunar Roving Vehicle (LRV-1)",
            "title_ar": "المركبة القمرية الجوالة - أبولو 15",
            "category_en": "Manned Surface Mobility",
            "category_ar": "مركبات النقل المأهولة",
            "mass": "210 kg (Earth) / 35 kg (Moon)",
            "dimensions": "3.1 m long × 1.8 m wide × 1.14 m high",
            "top_speed": "13 km/h (8 mph)",
            "range": "65 km theoretical (restricted to walkback safety limit ~9.6 km)",
            "power_system": "Two 36-volt silver-zinc non-rechargeable batteries (121 Ah each)",
            "scientific_payload_en": "Color TV Camera with Ground Control, Lunar Drill, 500mm Telephoto Hasselblad, Magnetometer, Soil Penetrometer.",
            "scientific_payload_ar": "كاميرا تلفزيونية ملونة بتحكم أرضي، مثقاب قمري، كاميرا هاسلبلاد بعدسة 500 مم، مقياس مغناطيسية، مقياس اختراق التربة.",
            "what_we_learned_en": "Showed that mobile rovers transform lunar science from localized exploration to regional geology. Astronauts collected 77 kg of samples including the 4-billion-year-old Genesis Rock.",
            "what_we_learned_ar": "أثبتت أن المركبات الجوالة تحول الاستكشاف القمري من مجرد نقطة هبوط إلى دراسة جيولوجية إقليمية شاملة. جلب الرواد 77 كجم من العينات بما فيها حجر التكوين.",
            "status_today_en": "Remains in pristine condition at Hadley-Apennine (26.13° N, 3.63° E), designated as a historical cultural artifact.",
            "status_today_ar": "ما تزال بحالة ممتازة في موقع هادلي-أبينين على القمر، وتعد أثراً تاريخياً للإنسانية.",
            "nasa_link": "https://www.nasa.gov/mission/apollo-15/"
        },
        {
            "id": "mer-opportunity",
            "title_en": "Opportunity Rover (MER-B)",
            "title_ar": "مركبة أوبورتونيتي المريخية (MER-B)",
            "category_en": "Robotic Science Explorer",
            "category_ar": "مستكشف روبوتي للأسطح",
            "mass": "185 kg",
            "dimensions": "1.6 m long × 2.3 m wide × 1.5 m high",
            "top_speed": "5 cm/s (0.18 km/h)",
            "range": "45.16 km total over 14.5 Earth years",
            "power_system": "Gallium Arsenide Triple-Junction Solar Array (140W clear sky) + 2 Lithium-ion batteries",
            "scientific_payload_en": "Panoramic Camera (Pancam), Miniature Thermal Emission Spectrometer (Mini-TES), Mössbauer Spectrometer, Alpha Particle X-Ray Spectrometer (APXS), Rock Abrasion Tool (RAT).",
            "scientific_payload_ar": "كاميرا بانورامية (Pancam)، مطياف الانبعاث الحراري (Mini-TES)، مطياف موسباور، مطياف أشعة إكس لجسيمات ألفا (APXS)، أداة سحق الصخور (RAT).",
            "what_we_learned_en": "Confirmed that liquid, neutral-pH water once pooled on Mars' surface at Meridiani Planum, leaving behind sulfate salt deposits and hematite blueberries.",
            "what_we_learned_ar": "أثبتت قطعية وجود مياه سائلة معتدلة الحموضة كانت تغمر سطح المريخ قديماً، مخلفة رواسب كبريتية وكرات هيماتيت.",
            "status_today_en": "Resting quietly in Perseverance Valley along the western rim of Endeavour Crater.",
            "status_today_ar": "مركونة بهدوء في وادي بيرسيفيرانس على الحافة الغربية لفوهة إنديفور على المريخ.",
            "nasa_link": "https://mars.nasa.gov/mer/"
        },
        {
            "id": "insight-lander",
            "title_en": "InSight Mars Lander",
            "title_ar": "مركبة إنسايت لدراسة باطن المريخ",
            "category_en": "Geophysical Station",
            "category_ar": "محطة رصد جيوفيزيائية",
            "mass": "358 kg",
            "dimensions": "6.0 m span with solar panels deployed",
            "top_speed": "Stationary Lander",
            "range": "Surface stationary observation",
            "power_system": "Two 2.15-meter circular solar arrays (producing 600-700W initially)",
            "scientific_payload_en": "SEIS (Seismic Experiment for Interior Structure), HP3 Heat Flow and Physical Properties Package, RISE (Rotation and Interior Structure Experiment).",
            "scientific_payload_ar": "مقياس الزلازل SEIS، حزمة التدفق الحراري والخصائص الفيزيائية HP3، وتجربة الدوران والتركيب الداخلي RISE.",
            "what_we_learned_en": "Discovered that Mars is seismically alive with regular marsquakes, mapped the thickness of the Martian crust, and determined that the core is liquid iron-nickel.",
            "what_we_learned_ar": "أثبتت أن المريخ كوكب نشط زلزالياً، ورسمت خارطة لسماكة القشرة، وأكدت أن لب المريخ سائل من الحديد والنيكل.",
            "status_today_en": "Sitting on Elysium Planitia; last signal sent December 15, 2022.",
            "status_today_ar": "مستقرة على سهل إليسيوم بلانيشيا؛ أرسلت آخر إشارة في 15 ديسمبر 2022.",
            "nasa_link": "https://mars.nasa.gov/insight/"
        }
    ],
    "stories": [
        {
            "id": "moon-rover-story",
            "title_en": "The Silent Guardian of Hadley Rille",
            "title_ar": "حارس أخدود هادلي الصامت",
            "subtitle_en": "How a small electric car changed our perspective of the cosmos",
            "subtitle_ar": "كيف غيرت عربة كهربائية صغيرة نظرتنا إلى الكون",
            "reading_time_min": 4,
            "chapters": [
                {
                    "title_en": "Chapter 1: The Dust on the Wheels",
                    "title_ar": "الفصل 1: الغبار على العجلات",
                    "content_en": "In July 1971, amidst the silent, stark gray plains of Hadley-Apennine, an unprecedented sound echoed through astronauts' helmets: the quiet hum of electric motors. Apollo 15 was different from all missions before it. It did not confine humanity to a small perimeter around the lander. Folded like origami inside the descent stage, the Lunar Roving Vehicle unfolded into history.",
                    "content_ar": "في يوليو 1971، وسط سهول هادلي-أبينين القمرية الهادئة والرمادية، تردد صوت فريد داخل خوذ رواد الفضاء: الأزيز الهادئ للمحركات الكهربائية. كانت مهمة أبولو 15 مختلفة تماماً عما سبقها؛ إذ لم تحبس روادها في بقعة صغيرة حول مركبة الهبوط، بل حملت عربة قمرية مطوية كالأوريجامي انفتحت لتصنع التاريخ."
                },
                {
                    "title_en": "Chapter 2: The Edge of the Abyss",
                    "title_ar": "الفصل 2: على حافة الهاوية",
                    "content_en": "Scott and Irwin navigated treacherous boulder fields toward Hadley Rille—a gargantuan canyon 1.5 kilometers wide and 300 meters deep, carved by ancient lava rivers four billion years ago. On foot, this expedition would have been lethal and impossible. In the rover, it became a classroom. They could pause, deploy sun-angle gnomons, chip basalt samples, and drive on.",
                    "content_ar": "قاد سكوت وإروين العربة عبر حقول الصخور الوعرة نحو أخدود هادلي السحيق—وهو وادٍ عملاق بعرض 1.5 كيلومتر وعمق 300 متر شكلته أنهار الحمم البركانية قبل أربعة مليارات عام. سيراً على الأقدام، كانت هذه الرحلة مستحيلة ومحفوفة بالمخاطر القاتلة؛ لكن على متن العربة، تحولت إلى مختبر ميداني متكامل."
                },
                {
                    "title_en": "Chapter 3: The Parting Gift",
                    "title_ar": "الفصل 3: الهدية الأخيرة",
                    "content_en": "When it was time to leave, the astronauts drove the rover one last time, parking it precisely 100 meters east of the Lunar Module Falcon. Astronauts stepped into the cabin, but the rover stayed behind—its color camera controlled remotely by Ed Fendell in Houston to film the ascent stage blasting into the black sky. It remains there today under the quiet starlight, waiting for the day explorers return.",
                    "content_ar": "وعندما حان وقت الرحيل، قاد الرواد العربة للمرة الأخيرة، وركنوها بدقة على بعد 100 متر شرق مركبة الصعود فالكون. غادر الرواد القمر، لكن العربة بقيت هناك، لتلتقط كاميرتها الملونة الموجهة من هيوستن مشهد الإقلاع نحو السماء الحالكة. وما تزال حتى اليوم تقف بشموخ تحت ضوء النجوم في انتظار عودة البشر."
                }
            ]
        },
        {
            "id": "opportunity-story",
            "title_en": "The Last Sunset of Perseverance Valley",
            "title_ar": "غروب الشمس الأخير في وادي بيرسيفيرانس",
            "subtitle_en": "Fifteen years of dust, discovery, and resilience on the Red Planet",
            "subtitle_ar": "خمسة عشر عاماً من الغبار والاكتشاف والصمود على الكوكب الأحمر",
            "reading_time_min": 5,
            "chapters": [
                {
                    "title_en": "Chapter 1: The Ninety-Day Promise",
                    "title_ar": "الفصل 1: وعد التسعين يوماً",
                    "content_en": "When Opportunity touched down in January 2004, bouncing inside an airbag cocoon into Eagle Crater, its warranty was exactly 90 Martian sols. Engineers expected dust to choke its solar panels by spring. Instead, Martian dust devils blew past, unexpectedly sweeping the panels clean like gentle robotic caretakers.",
                    "content_ar": "عندما هبطت أوبورتونيتي في يناير 2004 قافزة في وسائدها الهوائية داخل فوهة إيغل، كان عمرها الافتراضي 90 يوماً مريخياً فقط. توقع المهندسون أن يغطي الغبار ألواحها الشمسية ويميتها مع حلول الربيع، لكن رياح المريخ هبت فجأة ومسحت الألواح بنقاء مدهش، كأنها يد حانية تعيد لها الحياة."
                },
                {
                    "title_en": "Chapter 2: Marathon to the Craters",
                    "title_ar": "الفصل 2: ماراثون الفوهات",
                    "content_en": "From Eagle to Endurance, from Victoria to Endeavour, Opportunity rolled across 45 kilometers of Martian sand. In its robotic arm were microscopes that touched ancient lakebeds. It proved that Mars was once warm, wet, and hospitable to the building blocks of life.",
                    "content_ar": "من فوهة إيغل إلى إندورانس، ومن فيكتوريا إلى إنديفور، سارت أوبورتونيتي لأكثر من 45 كيلومتراً فوق رمال المريخ. بفضل ذراعها الروبوتية، لمست قيعان البحيرات القديمة، وأثبتت بالدليل القاطع أن المريخ كان يوماً دافئاً غنياً بالمياه الصالحة لنشأة الحياة."
                },
                {
                    "title_en": "Chapter 3: The Gathering Darkness",
                    "title_ar": "الفصل 3: عتمة العاصفة",
                    "content_en": "In June 2018, the sky over Perseverance Valley turned into bronze, then brown, then black as a global dust storm obscured the sun. On Sol 5111, its final message carried technical numbers that Science reporter Jacob Margolis poeticized: 'My battery is low and it's getting dark.' Over eight months, NASA beamed over 1,000 recovery commands including Billie Holiday's 'I'll Be Seeing You'. She rests in silence, having given humanity an enduring legacy.",
                    "content_ar": "في يونيو 2018، تحولت سماء وادي بيرسيفيرانس إلى لون برونزي ثم بني ثم سواد دامس بسبب عاصفة عالمية حجبت الشمس تماماً. في اليوم 5111، أرسلت آخر قياسات طاقة صاغها الصحفيون بالعبارة المؤثرة: 'بطاريتي تنفد، والظلام يحل'. وظلت ناسا تبث أغاني ورسائل لأكثر من 8 أشهر أملاً في إيقاظها، لترقد المركبة تاركة إرثاً علمياً خالداً."
                }
            ]
        }
    ],
    "quizzes": [
        {
            "id": "q1",
            "question_en": "Why did NASA send the Lunar Roving Vehicle (LRV) on Apollo 15?",
            "question_ar": "لماذا أرسلت ناسا المركبة القمرية الجوالة (LRV) في بعثة أبولو 15؟",
            "options_en": [
                "To establish permanent lunar human colonies immediately",
                "To expand astronauts field mobility and collect diverse geological samples over wide distances",
                "To generate artificial gravity for the Moon",
                "To drill deep tunnels into the lunar core"
            ],
            "options_ar": [
                "لبناء مستعمرات بشرية دائمة فوراً على القمر",
                "لتوسيع نطاق تنقل الرواد وجمع عينات جيولوجية متنوعة عبر مسافات شاسعة",
                "لتوليد جاذبية اصطناعية لسطح القمر",
                "لحفر أنفاق عميقة تصل إلى لب القمر"
            ],
            "correct": 1,
            "explanation_en": "The Lunar Roving Vehicle expanded the exploration radius from hundreds of meters around the LM to dozens of kilometers, allowing astronauts to reach Hadley Rille and collect the historic 4-billion-year-old Genesis Rock.",
            "explanation_ar": "وسعت المركبة القمرية نطاق الاستكشاف من بضع مئات من الأمتار حول مركبة الهبوط إلى عشرات الكيلومترات، مما مكن الرواد من بلوغ أخدود هادلي وجلب حجر سفر التكوين.",
            "xp": 100
        },
        {
            "id": "q2",
            "question_en": "What primary energy source powered the Opportunity rover for 14.5 years on Mars?",
            "question_ar": "ما هو مصدر الطاقة الأساسي الذي زوّد مركبة أوبورتونيتي بالطاقة لمدة 14.5 سنة على المريخ؟",
            "options_en": [
                "Liquid Hydrogen fuel cells",
                "Solar panels combined with rechargeable Lithium-ion batteries",
                "Internal combustion gasoline engines",
                "Geothermal subterranean heat vents"
            ],
            "options_ar": [
                "خلايا وقود الهيدروجين السائل",
                "الألواح الشمسية مقترنة ببطاريات الليثيوم أيون القابلة للشحن",
                "محركات الاحتراق الداخلي التي تعمل بالبنزين",
                "فتحات حرارية جوفية من باطن المريخ"
            ],
            "correct": 1,
            "explanation_en": "Opportunity was equipped with Gallium Arsenide solar panels producing up to 140 watts at noon, charging dual lithium-ion batteries.",
            "explanation_ar": "زُوّدت أوبورتونيتي بألواح شمسية ثلاثية الوصلات تولد حتى 140 واط وقت الظهيرة، تشحن بطاريتي ليثيوم أيون.",
            "xp": 100
        },
        {
            "id": "q3",
            "question_en": "In mission time planning, if route distance is 1.2 km and rover speed is 6 km/h, what is travel time?",
            "question_ar": "في حسابات زمن الرحلات الاستكشافية، إذا كانت المسافة 1.2 كم وسرعة المركبة 6 كم/ساعة، فما هو زمن الانتقال؟",
            "options_en": [
                "6 minutes",
                "12 minutes",
                "20 minutes",
                "30 minutes"
            ],
            "options_ar": [
                "6 دقائق",
                "12 دقيقة",
                "20 دقيقة",
                "30 دقيقة"
            ],
            "correct": 1,
            "explanation_en": "Travel time = (Distance / Speed) * 60 = (1.2 km / 6 km/h) * 60 = 0.2 * 60 = 12 minutes.",
            "explanation_ar": "زمن الانتقال = (المسافة ÷ السرعة) × 60 = (1.2 ÷ 6) × 60 = 0.2 × 60 = 12 دقيقة.",
            "xp": 100
        },
        {
            "id": "q4",
            "question_en": "What was the landmark scientific discovery made by Apollo 15 known as the 'Genesis Rock'?",
            "question_ar": "ما هو الاكتشاف العلمي الأبرز الذي حققته بعثة أبولو 15 والمعروف بـ 'حجر سفر التكوين'؟",
            "options_en": [
                "A chunk of meteorite from outside our Solar System",
                "An anorthosite rock sample dating back 4 billion years to the Moon's primordial crust",
                "Liquid water ice crystals inside a crater",
                "Fossilized organic microorganisms"
            ],
            "options_ar": [
                "قطعة نيزكية قادمة من خارج نظامنا الشمسي",
                "عينة صخر أنورثوسايت يعود تاريخها إلى 4 مليارات عام من القشرة الأولية للقمر",
                "بلورات جليد ماء سائل داخل فوهة",
                "أحافير لكائنات حية دقيقة"
            ],
            "correct": 1,
            "explanation_en": "Sample 15415, nicknamed the Genesis Rock, proved that the early Moon possessed a magma ocean where plagioclase feldspar floated to form an anorthosite crust.",
            "explanation_ar": "العينة 15415 أثبتت فرضية محيط الصهارة القمري الأولي، حيث طفا معدن البلاغيوكلاز ليشكل قشرة الأنورثوسايت القديمة للقمر.",
            "xp": 100
        },
        {
            "id": "q5",
            "question_en": "What led to the end of Opportunity's mission in 2018?",
            "question_ar": "ما هو السبب الرئيسي الذي أنهى مهمة مركبة أوبورتونيتي في عام 2018؟",
            "options_en": [
                "A catastrophic computer virus",
                "A massive planet-encircling dust storm that blocked sunlight and depleted its batteries",
                "Falling into an active volcanic caldera",
                "Collision with an incoming meteor"
            ],
            "options_ar": [
                "فيروس حاسوبي عطل برمجياتها",
                "عاصفة غبارية عالمية حجبت أشعة الشمس واستنزفت طاقة البطاريات",
                "سقوطها في فوهة بركانية نشطة",
                "اصطدامها بنيزك متساقط"
            ],
            "correct": 1,
            "explanation_en": "A historic global dust storm blanketed the entire planet Mars in June 2018, reducing atmospheric transparency (tau > 10.8) and preventing the solar panels from recharging the batteries.",
            "explanation_ar": "عاصفة غبارية عملاقة غطت كوكب المريخ بالكامل في يونيو 2018، فحجبت أشعة الشمس ومنعت الألواح من شحن البطاريات.",
            "xp": 100
        }
    ],
    "leaderboard": [
        { "name": "Sarah Al-Harthy", "callsign": "Eagle-01", "xp": 2450, "rank": "Master Archive Commander", "completed": "Moon + Mars + Lab", "date": "2026-10-31" },
        { "name": "Zaid Al-Busaidi", "callsign": "Hadley-Rover", "xp": 2100, "rank": "Senior Planetary Surveyor", "completed": "Moon + Museum", "date": "2026-10-31" },
        { "name": "Dr. Elena Rostova", "callsign": "DeepSpace-9", "xp": 1950, "rank": "Senior Planetary Surveyor", "completed": "Moon + Quiz Master", "date": "2026-10-30" },
        { "name": "Khalid Al-Maamari", "callsign": "Sol-5000", "xp": 1780, "rank": "Planetary Specialist", "completed": "Mars Sim + Lab", "date": "2026-10-30" },
        { "name": "Maya Lin", "callsign": "Apollo-Star", "xp": 1600, "rank": "Planetary Specialist", "completed": "Moon Traverse", "date": "2026-10-29" },
        { "name": "Tariq Al-Fazari", "callsign": "Seis-Pioneer", "xp": 1420, "rank": "Explorer Cadet", "completed": "All Quizzes", "date": "2026-10-29" }
    ],
    "guestbook": [
        { "name": "NASA Space Apps Evaluation Team", "affiliation": "Judge / STEM Reviewer", "comment": "Outstanding concept! Connecting discarded historic hardware with tangible STEM inquiry and interactive 3D simulations perfectly embodies the challenge spirit.", "date": "2026-10-31" },
        { "name": "Amira (Age 14)", "affiliation": "Student Explorer", "comment": "Driving the lunar rover to Hadley Rille and testing the travel time was so exciting! I learned why rovers are needed in space.", "date": "2026-10-31" },
        { "name": "Sultan Qaboos University Physics Club", "affiliation": "Educator", "comment": "The mathematical model of travel speed vs observation stops is a brilliant way to teach students real mission planning trade-offs.", "date": "2026-10-30" }
    ]
}

os.makedirs('data', exist_ok=True)
with open('data/db.json', 'w', encoding='utf-8') as f:
    json.dump(db, f, ensure_ascii=False, indent=2)

print("Generated data/db.json successfully!")
