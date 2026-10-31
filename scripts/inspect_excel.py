import json

with open('excel_dump.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

with open('sheet_overview.txt', 'w', encoding='utf-8') as out:
    for s in data:
        out.write(f"Sheet: {s['sheet']} (Rows: {s['max_row']}, Cols: {s['max_col']})\n")
        for i, row in enumerate(s['sample_rows'][:8]):
            clean_row = [c.replace('\n', ' ') for c in row if c != '']
            out.write(f"   [{i+1}] {' | '.join(clean_row[:8])}\n")
        out.write("\n" + "="*60 + "\n\n")

print("Wrote sheet_overview.txt successfully")
