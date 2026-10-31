import json

with open('all_sheets_full.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

sheets_to_inspect = ['الألغاز', 'الأدلة والمقتنيات', 'تفصيل مهمة القمر', 'تفصيل مهمة المريخ', 'النقاط والمكافآت', 'الأدلة العلمية', 'النماذج والمعادلات', 'القاموس والتوطين']

with open('key_sheets_extracted.txt', 'w', encoding='utf-8') as out:
    for name in sheets_to_inspect:
        if name in data:
            out.write(f"\n==================== SHEET: {name} ====================\n")
            for r in data[name]:
                out.write(" | ".join(r) + "\n")

print("Key sheets extracted successfully.")
