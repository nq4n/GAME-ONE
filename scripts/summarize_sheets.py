import json

with open('all_sheets_full.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Total sheets: {len(data)}")
for i, (name, rows) in enumerate(data.items(), 1):
    header = rows[3] if len(rows) > 3 else (rows[0] if rows else [])
    print(f"{i}. {name}: {len(rows)} rows | Header: {header[:5]}")
