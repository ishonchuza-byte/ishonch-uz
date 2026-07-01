import json

db_path = 'data/db.json'

with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

# Update config footerLogoUrl
if 'config' in db:
    old_url = db['config'].get('footerLogoUrl')
    print("Current footerLogoUrl in db:", old_url)
    db['config']['footerLogoUrl'] = "/uploads/footer_logo_transparent.png"
    print("Updated footerLogoUrl in db to: /uploads/footer_logo_transparent.png")
else:
    print("Warning: config key not found in db.json!")

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print("Saved database successfully!")
