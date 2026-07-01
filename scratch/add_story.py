import json
import uuid
from datetime import datetime

db_path = 'data/db.json'

with open(db_path, 'r', encoding='utf-8') as f:
    db = json.load(f)

# Generate a new unique ID
story_id = str(uuid.uuid4())
now_iso = datetime.utcnow().isoformat() + 'Z'

# New story object for Uzbek (Latin)
story_uz = {
    "id": story_id,
    "category": "Texnologiya",
    "title": "O'zbekistonda yoshlar uchun 'Milliy kutubxona' mobil ilovasi taqdim etildi",
    "summary": "Yangi raqamli platforma minglab o'zbek tilidagi audio kitoblar, elektron asarlar va ilmiy maqolalarni o'z ichiga oladi.",
    "image": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80",
    "author": "Shahlo Nazarova",
    "time": "Hozir",
    "read": "3 daqiqa",
    "body": "Yoshlar ma'naviyatini yuksaltirish va mutolaa madaniyatini ommalashtirish maqsadida yangi mobil ilova ishga tushdi. Unda nafaqat jahon adabiyoti durdonalari, balki milliy yozuvchilarimizning asarlari ham o'rin olgan. Tizim to'liq bepul bo'lib, foydalanuvchilar o'zlari yoqtirgan asarlarni offlayn rejimda tinglash yoki o'qish imkoniyatiga ega. Tahririyat ushbu loyihani yoritib borishda davom etadi.",
    "script": "latin",
    "status": "published",
    "createdAt": now_iso,
    "updatedAt": now_iso
}

# New story object for Uzbek (Cyrillic)
story_uzk = {
    "id": story_id,
    "category": "Технология",
    "title": "Ўзбекистонда ёшлар учун 'Миллий кутубхона' мобил иловаси тақдим этилди",
    "summary": "Янги рақамли платформа минглаб ўзбек тилидаги аудио китоблар, электрон асарлар ва илмий мақолаларни ўз ичига олади.",
    "image": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80",
    "author": "Шаҳло Назарова",
    "time": "Ҳозир",
    "read": "3 дақиқа",
    "body": "Ёшлар маънавиятини юксалтириш ва мутолаа маданиятини оммалаштириш мақсадида янги мобил илова ишга тушди. Унда нафақат жаҳон адабиёти дурдоналари, балки миллий ёзувчиларимизниг асарлари ҳам ўрин олган. Тизим тўлиқ бепул бўлиб, фойдаланувчилар ўзлари ёқтирган асарларни оффлайн режимда тинглаш ёки ўқиш имкониятига эга. Таҳририят ушбу лойиҳани ёритиб боришда давом этади.",
    "status": "published",
    "createdAt": now_iso,
    "updatedAt": now_iso
}

# New story object for Russian
story_ru = {
    "id": story_id,
    "category": "Технологии",
    "title": "В Узбекистане запущено мобильное приложение 'Национальная библиотека' для молодежи",
    "summary": "Новая цифровая платформа включает тысячи аудиокниг, электронных изданий и научных статей на узбекском языке.",
    "image": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=1200&q=80",
    "author": "Шахло Назарова",
    "time": "Сейчас",
    "read": "3 минуты",
    "body": "В целях повышения духовности молодежи и популяризации культуры чтения запущено новое мобильное приложение. Оно содержит не только шедевры мировой литературы, но и произведения отечественных авторов. Система полностью бесплатна, и пользователи могут слушать или читать любимые произведения в автономном режиме. Редакция продолжает следить за развитием этого проекта.",
    "status": "published",
    "createdAt": now_iso,
    "updatedAt": now_iso
}

# Insert new stories at the beginning of their respective language lists
db['stories']['uz'].insert(0, story_uz)
db['stories']['uzk'].insert(0, story_uzk)
db['stories']['ru'].insert(0, story_ru)

with open(db_path, 'w', encoding='utf-8') as f:
    json.dump(db, f, indent=2, ensure_ascii=False)

print("Successfully added new story in all three languages to data/db.json!")
