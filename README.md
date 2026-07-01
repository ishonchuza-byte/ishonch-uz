# Yangi Kun

7 sahifali zamonaviy React yangiliklar sayti.

## Sahifalar

- Bosh sahifa
- Siyosat
- Iqtisod
- Texnologiya
- Sport
- Madaniyat
- Aloqa

## Ishga tushirish

Mahalliy serverni ishga tushirish:

```powershell
npm.cmd run dev
```

Keyin brauzerda `http://localhost:5173` manzilini oching.

Agar `5173` port band bo'lsa:

```powershell
$env:PORT='5892'
npm.cmd run dev
```

Keyin `http://localhost:5892` manzilini oching.

## Backend va admin panel

Saytdagi `Admin` tugmasini bosing.

- Standart parol: `admin2026`
- Backend API: `server.js`
- Maqolalar bazasi: `data/db.json`
- Yuklangan rasmlar: `uploads/`
- Login cookie sessiya orqali tekshiriladi
- Parol serverda `scrypt` hash bilan saqlanadi
- Maqola qo'shish, tahrirlash, draft/published statusini almashtirish mumkin
- Rasm URL orqali yoki kompyuterdan fayl tanlab qo'shiladi
- Ma'lumotlar serverdagi JSON bazaga saqlanadi
