import json
import os

with open('all_sheets_full.json', 'r', encoding='utf-8') as f:
    raw = json.load(f)

# Helper to convert sheet rows (where row 3 is usually header and row 4+ is data) into list of dicts
def parse_sheet_table(rows, header_row_idx=3, data_start_idx=4):
    if len(rows) <= header_row_idx:
        return []
    headers = [h.strip() for h in rows[header_row_idx]]
    # Clean headers
    headers = [h if h else f"col_{i}" for i, h in enumerate(headers)]
    items = []
    for r in rows[data_start_idx:]:
        if not any(r):
            continue
        obj = {}
        for i, h in enumerate(headers):
            val = r[i].strip() if i < len(r) else ''
            obj[h] = val
        items.append(obj)
    return items

bible = {
    "title": "ECHOES OF SPACE: THE LAST SIGNAL",
    "subtitle": "Genesis V Master Game Bible (2026)",
    "challenge": {
        "event": "NASA Space Apps Challenge 2026",
        "name": "Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars",
        "description": "Transform historical discarded scientific equipment into interactive stories and STEM learning adventures for young learners and educators.",
        "url": "https://www.spaceappschallenge.org/2026/challenges/abandoned-but-not-forgotten-storytelling-about-nasas-discarded-equipment-on-the-moon-and-mars/"
    },
    "executive_summary": parse_sheet_table(raw.get('ملخص تنفيذي', []), 3, 4),
    "game_vision": parse_sheet_table(raw.get('رؤية اللعبة', []), 3, 4),
    "world_characters": parse_sheet_table(raw.get('العالم والشخصيات', []), 3, 4),
    "player_journey": parse_sheet_table(raw.get('رحلة اللاعب', []), 3, 4),
    "mission_map": parse_sheet_table(raw.get('خارطة المراحل', []), 3, 4),
    "puzzles": parse_sheet_table(raw.get('الألغاز', []), 3, 4),
    "evidence": parse_sheet_table(raw.get('الأدلة والمقتنيات', []), 3, 4),
    "xp_economy": parse_sheet_table(raw.get('النقاط والمكافآت', []), 3, 4),
    "moon_mission": parse_sheet_table(raw.get('تفصيل مهمة القمر', []), 3, 4),
    "mars_mission": parse_sheet_table(raw.get('تفصيل مهمة المريخ', []), 3, 4),
    "scientific_claims": parse_sheet_table(raw.get('الأدلة العلمية', []), 3, 4),
    "models_equations": parse_sheet_table(raw.get('النماذج والمعادلات', []), 3, 4),
    "judging": parse_sheet_table(raw.get('التحكيم', []), 3, 4),
    "competitors": parse_sheet_table(raw.get('المنافسون والمقارنات', []), 3, 4),
    "reference_games": parse_sheet_table(raw.get('مرجع 35 لعبة', []), 3, 4),
    "judges_qa": parse_sheet_table(raw.get('أسئلة المحكمين', []), 3, 4),
    "dictionary": parse_sheet_table(raw.get('القاموس والتوطين', []), 3, 4),
    "sources": parse_sheet_table(raw.get('المصادر', []), 3, 4),
    "team_roles": parse_sheet_table(raw.get('فريق الستة', []), 3, 4),
    "risks": parse_sheet_table(raw.get('المخاطر', []), 3, 4)
}

os.makedirs('data', exist_ok=True)
with open('data/master_bible.json', 'w', encoding='utf-8') as f:
    json.dump(bible, f, ensure_ascii=False, indent=2)

print("data/master_bible.json generated successfully!")
print(f"Puzzles: {len(bible['puzzles'])}, Evidence: {len(bible['evidence'])}, Scientific Claims: {len(bible['scientific_claims'])}, Judges QA: {len(bible['judges_qa'])}")
