import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import DOMPurify from 'dompurify';
import './styles.css';

const images = {
  city: "url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?auto=format&fit=crop&w=1600&q=80')",
  parliament: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
  business: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  sport: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
  culture: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
  analysis: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
  world: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
  newsroom: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
  power: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80",
  tourism: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=900&q=80",
  cityPeople: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
  road: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  debate: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
  diplomacy: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=900&q=80",
  map: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80",
  studio: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80",
  photo1: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
  photo2: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
  photo3: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80",
  photo4: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
  photo5: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
  photo6: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=900&q=80",
};

const copy = {
  uz: {
    live: "Jonli lenta",
    date: new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" }),
    search: "Qidirish...",
    portal: "Yangiliklar portali",
    read: "O'qish",
    popular: "Ko'p o'qilganlar",
    newsletterTitle: "Kunlik dayjest",
    newsletterText: "Muhim xabarlar, tahlillar va maxsus maqolalarni pochtangizga oling.",
    email: "Email manzilingiz",
    subscribe: "Obuna bo'lish",
    latest: "So'nggi yangiliklar",
    latestNote: "Tahririyat tanlagan dolzarb xabarlar, qisqa sharhlar va mavzuga oid ma'lumotlar.",
    all: "Barchasi",
    special: "Maxsus loyiha",
    specialTitle: "Ma'lumotga tayangan jurnalistika: voqeani shovqindan ajratamiz",
    specialText:
      "Ishonch.uz tahririyati siyosat, iqtisod, texnologiya, sport va madaniyatdagi muhim jarayonlarni ravon tilda tushuntiradi.",
    pages: ["Bosh sahifa", "Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Aloqa"],
    pageNotes: {
      "Bosh sahifa": "Asosiy xabarlar, trendlar va kunning eng muhim mavzulari.",
      Siyosat: "Davlat boshqaruvi, parlament, mahalliy kengashlar va jamoatchilik muhokamalari.",
      Iqtisod: "Bozorlar, biznes, moliya, bandlik va tadbirkorlik muhiti.",
      Texnologiya: "Startaplar, sun'iy intellekt, raqamli xizmatlar va kiberxavfsizlik.",
      Sport: "Futbol, olimpiya sportlari, turnirlar va sportchilar hikoyalari.",
      Madaniyat: "Kino, teatr, kitob, musiqa va shahar hayotidagi madaniy voqealar.",
      Aloqa: "Tahririyat bilan bog'lanish, reklama va hamkorlik uchun ma'lumotlar.",
    },
    contact: [
      ["Tahririyat", "Yangilik, press-reliz yoki foto material yuborish uchun: news@ishonch.uz"],
      ["Reklama", "Brend loyihalari, bannerlar va maxsus sahifalar: ads@ishonch.uz"],
      ["Manzil", "Toshkent shahri, matbuot markazi, 4-qavat. Dushanba-juma 09:00-18:00."],
    ],
    close: "Yopish",
    statsOnline: "🟢 Onlayn",
    statsActions: "⚡ Amallar",
    statsVisits: "👥 Tashriflar",
    statsAvgTime: "⏱️ Veb-saytdagi o‘rtacha vaqt",
  },
  ru: {
    live: "Лента",
    date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
    search: "Поиск...",
    portal: "Новостной портал",
    read: "Читать",
    popular: "Популярное",
    newsletterTitle: "Ежедневный дайджест",
    newsletterText: "Получайте главные новости, аналитику и специальные материалы на почту.",
    email: "Ваш email",
    subscribe: "Подписаться",
    latest: "Последние новости",
    latestNote: "Актуальные сообщения, короткие разборы и контекст от редакции.",
    all: "Все",
    special: "Спецпроект",
    specialTitle: "Журналистика на основе данных: отделяем события от шума",
    specialText:
      "Редакция Ishonch.uz понятным языком объясняет важные процессы в политике, экономике, технологиях, спорте и культуре.",
    pages: ["Главная", "Политика", "Экономика", "Технологии", "Спорт", "Культура", "Контакты"],
    pageNotes: {
      "Главная": "Главные материалы, тренды и ключевые темы дня.",
      "Политика": "Госуправление, парламент, местные советы и общественные обсуждения.",
      "Экономика": "Рынки, бизнес, финансы, занятость и предпринимательская среда.",
      "Технологии": "Стартапы, искусственный интеллект, цифровые сервисы и кибербезопасность.",
      "Спорт": "Футбол, олимпийские виды, турниры и истории спортсменов.",
      "Культура": "Кино, театр, книги, музыка и культурные события городской жизни.",
      "Контакты": "Связь с редакцией, реклама и партнёрские проекты.",
    },
    contact: [
      ["Редакция", "Новости, пресс-релизы и фотоматериалы: news@ishonch.uz"],
      ["Реклама", "Бренд-проекты, баннеры и специальные страницы: ads@ishonch.uz"],
      ["Адрес", "Ташкент, медиацентр, 4 этаж. Понедельник-пятница 09:00-18:00."],
    ],
    close: "Закрыть",
    statsOnline: "🟢 Онлайн",
    statsActions: "⚡ Действия",
    statsVisits: "👥 Визиты",
    statsAvgTime: "⏱️ Среднее время на сайте",
  },
};

copy["uzk"] = {
  live: "\u0416\u043e\u043d\u043b\u0438 \u043b\u0435\u043d\u0442\u0430",
  date: new Date().toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" }),
  search: "\u049a\u0438\u0434\u0438\u0440\u0438\u0448...",
  portal: "\u042f\u043d\u0433\u0438\u043b\u0438\u043a\u043b\u0430\u0440 \u043f\u043e\u0440\u0442\u0430\u043b\u0438",
  read: "\u040e\u049b\u0438\u0448",
  popular: "\u041a\u045e\u043f \u045e\u049b\u0438\u043b\u0433\u0430\u043d\u043b\u0430\u0440",
  newsletterTitle: "\u041a\u0443\u043d\u043b\u0438\u043a \u0434\u0430\u0439\u0436\u0435\u0441\u0442",
  newsletterText: "\u041c\u0443\u04b3\u0438\u043c \u0445\u0430\u0431\u0430\u0440\u043b\u0430\u0440, \u0442\u0430\u04b3\u043b\u0438\u043b\u043b\u0430\u0440 \u0432\u0430 \u043c\u0430\u0445\u0441\u0443\u0441 \u043c\u0430\u049b\u043e\u043b\u0430\u043b\u0430\u0440\u043d\u0438 \u043f\u043e\u0448\u0442\u0430\u043d\u0433\u0438\u0437\u0433\u0430 \u043e\u043b\u0438\u043d\u0433.",
  email: "Email \u043c\u0430\u043d\u0437\u0438\u043b\u0438\u043d\u0433\u0438\u0437",
  subscribe: "\u041e\u0431\u0443\u043d\u0430 \u0431\u045e\u043b\u0438\u0448",
  latest: "\u0421\u045e\u043d\u0433\u0433\u0438 \u044f\u043d\u0433\u0438\u043b\u0438\u043a\u043b\u0430\u0440",
  latestNote: "\u0422\u0430\u04b3\u0440\u0438\u0440\u0438\u044f\u0442 \u0442\u0430\u043d\u043b\u0430\u0433\u0430\u043d \u0434\u043e\u043b\u0437\u0430\u0440\u0431 \u0445\u0430\u0431\u0430\u0440\u043b\u0430\u0440, \u049b\u0438\u0441\u049b\u0430 \u0448\u0430\u0440\u04b3\u043b\u0430\u0440 \u0432\u0430 \u043c\u0430\u0432\u0437\u0443\u0433\u0430 \u043e\u0438\u0434 \u043c\u0430\u044a\u043b\u0443\u043c\u043e\u0442\u043b\u0430\u0440.",
  all: "\u0411\u0430\u0440\u0447\u0430\u0441\u0438",
  special: "\u041c\u0430\u0445\u0441\u0443\u0441 \u043b\u043e\u0439\u0438\u04b3\u0430",
  specialTitle: "\u041c\u0430\u044a\u043b\u0443\u043c\u043e\u0442\u0433\u0430 \u0442\u0430\u044f\u043d\u0433\u0430\u043d \u0436\u0443\u0440\u043d\u0430\u043b\u0438\u0441\u0442\u0438\u043a\u0430",
  specialText: "\u042f\u043d\u0433\u0438 \u041a\u0443\u043d \u0442\u0430\u04b3\u0440\u0438\u0440\u0438\u044f\u0442\u0438 \u0441\u0438\u0451\u0441\u0430\u0442, \u0438\u049b\u0442\u0438\u0441\u043e\u0434, \u0442\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u044f, \u0441\u043f\u043e\u0440\u0442 \u0432\u0430 \u043c\u0430\u0434\u0430\u043d\u0438\u044f\u0442\u0434\u0430\u0433\u0438 \u043c\u0443\u04b3\u0438\u043c \u0436\u0430\u0440\u0430\u0451\u043d\u043b\u0430\u0440\u043d\u0438 \u0440\u0430\u0432\u043e\u043d \u0442\u0438\u043b\u0434\u0430 \u0442\u0443\u0448\u0443\u043d\u0442\u0438\u0440\u0430\u0434\u0438.",
  pages: ["\u0411\u043e\u0448 \u0441\u0430\u04b3\u0438\u0444\u0430", "\u0421\u0438\u0451\u0441\u0430\u0442", "\u0418\u049b\u0442\u0438\u0441\u043e\u0434", "\u0422\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u044f", "\u0421\u043f\u043e\u0440\u0442", "\u041c\u0430\u0434\u0430\u043d\u0438\u044f\u0442", "\u0410\u043b\u043e\u049b\u0430"],
  pageNotes: {
    "\u0411\u043e\u0448 \u0441\u0430\u04b3\u0438\u0444\u0430": "\u0410\u0441\u043e\u0441\u0438\u0439 \u0445\u0430\u0431\u0430\u0440\u043b\u0430\u0440, \u0442\u0440\u0435\u043d\u0434\u043b\u0430\u0440 \u0432\u0430 \u043a\u0443\u043d\u043d\u0438\u043d\u0433 \u044d\u043d\u0433 \u043c\u0443\u04b3\u0438\u043c \u043c\u0430\u0432\u0437\u0443\u043b\u0430\u0440\u0438.",
    "\u0421\u0438\u0451\u0441\u0430\u0442": "\u0414\u0430\u0432\u043b\u0430\u0442 \u0431\u043e\u0448\u049b\u0430\u0440\u0443\u0432\u0438, \u043f\u0430\u0440\u043b\u0430\u043c\u0435\u043d\u0442, \u043c\u0430\u04b3\u0430\u043b\u043b\u0438\u0439 \u043a\u0435\u043d\u0433\u0430\u0448\u043b\u0430\u0440 \u0432\u0430 \u0436\u0430\u043c\u043e\u0430\u0442\u0447\u0438\u043b\u0438\u043a \u043c\u0443\u04b3\u043e\u043a\u0430\u043c\u0430\u043b\u0430\u0440\u0438.",
    "\u0418\u049b\u0442\u0438\u0441\u043e\u0434": "\u0411\u043e\u0437\u043e\u0440\u043b\u0430\u0440, \u0431\u0438\u0437\u043d\u0435\u0441, \u043c\u043e\u043b\u0438\u044f, \u0431\u0430\u043d\u0434\u043b\u0438\u043a \u0432\u0430 \u0442\u0430\u0434\u0431\u0438\u0440\u043a\u043e\u0440\u043b\u0438\u043a \u043c\u0443\u04b3\u0438\u0442\u0438.",
    "\u0422\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u044f": "\u0421\u0442\u0430\u0440\u0442\u0430\u043f\u043b\u0430\u0440, \u0441\u0443\u043d\u044a\u0438\u0439 \u0438\u043d\u0442\u0435\u043b\u043b\u0435\u043a\u0442, \u0440\u0430\u049b\u0430\u043c\u043b\u0438 \u0445\u0438\u0437\u043c\u0430\u0442\u043b\u0430\u0440 \u0432\u0430 \u043a\u0438\u0431\u0435\u0440\u0445\u0430\u0432\u0444\u0441\u0438\u0437\u043b\u0438\u043a.",
    "\u0421\u043f\u043e\u0440\u0442": "\u0424\u0443\u0442\u0431\u043e\u043b, \u043e\u043b\u0438\u043c\u043f\u0438\u044f \u0441\u043f\u043e\u0440\u0442\u043b\u0430\u0440\u0438, \u0442\u0443\u0440\u043d\u0438\u0440\u043b\u0430\u0440 \u0432\u0430 \u0441\u043f\u043e\u0440\u0442\u0447\u0438\u043b\u0430\u0440 \u04b3\u0438\u043a\u043e\u044f\u043b\u0430\u0440\u0438.",
    "\u041c\u0430\u0434\u0430\u043d\u0438\u044f\u0442": "\u041a\u0438\u043d\u043e, \u0442\u0435\u0430\u0442\u0440, \u043a\u0438\u0442\u043e\u0431, \u043c\u0443\u0441\u0438\u049b\u0430 \u0432\u0430 \u0448\u0430\u04b3\u0430\u0440 \u04b3\u0430\u0451\u0442\u0438\u0434\u0430\u0433\u0438 \u043c\u0430\u0434\u0430\u043d\u0438\u0439 \u0432\u043e\u049b\u0435\u0430\u043b\u0430\u0440.",
    "\u0410\u043b\u043e\u049b\u0430": "\u0422\u0430\u04b3\u0440\u0438\u0440\u0438\u044f\u0442 \u0431\u0438\u043b\u0430\u043d \u0431\u043e\u0493\u043b\u0430\u043d\u0438\u0448, \u0440\u0435\u043a\u043b\u0430\u043c\u0430 \u0432\u0430 \u04b3\u0430\u043c\u043a\u043e\u0440\u043b\u0438\u043a \u0443\u0447\u0443\u043d \u043c\u0430\u044a\u043b\u0443\u043c\u043e\u0442\u043b\u0430\u0440.",
  },
  contact: [
    ["\u0422\u0430\u04b3\u0440\u0438\u0440\u0438\u044f\u0442", "\u042f\u043d\u0433\u0438\u043b\u0438\u043a, \u043f\u0440\u0435\u0441\u0441-\u0440\u0435\u043b\u0438\u0437 \u0451\u043a\u0438 \u0444\u043e\u0442\u043e \u043c\u0430\u0442\u0435\u0440\u0438\u0430\u043b \u044e\u0431\u043e\u0440\u0438\u0448 \u0443\u0447\u0443\u043d: news@ishonch.uz"],
    ["\u0420\u0435\u043a\u043b\u0430\u043c\u0430", "\u0411\u0440\u0435\u043d\u0434 \u043b\u043e\u0439\u0438\u04b3\u0430\u043b\u0430\u0440\u0438, \u0431\u0430\u043d\u043d\u0435\u0440\u043b\u0430\u0440 \u0432\u0430 \u043c\u0430\u0445\u0441\u0443\u0441 \u0441\u0430\u04b3\u0438\u0444\u0430\u043b\u0430\u0440: ads@ishonch.uz"],
    ["\u041c\u0430\u043d\u0437\u0438\u043b", "\u0422\u043e\u0448\u043a\u0435\u043d\u0442 \u0448\u0430\u04b3\u0440\u0438, \u043c\u0430\u0442\u0431\u0443\u043e\u0442 \u043c\u0430\u0440\u043a\u0430\u0437\u0438, 4-\u049b\u0430\u0432\u0430\u0442. \u0414\u0443\u0448\u0430\u043d\u0431\u0430-\u0436\u0443\u043c\u0430 09:00-18:00."],
  ],
  close: "Yopish",
  statsOnline: "🟢 \u041e\u043d\u043b\u0430\u0439\u043d",
  statsActions: "⚡ \u0410\u043c\u0430\u043b\u043b\u0430\u0440",
  statsVisits: "👥 \u0422\u0430\u0448\u0440\u0438\u0444\u043b\u0430\u0440",
  statsAvgTime: "⏱️ \u0412\u0435\u0431-\u0441\u0430\u0439\u0442\u0434\u0430\u0433\u0438 \u045e\u0440\u0442\u0430\u0447\u0430 \u0432\u0430\u049b\u0442",
};

const storyData = {
  uz: [
    {
      category: "Siyosat",
      title: "Hududlarda ochiq budjet muhokamalari yangi tartibda o'tkaziladi",
      summary: "Mahalliy kengashlar fuqarolar takliflarini ko'rib chiqish uchun raqamli jadval e'lon qiladi.",
      image: images.parliament,
      author: "Dilnoza Karimova",
      time: "12 daqiqa oldin",
      read: "4 daqiqa",
      body:
        "Tahririyat sharhiga ko'ra, yangi tartibning asosiy maqsadi qaror qabul qilish jarayonini tushunarli va kuzatiladigan qilishdir. Loyiha doirasida takliflar ochiq ro'yxatga olinadi, mas'ul tashkilotlar javobi esa belgilangan muddatlarda e'lon qilinadi.\n\nEkspertlar bunday yondashuv fuqarolarning ishonchini oshirishi mumkinligini ta'kidlaydi. Xususan, raqamli jadval orqali har bir fuqaro o'z taklifining ko'rib chiqilish holatini real vaqt rejimida kuzatishi mumkin bo'ladi.\n\nMahalliy kengashlar vakillari yangi tizim joriy etilgandan so'ng qarorlarni qabul qilish muddati o'rtacha 30 foizga qisqarishi kutilayotganini aytdi. Buning uchun maxsus platforma ishlab chiqilmoqda, u barcha viloyatlarda bir vaqtda sinov rejimiga kiradi.\n\nJamoatchilik vakillari esa tizimning samaradorligi ko'p jihatdan mas'ul shaxslarning javobgarligiga bog'liq ekanini ta'kidlamoqda. Monitoring guruhlar tashkil etilishi ham rejada bor.",
    },
    {
      category: "Iqtisod",
      title: "Kichik biznes uchun eksport maslahat markazlari ishga tushmoqda",
      summary: "Yangi xizmat mahsulot sertifikati, logistika va xorijiy bozor talablari bo'yicha yordam beradi.",
      image: images.business,
      author: "Akmal Saidov",
      time: "35 daqiqa oldin",
      read: "5 daqiqa",
      body:
        "Markazlar tadbirkorlarga hujjat tayyorlash, hamkor topish va narx strategiyasini hisoblashda ko'maklashadi. Birinchi bosqichda Toshkent, Samarqand va Farg'ona viloyatlarida 12 ta markaz ochiladi.\n\nMutaxassislar kichik ishlab chiqaruvchilar uchun eksportga chiqishdagi eng qiyin bosqich ko'pincha axborot yetishmasligi ekanini ta'kidlaydi. Yangi markazlar bu muammoni hal qilishga qaratilgan bo'lib, konsultatsiyalar bepul taqdim etiladi.\n\nXizmatlar ro'yxatiga mahsulot sertifikatlash, xorijiy hamkorlarni izlash, logistika yo'nalishlari bo'yicha maslahat va raqamli savdo platformalariga kiritish kiradi. Har bir tadbirkor maslahatchi bilan shaxsiy uchrashuv tashkil etishi mumkin.\n\nTadbirkorlik palatasi ma'lumotlariga ko'ra, o'tgan yili eksport hajmi o'tgan yilga nisbatan 18 foizga o'sdi. Yangi markazlar ushbu ko'rsatkichni yanada oshirishga xizmat qiladi deb kutilmoqda.",
    },
    {
      category: "Texnologiya",
      title: "Universitet laboratoriyasida mahalliy AI yordamchisi sinovdan o'tkazildi",
      summary: "Loyiha o'zbek tilidagi savol-javob, hujjat tahlili va ta'lim jarayoniga moslashishga qaratilgan.",
      image: images.tech,
      author: "Shahlo Nazarova",
      time: "1 soat oldin",
      read: "6 daqiqa",
      body:
        "Tizim hozircha yopiq sinovda bo'lib, talabalar va o'qituvchilar fikri asosida takomillashtirilmoqda. Loyiha bo'yicha texnik rahbar aytishicha, model 2 million so'zdan iborat o'zbekcha matn korpusida o'qitilgan.\n\nDasturchilar maxfiylik, manba ko'rsatish va noto'g'ri javoblarni kamaytirishga alohida e'tibor qaratgan. Tizim foydalanuvchi ma'lumotlarini serverda saqlamaydi va barcha so'rovlar shifrlangan kanal orqali uzatiladi.\n\nSinov davrasidagi talabalar yordamchini asosan referatlar yozish, mavzularni tushuntirish va imtihonga tayyorlanishda ishlatmoqda. O'qituvchilar esa u bilan test savollari tuzish va dars materiallarini tayyorlashda foydalanmoqda.\n\nLoyiha keyingi bosqichda boshqa oliy o'quv yurtlariga ham taqdim etilishi rejalashtirilgan. Mablag' masalasida bir nechta investorlar qiziqish bildirgan, ammo rasmiy shartnoma hali imzolanmagan.",
    },
    {
      category: "Sport",
      title: "Milliy chempionatning bahorgi bosqichi kutilmagan natijalar bilan boshlandi",
      summary: "Yosh futbolchilar asosiy tarkibda ko'proq maydonga tushmoqda, murabbiylar rotatsiyani oshirdi.",
      image: images.sport,
      author: "Jasur Tursunov",
      time: "2 soat oldin",
      read: "3 daqiqa",
      body:
        "Sport sharhlovchilarining fikricha, jamoalar mavsum o'rtasida tempni ushlab turish uchun akademiya tarbiyalanuvchilariga ko'proq imkoniyat bermoqda. Bu esa chempionatni yanada raqobatli qiladi.\n\nBirinchi turda eng ko'p e'tiborni tortgan o'yinda Nasaf jamoasi so'nggi daqiqada burilish yasab, kutilmagan g'alaba qozondi. 19 yoshli hujumchi Bobur Abdullayev o'z debyutida ikki gol urdi.\n\nMurabbiylar rotatsiya strategiyasini shu sababli afzal ko'rmoqda: uzoq muddatli jismoniy zo'riqishni kamaytirish va yoshlarni asosiy tarkibga bosqichma-bosqich kiritish maqsadida. Bir necha jamoada esa og'irlik markazdan chekkaga o'tkazildi.\n\nChempionat ixtisoslashtirilgan tahlilovchilarning fikricha, bu mavsum o'tgan ikki yilga qaraganda ancha qiziqarli bo'lishi kutilmoqda. Birinchi o'rin uchun kurashda to'rttadan ortiq jamoa da'vogar hisoblanmoqda.",
    },
    {
      category: "Madaniyat",
      title: "Shahar teatrlarida yosh rejissyorlar haftaligi ochildi",
      summary: "Dasturda eksperimental sahna asarlari, ochiq suhbatlar va mahorat darslari bor.",
      image: images.culture,
      author: "Malika Qodirova",
      time: "3 soat oldin",
      read: "4 daqiqa",
      body:
        "Haftalik tomoshabinni yangi sahna tili bilan tanishtirishni maqsad qilgan. Tashkilotchilar tadbir ijodkorlar va tomoshabin o'rtasidagi muloqotni kuchaytirishini kutmoqda.\n\nDasturda 14 yoshli iste'doddan tortib 32 yoshli professionallar ishtirok etmoqda. Ularning barchasi bir yil davomida maxsus rezidentsiya dasturida o'qib, ushbu haftalikka tayyorgarlik ko'rgan.\n\nPremyera spektakli «Tosh va Suv» — zamonaviy o'zbek adabiyotiga asoslangan bo'lib, sahna bezagi minimal, ammo harakatlar va ovoz effektlari nihoyatda boy. Tomoshabinlar spektakl davomida sahna atrofida erkin harakat qilishi mumkin.\n\nOchiq suhbatlar har kuni soat 18:00 da boshlanib, rejissyorlar va aktyor-aktrissalar bilan to'g'ridan-to'g'ri muloqot imkonini beradi. Mahorat darslari esa faqat oldindan ro'yxatdan o'tganlar uchun.",
    },
    {
      category: "Tahlil",
      title: "Shahar transportida raqamli to'lovlar nega tez ommalashmoqda?",
      summary: "Mutaxassislar qulaylik, monitoring va tarif siyosati o'rtasidagi bog'liqlikni izohlaydi.",
      image: images.analysis,
      author: "Zafar Jo'rayev",
      time: "Bugun",
      read: "7 daqiqa",
      body:
        "Raqamli to'lovlar yo'lovchi oqimini aniqroq baholash, yo'nalishlarni rejalash va xizmat sifatini nazorat qilish imkonini beradi. Shahar transport boshqarmasi ma'lumotlariga ko'ra, oxirgi olti oyda naqd pul to'lovlari 40 foizga kamaygan.\n\nMutaxassislar qulaylik, monitoring va tarif siyosati o'rtasidagi bog'liqlikni izohlaydi: raqamli to'lovlar orqali to'plangan ma'lumotlar asosida yo'nalishlar optimallashtirilmoqda. Bu esa yoqilg'i xarajatlarini qisqartirish va yo'lovchilarning kutish vaqtini kamaytirish imkonini bermoqda.\n\nBiroq bir qancha muammolar ham mavjud. Keksa yoshdagi yo'lovchilar va smartfon ishlatmaydigan fuqarolar uchun naqd to'lov imkonini saqlab qolish masalasi muhokamada. Ba'zi yo'nalishlarni boshqaruvchi xususiy operatorlar tizimga qo'shilishni istamasligini bildirmoqda.\n\nExpertlar yaqin 2 yil ichida shaharning 90 foiz transport tarmog'i to'liq raqamli to'lovga o'tishini prognoz qilmoqda. Qurilma o'rnatish xarajatlari davlat-xususiy hamkorlik doirasida moliyalashtiriliши rejalashtirilgan.",
    },
  ],
  ru: [
    {
      category: "Политика",
      title: "Обсуждения открытого бюджета в регионах пройдут по обновленным правилам",
      summary: "Местные советы будут публиковать цифровой график рассмотрения предложений граждан.",
      image: images.parliament,
      author: "Дильноза Каримова",
      time: "12 минут назад",
      read: "4 минуты",
      body:
        "По оценке редакции, цель обновленного порядка — сделать принятие решений понятным и отслеживаемым. Предложения будут попадать в открытый реестр, а ответы ответственных организаций должны публиковаться в установленные сроки.\n\nПредставители местных советов сообщили, что цифровой формат позволит отслеживать каждое обращение в режиме реального времени. Ожидается, что среднее время рассмотрения сократится на 30%.\n\nПо словам экспертов, ключевой вопрос — готовность самих организаций к прозрачности. Механизм публичного контроля создаёт дополнительное давление, но также требует административных ресурсов.\n\nВ пилотном режиме система заработает в трёх регионах уже в следующем квартале. По итогам оценки будет принято решение о полном внедрении.",
    },
    {
      category: "Экономика",
      title: "Для малого бизнеса запускают консультационные центры по экспорту",
      summary: "Сервис поможет с сертификатами, логистикой и требованиями зарубежных рынков.",
      image: images.business,
      author: "Акмаль Саидов",
      time: "35 минут назад",
      read: "5 минут",
      body:
        "Центры помогут предпринимателям готовить документы, искать партнеров и рассчитывать ценовую стратегию. На первом этапе откроются 12 центров в Ташкенте, Самарканде и Фергане.\n\nЭксперты отмечают, что нехватка информации часто становится самым сложным этапом выхода на экспорт. Новые центры призваны устранить этот барьер, предоставляя бесплатные консультации.\n\nВ перечень услуг входит сертификация продукции, поиск зарубежных партнёров, логистика и подключение к цифровым торговым платформам. Каждый предприниматель сможет записаться на личную встречу с консультантом.\n\nПо данным Торгово-промышленной палаты, в прошлом году объём экспорта вырос на 18%. Новые центры, по прогнозам, позволят увеличить этот показатель ещё на 10–15% в течение двух лет.",
    },
    {
      category: "Технологии",
      title: "В университетской лаборатории протестировали локального AI-помощника",
      summary: "Проект ориентирован на вопросы на узбекском языке, анализ документов и образовательные сценарии.",
      image: images.tech,
      author: "Шахло Назарова",
      time: "1 час назад",
      read: "6 минут",
      body:
        "Система пока проходит закрытое тестирование и улучшается на основе отзывов студентов и преподавателей. По словам технического руководителя проекта, модель обучена на корпусе из 2 миллионов слов на узбекском языке.\n\nРазработчики уделяют особое внимание приватности: система не хранит данные пользователей, все запросы передаются по зашифрованному каналу. Ссылки на источники отображаются прямо в ответах.\n\nСтуденты в основном используют помощника для написания рефератов, объяснения тем и подготовки к экзаменам. Преподаватели — для составления тестов и учебных материалов.\n\nНа следующем этапе планируется предложить систему другим вузам. Несколько инвесторов уже проявили интерес, но официальные договорённости пока не достигнуты.",
    },
    {
      category: "Спорт",
      title: "Весенний этап национального чемпионата начался с неожиданных результатов",
      summary: "Молодые игроки чаще выходят в основном составе, тренеры активнее используют ротацию.",
      image: images.sport,
      author: "Жасур Турсунов",
      time: "2 часа назад",
      read: "3 минуты",
      body:
        "Спортивные обозреватели считают, что клубы чаще дают шанс воспитанникам академий, чтобы удержать темп в середине сезона. Это делает чемпионат более конкурентным.\n\nВ первом туре особое внимание привлёк матч, в котором «Насаф» вырвал победу на последних минутах. 19-летний нападающий Бобур Абдуллаев дебютировал с дублем.\n\nТренерский штаб нескольких клубов признал, что стратегия ротации продиктована необходимостью снизить физическую нагрузку и постепенно вводить молодёжь в основной состав. В ряде команд акцент сместился с центра на фланги.\n\nПо мнению аналитиков, этот сезон обещает быть насыщеннее предыдущих двух. За первое место претендуют как минимум четыре клуба.",
    },
    {
      category: "Культура",
      title: "В городских театрах открылась неделя молодых режиссеров",
      summary: "В программе экспериментальные постановки, открытые дискуссии и мастер-классы.",
      image: images.culture,
      author: "Малика Кадырова",
      time: "3 часа назад",
      read: "4 минуты",
      body:
        "Неделя знакомит зрителей с новым сценическим языком. Организаторы ожидают, что событие усилит диалог между авторами и аудиторией.\n\nВ программе участвуют режиссёры от 14 до 32 лет, прошедшие годовую резиденцию. Премьерный спектакль «Камень и Вода» по мотивам современной узбекской прозы использует минималистичную сценографию и богатый саундскейп.\n\nОткрытые дискуссии проходят ежедневно в 18:00, мастер-классы доступны по предварительной записи. Организаторы рассчитывают привлечь более 3 000 зрителей за неделю.\n\nПо словам куратора программы, главная цель — разрушить барьер между сценой и залом и показать, что современный театр может говорить на языке молодого поколения.",
    },
    {
      category: "Аналитика",
      title: "Почему цифровая оплата быстро распространяется в городском транспорте?",
      summary: "Эксперты объясняют связь между удобством, мониторингом и тарифной политикой.",
      image: images.analysis,
      author: "Зафар Джураев",
      time: "Сегодня",
      read: "7 минут",
      body:
        "Цифровые платежи помогают точнее оценивать пассажиропоток, планировать маршруты и контролировать качество сервиса. По данным городского транспортного управления, за последние полгода наличные платежи сократились на 40%.\n\nЭксперты объясняют это совокупностью факторов: удобством для пассажиров, интеграцией с картами и приложениями, а также тарифными стимулами. Оцифрованные данные позволяют оптимизировать маршруты и сократить расходы на топливо.\n\nТем не менее остаются нерешённые проблемы. Для пожилых пассажиров и тех, кто не пользуется смартфонами, необходимо сохранить наличный расчёт. Часть частных операторов пока сопротивляется переходу на систему.\n\nАналитики прогнозируют, что в течение двух лет 90% городского транспорта перейдёт на цифровую оплату. Расходы на оборудование планируется покрыть в рамках государственно-частного партнёрства.",
    },
  ],
};
storyData["uzk"] = [
  {
    category: "Siyosat",
    title: "\u04b2\u0443\u0434\u0443\u0434\u043b\u0430\u0440\u0434\u0430 \u043e\u0447\u0438\u049b \u0431\u0443\u0434\u0436\u0435\u0442 \u043c\u0443\u04b3\u043e\u043a\u0430\u043c\u0430\u043b\u0430\u0440\u0438 \u044f\u043d\u0433\u0438 \u0442\u0430\u0440\u0442\u0438\u0431\u0434\u0430 \u045e\u0442\u043a\u0430\u0437\u0438\u043b\u0430\u0434\u0438",
    summary: "\u041c\u0430\u04b3\u0430\u043b\u043b\u0438\u0439 \u043a\u0435\u043d\u0433\u0430\u0448\u043b\u0430\u0440 \u0444\u0443\u049b\u0430\u0440\u043e\u043b\u0430\u0440 \u0442\u0430\u043a\u043b\u0438\u0444\u043b\u0430\u0440\u0438\u043d\u0438 \u043a\u045e\u0440\u0438\u0431 \u0447\u0438\u049b\u0438\u0448 \u0443\u0447\u0443\u043d \u0440\u0430\u049b\u0430\u043c\u043b\u0438 \u0436\u0430\u0434\u0432\u0430\u043b \u0435\u02bc\u043b\u043e\u043d \u049b\u0438\u043b\u0430\u0434\u0438.",
    image: images.parliament,
    author: "\u0414\u0438\u043b\u043d\u043e\u0437\u0430 \u041a\u0430\u0440\u0438\u043c\u043e\u0432\u0430",
    time: "12 \u0434\u0430\u049b\u0438\u049b\u0430 \u043e\u043b\u0434\u0438\u043d",
    read: "4 \u0434\u0430\u049b\u0438\u049b\u0430",
    status: "published",
    body: "\u0422\u0430\u04b3\u0440\u0438\u0440\u0438\u044f\u0442 \u0448\u0430\u0440\u04b3\u0438\u0433\u0430 \u043a\u045e\u0440\u0430, \u044f\u043d\u0433\u0438 \u0442\u0430\u0440\u0442\u0438\u0431\u043d\u0438\u043d\u0433 \u0430\u0441\u043e\u0441\u0438\u0439 \u043c\u0430\u049b\u0441\u0430\u0434\u0438 \u049b\u0430\u0440\u043e\u0440 \u049b\u0430\u0431\u0443\u043b \u049b\u0438\u043b\u0438\u0448 \u0436\u0430\u0440\u0430\u0451\u043d\u0438\u043d\u0438 \u0442\u0443\u0448\u0443\u043d\u0430\u0440\u043b\u0438 \u0432\u0430 \u043a\u0443\u0437\u0430\u0442\u0438\u043b\u0430\u0434\u0438\u0433\u0430\u043d \u049b\u0438\u043b\u0438\u0448\u0434\u0438\u0440.\n\n\u041c\u0430\u04b3\u0430\u043b\u043b\u0438\u0439 \u043a\u0435\u043d\u0433\u0430\u0448\u043b\u0430\u0440 \u0432\u0430\u043a\u0438\u043b\u043b\u0430\u0440\u0438 \u044f\u043d\u0433\u0438 \u0442\u0438\u0437\u0438\u043c \u0436\u043e\u0440\u0438\u0439 \u044d\u0442\u0438\u043b\u0433\u0430\u043d\u0434\u0430\u043d \u0441\u045e\u043d\u0433 \u049b\u0430\u0440\u043e\u0440\u043b\u0430\u0440\u043d\u0438 \u049b\u0430\u0431\u0443\u043b \u049b\u0438\u043b\u0438\u0448 \u043c\u0443\u0434\u0434\u0430\u0442\u0438 \u045e\u0440\u0442\u0430\u0447\u0430 30 \u0444\u043e\u0438\u0437\u0433\u0430 \u049b\u0438\u0441\u049b\u0430\u0440\u0438\u0448\u0438 \u043a\u0443\u0442\u0438\u043b\u0430\u0451\u0442\u0433\u0430\u043d\u0438\u043d\u0438 \u0430\u0439\u0442\u0434\u0438.",
  },
  {
    category: "Iqtisod",
    title: "\u041a\u0438\u0447\u0438\u043a \u0431\u0438\u0437\u043d\u0435\u0441 \u0443\u0447\u0443\u043d \u044d\u043a\u0441\u043f\u043e\u0440\u0442 \u043c\u0430\u0441\u043b\u0430\u04b3\u0430\u0442 \u043c\u0430\u0440\u043a\u0430\u0437\u043b\u0430\u0440\u0438 \u0438\u0448\u0433\u0430 \u0442\u0443\u0448\u043c\u043e\u049b\u0434\u0430",
    summary: "\u042f\u043d\u0433\u0438 \u0445\u0438\u0437\u043c\u0430\u0442 \u043c\u0430\u04b3\u0441\u0443\u043b\u043e\u0442 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043a\u0430\u0442\u0438, \u043b\u043e\u0433\u0438\u0441\u0442\u0438\u043a\u0430 \u0432\u0430 \u0445\u043e\u0440\u0438\u0436\u0438\u0439 \u0431\u043e\u0437\u043e\u0440 \u0442\u0430\u043b\u0430\u0431\u043b\u0430\u0440\u0438 \u0431\u045e\u0439\u0438\u0447\u0430 \u0451\u0440\u0434\u0430\u043c \u0431\u0435\u0440\u0430\u0434\u0438.",
    image: images.business,
    author: "\u0410\u043a\u043c\u0430\u043b \u0421\u0430\u0438\u0434\u043e\u0432",
    time: "35 \u0434\u0430\u049b\u0438\u049b\u0430 \u043e\u043b\u0434\u0438\u043d",
    read: "5 \u0434\u0430\u049b\u0438\u049b\u0430",
    status: "published",
    body: "\u041c\u0430\u0440\u043a\u0430\u0437\u043b\u0430\u0440 \u0442\u0430\u0434\u0431\u0438\u0440\u043a\u043e\u0440\u043b\u0430\u0440\u0433\u0430 \u04b3\u0443\u0436\u0436\u0430\u0442 \u0442\u0430\u0439\u0451\u0440\u043b\u0430\u0448, \u04b3\u0430\u043c\u043a\u043e\u0440 \u0442\u043e\u043f\u0438\u0448 \u0432\u0430 \u043d\u0430\u0440\u0445 \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044f\u0441\u0438\u043d\u0438 \u04b3\u0438\u0441\u043e\u0431\u043b\u0430\u0448\u0434\u0430 \u043a\u045e\u043c\u0430\u043a\u043b\u0430\u0448\u0430\u0434\u0438.\n\n\u0422\u0430\u0434\u0431\u0438\u0440\u043a\u043e\u0440\u043b\u0438\u043a \u043f\u0430\u043b\u0430\u0442\u0430\u0441\u0438 \u043c\u0430\u044a\u043b\u0443\u043c\u043e\u0442\u043b\u0430\u0440\u0438\u0433\u0430 \u043a\u045e\u0440\u0430, \u045e\u0442\u0433\u0430\u043d \u0439\u0438\u043b\u0438 \u044d\u043a\u0441\u043f\u043e\u0440\u0442 \u04b3\u0430\u0436\u043c\u0438 18 \u0444\u043e\u0438\u0437\u0433\u0430 \u045e\u0441\u0434\u0438.",
  },
  {
    category: "Texnologiya",
    title: "\u0423\u043d\u0438\u0432\u0435\u0440\u0441\u0438\u0442\u0435\u0442 \u043b\u0430\u0431\u043e\u0440\u0430\u0442\u043e\u0440\u0438\u044f\u0441\u0438\u0434\u0430 \u043c\u0430\u04b3\u0430\u043b\u043b\u0438\u0439 AI \u0451\u0440\u0434\u0430\u043c\u0447\u0438\u0441\u0438 \u0441\u0438\u043d\u043e\u0432\u0434\u0430\u043d \u045e\u0442\u043a\u0430\u0437\u0438\u043b\u0434\u0438",
    summary: "\u041b\u043e\u0439\u0438\u04b3\u0430 \u045e\u0437\u0431\u0435\u043a \u0442\u0438\u043b\u0438\u0434\u0430\u0433\u0438 \u0441\u0430\u0432\u043e\u043b-\u0436\u0430\u0432\u043e\u0431, \u04b3\u0443\u0436\u0436\u0430\u0442 \u0442\u0430\u04b3\u043b\u0438\u043b\u0438 \u0432\u0430 \u0442\u0430\u044a\u043b\u0438\u043c \u0436\u0430\u0440\u0430\u0451\u043d\u0438\u0433\u0430 \u043c\u043e\u0441\u043b\u0430\u0448\u0438\u0448\u0433\u0430 \u049b\u0430\u0440\u0430\u0442\u0438\u043b\u0433\u0430\u043d.",
    image: images.tech,
    author: "\u0428\u0430\u04b3\u043b\u043e \u041d\u0430\u0437\u0430\u0440\u043e\u0432\u0430",
    time: "1 \u0441\u043e\u0430\u0442 \u043e\u043b\u0434\u0438\u043d",
    read: "6 \u0434\u0430\u049b\u0438\u049b\u0430",
    status: "published",
    body: "\u0422\u0438\u0437\u0438\u043c \u04b3\u043e\u0437\u0438\u0440\u0447\u0430 \u0451\u043f\u0438\u049b \u0441\u0438\u043d\u043e\u0432\u0434\u0430 \u0431\u045e\u043b\u0438\u0431, \u0442\u0430\u043b\u0430\u0431\u0430\u043b\u0430\u0440 \u0432\u0430 \u045e\u049b\u0438\u0442\u0443\u0432\u0447\u0438\u043b\u0430\u0440 \u0444\u0438\u043a\u0440\u0438 \u0430\u0441\u043e\u0441\u0438\u0434\u0430 \u0442\u0430\u043a\u043e\u043c\u043e\u043b\u043b\u0430\u0448\u0442\u0438\u0440\u0438\u043b\u043c\u043e\u049b\u0434\u0430.\n\n\u041c\u043e\u0434\u0435\u043b 2 \u043c\u0438\u043b\u043b\u0438\u043e\u043d \u0441\u045e\u0437\u0434\u0430\u043d \u0438\u0431\u043e\u0440\u0430\u0442 \u045e\u0437\u0431\u0435\u043a\u0447\u0430 \u043c\u0430\u0442\u043d \u043a\u043e\u0440\u043f\u0443\u0441\u0438\u0434\u0430 \u045e\u049b\u0438\u0442\u0438\u043b\u0433\u0430\u043d.",
  },
  {
    category: "Sport",
    title: "\u041c\u0438\u043b\u043b\u0438\u0439 \u0447\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u043d\u0438\u043d\u0433 \u0431\u0430\u04b3\u043e\u0440\u0433\u0438 \u0431\u043e\u0441\u049b\u0438\u0447\u0438 \u043a\u0443\u0442\u0438\u043b\u043c\u0430\u0433\u0430\u043d \u043d\u0430\u0442\u0438\u0436\u0430\u043b\u0430\u0440 \u0431\u0438\u043b\u0430\u043d \u0431\u043e\u0448\u043b\u0430\u043d\u0434\u0438",
    summary: "\u0419\u043e\u0448 \u0444\u0443\u0442\u0431\u043e\u043b\u0447\u0438\u043b\u0430\u0440 \u0430\u0441\u043e\u0441\u0438\u0439 \u0442\u0430\u0440\u043a\u0438\u0431\u0434\u0430 \u043a\u045e\u043f\u0440\u043e\u049b \u043c\u0430\u0439\u0434\u043e\u043d\u0433\u0430 \u0442\u0443\u0448\u043c\u043e\u049b\u0434\u0430, \u043c\u0443\u0440\u0430\u0431\u0431\u0438\u0439\u043b\u0430\u0440 \u0440\u043e\u0442\u0430\u0446\u0438\u044f\u043d\u0438 \u043e\u0448\u0438\u0440\u0434\u0438.",
    image: images.sport,
    author: "\u0416\u0430\u0441\u0443\u0440 \u0422\u0443\u0440\u0441\u0443\u043d\u043e\u0432",
    time: "2 \u0441\u043e\u0430\u0442 \u043e\u043b\u0434\u0438\u043d",
    read: "3 \u0434\u0430\u049b\u0438\u049b\u0430",
    status: "published",
    body: "19 \u044f\u0448\u043b\u0438 \u04b3\u0443\u0436\u0443\u043c\u0447\u0438 \u0411\u043e\u0431\u0443\u0440 \u0410\u0431\u0434\u0443\u043b\u043b\u0430\u0435\u0432 \u045e\u0437 \u0434\u0435\u0431\u044e\u0442\u0438\u0434\u0430 \u0438\u043a\u043a\u0438 \u0433\u043e\u043b \u0443\u0440\u0434\u0438.\n\n\u041d\u0430\u0441\u0430\u0444 \u0436\u0430\u043c\u043e\u0430\u0441\u0438 \u0441\u045e\u043d\u0433\u0433\u0438 \u0434\u0430\u049b\u0438\u049b\u0430\u0434\u0430 \u0431\u0443\u0440\u0438\u043b\u0438\u0448 \u044f\u0441\u0430\u0431, \u043a\u0443\u0442\u0438\u043b\u043c\u0430\u0433\u0430\u043d \u0433\u02bc\u0430\u043b\u0430\u0431\u0430 \u049b\u043e\u0437\u043e\u043d\u0434\u0438.",
  },
  {
    category: "Madaniyat",
    title: "\u0428\u0430\u04b3\u0430\u0440 \u0442\u0435\u0430\u0442\u0440\u043b\u0430\u0440\u0438\u0434\u0430 \u0439\u043e\u0448 \u0440\u0435\u0436\u0438\u0441\u0441\u0451\u0440\u043b\u0430\u0440 \u04b3\u0430\u0444\u0442\u0430\u043b\u0438\u0433\u0438 \u043e\u0447\u0438\u043b\u0434\u0438",
    summary: "\u0414\u0430\u0441\u0442\u0443\u0440\u0434\u0430 \u044d\u043a\u0441\u043f\u0435\u0440\u0438\u043c\u0435\u043d\u0442\u0430\u043b \u0441\u0430\u04b3\u043d\u0430 \u0430\u0441\u0430\u0440\u043b\u0430\u0440\u0438, \u043e\u0447\u0438\u049b \u0441\u0443\u04b3\u0431\u0430\u0442\u043b\u0430\u0440 \u0432\u0430 \u043c\u0430\u04b3\u043e\u0440\u0430\u0442 \u0434\u0430\u0440\u0441\u043b\u0430\u0440\u0438 \u0431\u043e\u0440.",
    image: images.culture,
    author: "\u041c\u0430\u043b\u0438\u043a\u0430 \u049a\u043e\u0434\u0438\u0440\u043e\u0432\u0430",
    time: "3 \u0441\u043e\u0430\u0442 \u043e\u043b\u0434\u0438\u043d",
    read: "4 \u0434\u0430\u049b\u0438\u049b\u0430",
    status: "published",
    body: "\u04b2\u0430\u0444\u0442\u0430\u043b\u0438\u043a 14 \u0439\u043e\u0448\u043b\u0438 \u0438\u0441\u0442\u0435\u02bc\u0434\u043e\u0434\u0434\u0430\u043d \u0442\u043e\u0440\u0442\u0438\u0431 32 \u044f\u0448\u043b\u0438 \u043f\u0440\u043e\u0444\u0435\u0441\u0441\u0438\u043e\u043d\u0430\u043b\u043b\u0430\u0440 \u0438\u0448\u0442\u0438\u0440\u043e\u043a \u044d\u0442\u043c\u043e\u049b\u0434\u0430.\n\n\u041f\u0440\u0435\u043c\u044c\u0435\u0440\u0430 \u0441\u043f\u0435\u043a\u0442\u0430\u043a\u043b\u0438 \u00ab\u0422\u043e\u0448 \u0432\u0430 \u0421\u0443\u0432\u00bb \u2014 \u0437\u0430\u043c\u043e\u043d\u0430\u0432\u0438\u0439 \u045e\u0437\u0431\u0435\u043a \u0430\u0434\u0430\u0431\u0438\u0451\u0442\u0438\u0433\u0430 \u0430\u0441\u043e\u0441\u043b\u0430\u043d\u0433\u0430\u043d.",
  },
  {
    category: "Tahlil",
    title: "\u0428\u0430\u04b3\u0430\u0440 \u0442\u0440\u0430\u043d\u0441\u043f\u043e\u0440\u0442\u0438\u0434\u0430 \u0440\u0430\u049b\u0430\u043c\u043b\u0438 \u0442\u045e\u043b\u043e\u0432\u043b\u0430\u0440 \u043d\u0435\u0433\u0430 \u0442\u0435\u0437 \u043e\u043c\u043c\u0430\u043b\u0430\u0448\u043c\u043e\u049b\u0434\u0430?",
    summary: "\u041c\u0443\u0442\u0430\u0445\u0430\u0441\u0441\u0438\u0441\u043b\u0430\u0440 \u049b\u0443\u043b\u0430\u0439\u043b\u0438\u043a, \u043c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 \u0432\u0430 \u0442\u0430\u0440\u0438\u0444 \u0441\u0438\u0451\u0441\u0430\u0442\u0438 \u045e\u0440\u0442\u0430\u0441\u0438\u0434\u0430\u0433\u0438 \u0431\u043e\u0493\u043b\u0438\u049b\u043b\u0438\u043a\u043d\u0438 \u0438\u0437\u043e\u04b3\u043b\u0430\u0439\u0434\u0438.",
    image: images.analysis,
    author: "\u0417\u0430\u0444\u0430\u0440 \u0416\u045e\u0440\u0430\u0435\u0432",
    time: "\u0411\u0443\u0433\u0443\u043d",
    read: "7 \u0434\u0430\u049b\u0438\u049b\u0430",
    status: "published",
    body: "\u0420\u0430\u049b\u0430\u043c\u043b\u0438 \u0442\u045e\u043b\u043e\u0432\u043b\u0430\u0440 \u0439\u045e\u043b\u043e\u0432\u0447\u0438 \u043e\u049b\u0438\u043c\u0438\u043d\u0438 \u0430\u043d\u0438\u049b\u0440\u043e\u049b \u0431\u0430\u04b3\u043e\u043b\u0430\u0448, \u0439\u045e\u043d\u0430\u043b\u0438\u0448\u043b\u0430\u0440\u043d\u0438 \u0440\u0435\u0436\u0430\u043b\u0430\u0448 \u0432\u0430 \u0445\u0438\u0437\u043c\u0430\u0442 \u0441\u0438\u0444\u0430\u0442\u0438\u043d\u0438 \u043d\u0430\u0437\u043e\u0440\u0430\u0442 \u049b\u0438\u043b\u0438\u0448 \u0438\u043c\u043a\u043e\u043d\u0438\u043d\u0438 \u0431\u0435\u0440\u0430\u0434\u0438.\n\n\u041e\u0445\u0438\u0440\u0433\u0438 \u043e\u043b\u0442\u0438 \u043e\u0439\u0434\u0430 \u043d\u0430\u049b\u0434 \u043f\u0443\u043b \u0442\u045e\u043b\u043e\u0432\u043b\u0430\u0440\u0438 40 \u0444\u043e\u0438\u0437\u0433\u0430 \u043a\u0430\u043c\u0430\u0439\u0433\u0430\u043d.",
  },
];

const mediaItems = {
  uz: [
    ["video", "Dunyoda nechta AES bor va ularning birinchisi qayerda qurilgan?", "Jahon | 09:38", images.power],
    ["video", "Marg'ilonda yangi turizm majmuasi va 7 millionga yaqinlashgan o'rtacha ish haqi", "O'zbekiston | 19:50", images.tourism],
    ["video", "Aksiyadorlardan qarzdorlik, kompensatsiya masalasi sudlashyaptimi?", "O'zbekiston | 19:00", images.cityPeople],
    ["photo", "Egnidagi formasiga ishonib qolibman: YHXB inspektori odamlarni chuv tushirdi", "O'zbekiston | 17:00", images.road],
    ["video", "LIVE: Vashingtondagi otishma va Moskvaga borgan Aroqcchi", "Jahon | 15:07", images.debate],
    ["video", "Putin-Aroqcchi uchrashuvi, Eron taklifi va kun dayjesti", "Jahon | 14:48", images.diplomacy],
    ["photo", "Imperiyalar qabristoni: nega yirik davlatlar Afg'onistonni bo'ysundira olmagan?", "Jahon | 11:34", images.map],
    ["video", "Tramp suiqasddan omon chiqdi, yana!", "Jahon | 22:19", images.studio],
    ["photo", "Samarqandda xalqaro madaniyat festivali: yorqin lahzalar", "Madaniyat | 13:20", images.photo1],
    ["photo", "Toshkentning yangi ko'rinishi: shahar qurilishlari fotoreportaj", "O'zbekiston | 10:45", images.photo2],
    ["photo", "Tog' va tabiat: O'zbekiston manzaralari", "Tabiat | 08:30", images.photo3],
    ["photo", "Yoshlar forumi: ishtirokchilar va g'oyalar", "Jamiyat | 16:00", images.photo4],
    ["photo", "Xayriya aksiyasi: minglab oilalarga yordam yetkazildi", "Jamiyat | 11:00", images.photo5],
    ["photo", "Milliy kiyim kuni: an'anaviy liboslar namoyishi", "Madaniyat | 09:15", images.photo6],
  ],
  uzk: [
    ["video", "\u0414\u0443\u043d\u0451\u0434\u0430 \u043d\u0435\u0447\u0442\u0430 \u0410\u0415\u0421 \u0431\u043e\u0440 \u0432\u0430 \u0443\u043b\u0430\u0440\u043d\u0438\u043d\u0433 \u0431\u0438\u0440\u0438\u043d\u0447\u0438\u0441\u0438 \u049b\u0430\u0439\u0435\u0440\u0434\u0430 \u049b\u0443\u0440\u0438\u043b\u0433\u0430\u043d?", "\u0414\u0443\u043d\u0451 | 09:38", images.power],
    ["video", "\u041c\u0430\u0440\u0493\u0438\u043b\u043e\u043d\u0434\u0430 \u044f\u043d\u0433\u0438 \u0442\u0443\u0440\u0438\u0437\u043c \u043c\u0430\u0436\u043c\u0443\u0430\u0441\u0438 \u0432\u0430 \u045e\u0440\u0442\u0430\u0447\u0430 \u0438\u0448 \u04b3\u0430\u049b\u0438", "\u045e\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u043e\u043d | 19:50", images.tourism],
    ["video", "\u0410\u043a\u0441\u0438\u044f\u0434\u043e\u0440\u043b\u0430\u0440\u0434\u0430\u043d \u049b\u0430\u0440\u0437\u0434\u043e\u0440\u043b\u0438\u043a \u0432\u0430 \u043a\u043e\u043c\u043f\u0435\u043d\u0441\u0430\u0446\u0438\u044f", "\u045e\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u043e\u043d | 19:00", images.cityPeople],
    ["photo", "\u0418\u043d\u0441\u043f\u0435\u043a\u0442\u043e\u0440 \u0444\u043e\u0440\u043c\u0430\u0441\u0438\u0434\u0430\u043d \u0444\u043e\u0439\u0434\u0430\u043b\u0430\u043d\u0438\u0431 \u043e\u0434\u0430\u043c\u043b\u0430\u0440\u043d\u0438 \u0430\u043b\u0434\u0430\u0434\u0438", "\u045e\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u043e\u043d | 17:00", images.road],
    ["video", "LIVE: \u0412\u0430\u0448\u0438\u043d\u0433\u0442\u043e\u043d\u0434\u0430\u0433\u0438 \u043e\u0442\u0438\u0448\u043c\u0430 \u0432\u0430 \u041c\u043e\u0441\u043a\u0432\u0430\u0433\u0430 \u0431\u043e\u0440\u0433\u0430\u043d \u0410\u0440\u043e\u049b\u0447\u0447\u0438", "\u0414\u0443\u043d\u0451 | 15:07", images.debate],
    ["video", "\u041f\u0443\u0442\u0438\u043d-\u0410\u0440\u043e\u049b\u0447\u0447\u0438 \u0443\u0447\u0440\u0430\u0448\u0443\u0432\u0438, \u0415\u0440\u043e\u043d \u0442\u0430\u043a\u043b\u0438\u0444\u0438 \u0432\u0430 \u043a\u0443\u043d \u0434\u0430\u0439\u0436\u0435\u0441\u0442\u0438", "\u0414\u0443\u043d\u0451 | 14:48", images.diplomacy],
    ["photo", "\u0418\u043c\u043f\u0435\u0440\u0438\u044f\u043b\u0430\u0440 \u049b\u0430\u0431\u0440\u0438\u0441\u0442\u043e\u043d\u0438: \u043d\u0435\u0433\u0430 \u0410\u0444\u0493\u043e\u043d\u0438\u0441\u0442\u043e\u043d \u0431\u045e\u0439\u0441\u0443\u043d\u0434\u0438\u0440\u0438\u043b\u043c\u0430\u0434\u0438?", "\u0414\u0443\u043d\u0451 | 11:34", images.map],
    ["video", "\u0422\u0440\u0430\u043c\u043f \u0441\u0443\u0438\u049b\u0430\u0441\u0434\u0434\u0430\u043d \u043e\u043c\u043e\u043d \u0447\u0438\u049b\u0434\u0438", "\u0414\u0443\u043d\u0451 | 22:19", images.studio],
    ["photo", "\u0421\u0430\u043c\u0430\u0440\u049b\u0430\u043d\u0434\u0434\u0430 \u0445\u0430\u043b\u049b\u0430\u0440\u043e \u043c\u0430\u0434\u0430\u043d\u0438\u044f\u0442 \u0444\u0435\u0441\u0442\u0438\u0432\u0430\u043b\u0438", "\u041c\u0430\u0434\u0430\u043d\u0438\u044f\u0442 | 13:20", images.photo1],
    ["photo", "\u0422\u043e\u0448\u043a\u0435\u043d\u0442\u043d\u0438\u043d\u0433 \u044f\u043d\u0433\u0438 \u043a\u045e\u0440\u0438\u043d\u0438\u0448\u0438: \u0448\u0430\u04b3\u0430\u0440 \u049b\u0443\u0440\u0438\u043b\u0438\u0448\u043b\u0430\u0440\u0438 \u0444\u043e\u0442\u043e\u0440\u0435\u043f\u043e\u0440\u0442\u0430\u0436", "\u045e\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u043e\u043d | 10:45", images.photo2],
    ["photo", "\u0422\u043e\u0493\u02bc \u0432\u0430 \u0442\u0430\u0431\u0438\u0430\u0442: \u045e\u0437\u0431\u0435\u043a\u0438\u0441\u0442\u043e\u043d \u043c\u0430\u043d\u0437\u0430\u0440\u0430\u043b\u0430\u0440\u0438", "\u0422\u0430\u0431\u0438\u0430\u0442 | 08:30", images.photo3],
    ["photo", "\u0419\u043e\u0448\u043b\u0430\u0440 \u0444\u043e\u0440\u0443\u043c\u0438: \u0438\u0448\u0442\u0438\u0440\u043e\u043a\u0447\u0438\u043b\u0430\u0440 \u0432\u0430 \u0433\u02bc\u043e\u044f\u043b\u0430\u0440", "\u0416\u0430\u043c\u0438\u044f\u0442 | 16:00", images.photo4],
    ["photo", "\u0425\u0430\u0439\u0440\u0438\u044f \u0430\u043a\u0441\u0438\u044f\u0441\u0438: \u043c\u0438\u043d\u0433\u043b\u0430\u0431 \u043e\u0438\u043b\u0430\u0433\u0430 \u0451\u0440\u0434\u0430\u043c \u0435\u0442\u043a\u0430\u0437\u0438\u043b\u0434\u0438", "\u0416\u0430\u043c\u0438\u044f\u0442 | 11:00", images.photo5],
    ["photo", "\u041c\u0438\u043b\u043b\u0438\u0439 \u043a\u0438\u0439\u0438\u043c \u043a\u0443\u043d\u0438: \u0430\u043d\u044a\u0430\u043d\u0430\u0432\u0438\u0439 \u043b\u0438\u0431\u043e\u0441\u043b\u0430\u0440 \u043d\u0430\u043c\u043e\u0439\u0438\u0448\u0438", "\u041c\u0430\u0434\u0430\u043d\u0438\u044f\u0442 | 09:15", images.photo6],
  ],
  ru: [
    ["video", "Сколько в мире АЭС и где построили первую?", "Мир | 09:38", images.power],
    ["video", "Новый туристический комплекс и рынок труда", "Узбекистан | 19:50", images.tourism],
    ["video", "Долги перед акционерами и компенсации", "Узбекистан | 19:00", images.cityPeople],
    ["photo", "Инспектор использовал форму для обмана людей", "Узбекистан | 17:00", images.road],
    ["video", "LIVE: стрельба в Вашингтоне и переговоры в Москве", "Мир | 15:07", images.debate],
    ["video", "Встреча Путина, предложение Ирана и дайджест", "Мир | 14:48", images.diplomacy],
    ["photo", "Кладбище империй: почему Афганистан не покорился?", "Мир | 11:34", images.map],
    ["video", "Трамп пережил покушение", "Мир | 22:19", images.studio],
    ["photo", "Международный культурный фестиваль в Самарканде: яркие моменты", "Культура | 13:20", images.photo1],
    ["photo", "Новый облик Ташкента: фоторепортаж о городских стройках", "Узбекистан | 10:45", images.photo2],
    ["photo", "Горы и природа: пейзажи Узбекистана", "Природа | 08:30", images.photo3],
    ["photo", "Молодёжный форум: участники и идеи", "Общество | 16:00", images.photo4],
    ["photo", "Благотворительная акция: помощь тысячам семей", "Общество | 11:00", images.photo5],
    ["photo", "День национального костюма: показ традиционных нарядов", "Культура | 09:15", images.photo6],
  ],
};

const cyrCategoryLabels = {
  Siyosat: "Сиёсат",
  Iqtisod: "Иқтисод",
  Texnologiya: "Технология",
  Sport: "Спорт",
  Madaniyat: "Маданият",
  Tahlil: "Таҳлил",
  Aloqa: "Алоқа",
};

const categoryMap = {
  uz: {
    "Bosh sahifa": null,
    Siyosat: "Siyosat",
    Iqtisod: "Iqtisod",
    Texnologiya: "Texnologiya",
    Sport: "Sport",
    Madaniyat: "Madaniyat",
    Aloqa: "Aloqa",
  },
  ru: {
    Главная: null,
    Политика: "Политика",
    Экономика: "Экономика",
    Технологии: "Технологии",
    Спорт: "Спорт",
    Культура: "Культура",
    Контакты: "Контакты",
  },
};
categoryMap["uzk"] = {
  "\u0411\u043e\u0448 \u0441\u0430\u04b3\u0438\u0444\u0430": null,
  "\u0421\u0438\u0451\u0441\u0430\u0442": cyrCategoryLabels.Siyosat,
  "\u0418\u049b\u0442\u0438\u0441\u043e\u0434": cyrCategoryLabels.Iqtisod,
  "\u0422\u0435\u0445\u043d\u043e\u043b\u043e\u0433\u0438\u044f": cyrCategoryLabels.Texnologiya,
  "\u0421\u043f\u043e\u0440\u0442": cyrCategoryLabels.Sport,
  "\u041c\u0430\u0434\u0430\u043d\u0438\u044f\u0442": cyrCategoryLabels.Madaniyat,
  "\u0410\u043b\u043e\u049b\u0430": cyrCategoryLabels.Aloqa,
};

const DEFAULT_PASSWORD = "admin2026";
const emptyStory = {
  category: "Siyosat",
  subcategory: "",
  title: "",
  summary: "",
  image: "",
  author: "",
  time: "",
  read: "",
  body: "",
  status: "draft",
  slug: "",
  tags: "",
  metaTitle: "",
  metaDesc: "",
  isHero: false,
  isEditorPick: false,
  isBreaking: false,
  views: 0,
  countViews: true,
  script: "latin",
  sendToTelegram: false
};

function calculateSeoScore(item, type = 'story') {
  if (!item) return { score: 0, issues: [] };
  
  let score = 0;
  const issues = [];
  
  const title = item.title || "";
  const summary = item.summary || "";
  const body = item.body || "";
  const image = item.image || "";
  const author = item.author || "";
  const tags = item.tags || "";
  const metaTitle = item.metaTitle || "";
  const metaDesc = item.metaDesc || "";

  // 1. Meta Title (20 pts)
  if (metaTitle.trim()) {
    score += 10;
    const len = metaTitle.length;
    if (len >= 40 && len <= 65) {
      score += 10;
    } else if (len < 40) {
      issues.push({ severity: 'medium', text: `Meta sarlavha juda qisqa (${len} belgi, kamida 40 bo'lishi kerak)` });
    } else {
      issues.push({ severity: 'medium', text: `Meta sarlavha juda uzun (${len} belgi, ko'pi bilan 65 bo'lishi kerak)` });
    }
  } else {
    issues.push({ severity: 'high', text: "Meta sarlavha kiritilmagan" });
  }

  // 2. Meta Description (20 pts)
  if (metaDesc.trim()) {
    score += 10;
    const len = metaDesc.length;
    if (len >= 120 && len <= 170) {
      score += 10;
    } else if (len < 120) {
      issues.push({ severity: 'medium', text: `Meta tavsif juda qisqa (${len} belgi, kamida 120 bo'lishi kerak)` });
    } else {
      issues.push({ severity: 'medium', text: `Meta tavsif juda uzun (${len} belgi, ko'pi bilan 170 bo'lishi kerak)` });
    }
  } else {
    issues.push({ severity: 'high', text: "Meta tavsif kiritilmagan" });
  }

  // 3. Cover Image (15 pts)
  if (image.trim()) {
    score += 15;
  } else {
    issues.push({ severity: 'high', text: "Muqova rasm URL manzili belgilanmagan" });
  }

  // 4. Content length (15 pts)
  const textContent = body.replace(/<[^>]*>/g, '').trim();
  const words = textContent.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  if (wordCount >= 250) {
    score += 15;
  } else if (wordCount >= 100) {
    score += 10;
    issues.push({ severity: 'low', text: `Maqola matni biroz qisqa (${wordCount} ta so'z, ideal: >=250 ta so'z)` });
  } else if (wordCount > 0) {
    score += 5;
    issues.push({ severity: 'medium', text: `Maqola matni juda oz (${wordCount} ta so'z, ideal: >=250 ta so'z)` });
  } else {
    issues.push({ severity: 'high', text: "Maqola batafsil matni yozilmagan" });
  }

  // 5. Tags (15 pts)
  if (tags.trim()) {
    score += 10;
    const tagsArr = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (tagsArr.length >= 3) {
      score += 5;
    } else {
      issues.push({ severity: 'low', text: `Teglar soni kam (kamida 3 ta teg kiritish tavsiya etiladi)` });
    }
  } else {
    issues.push({ severity: 'medium', text: "Teglar kiritilmagan" });
  }

  // 6. Author (15 pts)
  if (author.trim()) {
    score += 15;
  } else {
    issues.push({ severity: 'medium', text: "Muallif ko'rsatilmagan" });
  }

  return { score, issues };
}

function renderLiveSeoWidget(item, type = 'story') {
  const audit = calculateSeoScore(item, type);
  const score = audit.score;

  const scoreColor = score >= 80 ? "#10b981" : score >= 50 ? "var(--gold)" : "var(--red)";
  const scoreBg = score >= 80 ? "rgba(16, 185, 129, 0.1)" : score >= 50 ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)";

  const metaTitle = item.metaTitle || "";
  const metaDesc = item.metaDesc || "";
  const image = item.image || "";
  const body = item.body || "";
  const tags = item.tags || "";
  const author = item.author || "";

  const textContent = body.replace(/<[^>]*>/g, '').trim();
  const words = textContent.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  return (
    <div style={{
      marginTop: "16px",
      padding: "16px",
      background: "var(--background)",
      border: "1px solid var(--line)",
      borderRadius: "8px",
      color: "var(--ink)"
    }}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px"}}>
        <span style={{fontSize: "13px", fontWeight: "600", color: "var(--ink)"}}>📈 SEO Real-time Ball:</span>
        <span style={{
          fontWeight: "700",
          fontSize: "15px",
          color: scoreColor,
          padding: "4px 10px",
          borderRadius: "12px",
          background: scoreBg
        }}>{score} / 100</span>
      </div>
      
      {/* Progress Bar */}
      <div style={{height: "6px", background: "var(--line)", borderRadius: "3px", overflow: "hidden", marginBottom: "12px"}}>
        <div style={{height: "100%", width: `${score}%`, background: scoreColor, borderRadius: "3px", transition: "width 0.3s"}} />
      </div>

      {/* Checklist */}
      <div style={{display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px"}}>
        <div style={{display: "flex", alignItems: "center", gap: "6px", color: metaTitle.length >= 40 && metaTitle.length <= 65 ? "#10b981" : "var(--muted)"}}>
          <span>{metaTitle.length >= 40 && metaTitle.length <= 65 ? "✓" : "○"}</span>
          <span>Meta sarlavha (ideal: 40-65 belgi. Joriy: {metaTitle.length})</span>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "6px", color: metaDesc.length >= 120 && metaDesc.length <= 170 ? "#10b981" : "var(--muted)"}}>
          <span>{metaDesc.length >= 120 && metaDesc.length <= 170 ? "✓" : "○"}</span>
          <span>Meta tavsif (ideal: 120-170 belgi. Joriy: {metaDesc.length})</span>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "6px", color: image.trim() ? "#10b981" : "var(--muted)"}}>
          <span>{image.trim() ? "✓" : "○"}</span>
          <span>Muqova rasm URL manzili</span>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "6px", color: wordCount >= 250 ? "#10b981" : "var(--muted)"}}>
          <span>{wordCount >= 250 ? "✓" : "○"}</span>
          <span>Maqola matni yetarli (kamida 250 ta so'z. Joriy: {wordCount})</span>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "6px", color: tags.trim() ? "#10b981" : "var(--muted)"}}>
          <span>{tags.trim() ? "✓" : "○"}</span>
          <span>Teglar kiritilgan</span>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: "6px", color: author.trim() ? "#10b981" : "var(--muted)"}}>
          <span>{author.trim() ? "✓" : "○"}</span>
          <span>Muallif nomi</span>
        </div>
      </div>
    </div>
  );
}

const DEFAULT_SITE_CONFIG = {
  siteName: "Ishonch.uz",
  logoUrl: (import.meta.env.VITE_API_URL || "") + "/uploads/logo.svg",
  footerLogoUrl: "",
  email: "news@ishonch.uz",
  telegram: "https://t.me/ishonch_uz",
  instagram: "https://instagram.com/ishonch_uz",
  youtube: "https://youtube.com/@ishonch_uz",
  facebook: "https://facebook.com/ishonch_uz",
  descriptionUz: "Ishonch.uz. O'zbekiston yangiliklari portali. Tezkor, ishonchli, mustaqil.",
  descriptionRu: "Ishonch.uz. Портал новостей Узбекистана. Быстро, надежно, независимо.",
  bannerText: "",
  bannerActive: false,
  brandColor: "#c31932",
  langUzActive: true,
  langUzkActive: true,
  langRuActive: true,
  categoriesUz: ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"],
  categoriesRu: ["Политика", "Экономика", "Технологии", "Спорт", "Культура", "Аналитика"],
  categoriesUzk: ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"],
  pinnedHeroId: "",
  pinnedSideIds: [],
  contactUz: [
    { title: "Tahririyat", value: "Yangilik, press-reliz yoki foto material yuborish uchun: news@ishonch.uz" },
    { title: "Reklama", value: "Brend loyihalari, bannerlar va maxsus sahifalar: ads@ishonch.uz" },
    { title: "Manzil", value: "Toshkent shahri, matbuot markazi, 4-qavat. Dushanba-juma 09:00-18:00." }
  ],
  contactRu: [
    { title: "Редакция", value: "Новости, пресс-релизы и фотоматериалы: news@ishonch.uz" },
    { title: "Реклама", value: "Бренд-проекты, баннеры и специальные страницы: ads@ishonch.uz" },
    { title: "Адрес", value: "Ташкент, медиацентр, 4 этаж. Понедельник-пятница 09:00-18:00." }
  ],
  specialUz: {
    kicker: "Maxsus loyiha",
    title: "Ma'lumotga tayangan jurnalistika: voqeani shovqindan ajratamiz",
    text: "Ishonch.uz tahririyati siyosat, iqtisod, texnologiya, sport va madaniyatdagi muhim jarayonlarni ravon tilda tushuntiradi.",
    badge: "Jonli tahririyat",
    image: "",
    features: "Tezkor yangiliklar, Mustaqil tahlil, Ikki tilda, Ishonchli manba",
    stat1: "24/7", stat1label: "Monitoring",
    stat2: "7",    stat2label: "Bo'lim",
    stat3: "2",    stat3label: "Til",
    stat4: "100+", stat4label: "Maqola",
  },
  specialRu: {
    kicker: "Спецпроект",
    title: "Журналистика на основе данных: отделяем события от шума",
    text: "Редакция Ishonch.uz понятным языком объясняет важные процессы в политике, экономике, технологиях, спорте и культуре.",
    badge: "Живая редакция",
    image: "",
    features: "Быстрые новости, Независимый анализ, На двух языках, Надёжный источник",
    stat1: "24/7", stat1label: "Мониторинг",
    stat2: "7",    stat2label: "Разделов",
    stat3: "2",    stat3label: "Языка",
    stat4: "100+", stat4label: "Статей",
  },
  ads: [],
};
const fallbackStory = {
  ...emptyStory,
  id: "fallback-story",
  title: "Yangi maqola qo'shing",
  summary: "Admin panel orqali birinchi yangilikni joylashtiring.",
  author: "Ishonch.uz",
  body: "Bu vaqtinchalik matn. Admin paneldan maqola qo'shilganda sayt lentasi yangilanadi.",
};

function makeId() {
  return `story-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function RichEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const isComposing = useRef(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== value) {
      el.innerHTML = value || "";
    }
  }, []);

  function exec(cmd, val = null) {
    editorRef.current.focus();
    document.execCommand(cmd, false, val);
    syncContent();
  }

  function syncContent() {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function handleKeyDown(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      exec("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;");
    }
  }

  async function uploadAndInsert(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const compressedDataUrl = await compressImage(file);
      if (!compressedDataUrl) {
        setUploading(false);
        return;
      }
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/admin/upload", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl: compressedDataUrl }),
      });
      const data = await res.json();
      if (data.url) {
        editorRef.current.focus();
        document.execCommand("insertImage", false, data.url);
        syncContent();
      }
    } catch (e) {
      console.error("RichEditor upload failed", e);
    } finally {
      setUploading(false);
    }
  }

  function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        uploadAndInsert(item.getAsFile());
        return;
      }
    }
  }

  function handleDrop(e) {
    const file = e.dataTransfer?.files?.[0];
    if (file?.type.startsWith("image/")) {
      e.preventDefault();
      uploadAndInsert(file);
    }
  }

  const AlignLeftIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
    </svg>
  );
  const AlignCenterIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
    </svg>
  );
  const AlignRightIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
    </svg>
  );
  const AlignJustifyIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );

  function insertLink() {
    const url = prompt("Havola URL:", "https://");
    if (url) exec("createLink", url);
  }

  function insertImage() {
    const url = prompt("Rasm URL:", "https://");
    if (url) exec("insertImage", url);
  }

  function clearFormat() {
    exec("removeFormat");
    exec("formatBlock", "p");
  }

  const Divider = () => <span className="rich-divider" />;

  return (
    <div className="rich-editor">
      <div className="rich-toolbar">
        <div className="rich-toolbar-row">
          {/* Matn formatlash */}
          <div className="rich-toolbar-group">
            <button type="button" title="Qalin (Ctrl+B)" className="rich-tool-btn" style={{fontWeight:900}} onMouseDown={e=>{e.preventDefault();exec("bold");}}>B</button>
            <button type="button" title="Kursiv (Ctrl+I)" className="rich-tool-btn" style={{fontStyle:"italic"}} onMouseDown={e=>{e.preventDefault();exec("italic");}}>I</button>
            <button type="button" title="Chizilgan (Ctrl+U)" className="rich-tool-btn" style={{textDecoration:"underline"}} onMouseDown={e=>{e.preventDefault();exec("underline");}}>U</button>
            <button type="button" title="O'tkazib chizilgan" className="rich-tool-btn" style={{textDecoration:"line-through"}} onMouseDown={e=>{e.preventDefault();exec("strikeThrough");}}>S</button>
          </div>

          <Divider />

          {/* Sarlavhalar */}
          <div className="rich-toolbar-group">
            <button type="button" title="Katta sarlavha" className="rich-tool-btn rich-tool-h1" onMouseDown={e=>{e.preventDefault();exec("formatBlock","h2");}}>H1</button>
            <button type="button" title="Kichik sarlavha" className="rich-tool-btn rich-tool-h2" onMouseDown={e=>{e.preventDefault();exec("formatBlock","h3");}}>H2</button>
            <button type="button" title="Paragraf" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("formatBlock","p");}}>¶</button>
          </div>

          <Divider />

          {/* Hizalanish */}
          <div className="rich-toolbar-group">
            <button type="button" title="Chapga hizalash" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("justifyLeft");}}><AlignLeftIcon /></button>
            <button type="button" title="Markazga hizalash" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("justifyCenter");}}><AlignCenterIcon /></button>
            <button type="button" title="O'ngga hizalash" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("justifyRight");}}><AlignRightIcon /></button>
            <button type="button" title="Ikki tomonga hizalash" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("justifyFull");}}><AlignJustifyIcon /></button>
          </div>

          <Divider />

          {/* Ro'yxatlar */}
          <div className="rich-toolbar-group">
            <button type="button" title="Raqamli ro'yxat" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("insertOrderedList");}}>1.</button>
            <button type="button" title="Nuqtali ro'yxat" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("insertUnorderedList");}}>•</button>
            <button type="button" title="Ajratgich chiziq" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("insertHorizontalRule");}}>—</button>
          </div>

          <Divider />

                    {/* Qo'shish */}
          <div className="rich-toolbar-group">
            <button type="button" title="Havola qo'shish" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();insertLink();}}>🔗</button>
            <button
              type="button"
              title="Rasm yuklash (kompyuterdan)"
              className="rich-tool-btn rich-tool-img ${uploading ? 'uploading' : ''}"
              onMouseDown={e=>{ e.preventDefault(); fileInputRef.current?.click(); }}
            >${uploading ? '⏳' : '🖼'}</button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{display:"none"}}
              onChange={e => { uploadAndInsert(e.target.files?.[0]); e.target.value=""; }}
            />
          </div>

          <Divider />

          {/* Undo/Redo + Tozalash */}
          <div className="rich-toolbar-group">
            <button type="button" title="Bekor qilish (Ctrl+Z)" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("undo");}}>↺</button>
            <button type="button" title="Qayta qilish (Ctrl+Y)" className="rich-tool-btn" onMouseDown={e=>{e.preventDefault();exec("redo");}}>↻</button>
            <button type="button" title="Formatlashni tozalash" className="rich-tool-btn rich-tool-clear" onMouseDown={e=>{e.preventDefault();clearFormat();}}>✕</button>
          </div>
        </div>
      </div>
      {uploading && (
        <div className="rich-upload-bar">
          <span className="rich-upload-spinner" /> Rasm yuklanmoqda...
        </div>
      )}
      <div
        ref={editorRef}
        className="rich-content"
        contentEditable
        suppressContentEditableWarning
        onInput={syncContent}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onCompositionStart={() => { isComposing.current = true; }}
        onCompositionEnd={() => { isComposing.current = false; syncContent(); }}
        data-placeholder="To'liq maqola matni. Paragraflarni Enter bilan ajrating..."
      />
    </div>
  );
}

function withIds(stories) {
  return {
    uz: stories.uz.map((story, index) => ({ id: story.id || `uz-seed-${index}`, status: story.status || "published", ...story })),
    ru: stories.ru.map((story, index) => ({ id: story.id || `ru-seed-${index}`, status: story.status || "published", ...story })),
    uzk: stories.uz.map((story, index) => ({ id: story.id || `uzk-seed-${index}`, status: story.status || "published", ...story })),
  };
}

// Лотин <-> Кирилл о'гириш
const latToCyr = {
  'a':'а','b':'б','d':'д','e':'е','f':'ф','g':'г','h':'ҳ','i':'и','j':'ж','k':'к','l':'л','m':'м','n':'н',
  'o':'о','p':'п','q':'қ','r':'р','s':'с','t':'т','u':'у','v':'в','x':'х','y':'й','z':'з',
  // о'збек апостроф турлари
  "o'":'ў',"oʻ":'ў',"o`":'ў',"oʻ":'ў',"oʼ":'ў',
  "g'":'ғ',"gʻ":'ғ',"g`":'ғ',"gʻ":'ғ',"gʼ":'ғ',
  // икки ҳарфли комбинациялар
  'sh':'ш','ch':'ч','yo':'ё','yu':'ю','ya':'я','ye':'е','yo\'':'йў',
  '"':'ъ',
  'A':'А','B':'Б','D':'Д','E':'Е','F':'Ф','G':'Г','H':'Ҳ','I':'И','J':'Ж','K':'К','L':'Л','M':'М','N':'Н',
  'O':'О','P':'П','Q':'Қ','R':'Р','S':'С','T':'Т','U':'У','V':'В','X':'Х','Y':'Й','Z':'З',
  "O'":'Ў',"Oʻ":'Ў',"O`":'Ў',"Oʻ":'Ў',"Oʼ":'Ў',
  "G'":'Ғ',"Gʻ":'Ғ',"G`":'Ғ',"Gʻ":'Ғ',"Gʼ":'Ғ',
  'Sh':'Ш','Ch':'Ч','Yo':'Ё','Yu':'Ю','Ya':'Я','Ye':'Е'
};
const cyrToLat = {
  'а':'a','б':'b','в':'v','д':'d','е':'e','э':'e','ф':'f','г':'g','ҳ':'h','и':'i','ж':'j','к':'k','л':'l','м':'m','н':'n',
  'о':'o','п':'p','қ':'q','р':'r','с':'s','т':'t','у':'u','ў':'oʻ','ғ':'gʻ',
  'ш':'sh','ч':'ch','ё':'yo','ю':'yu','я':'ya','ъ':'"','ь':'',
  'А':'A','Б':'B','В':'V','Д':'D','Е':'E','Э':'E','Ф':'F','Г':'G','Ҳ':'H','И':'I','Ж':'J','К':'K','Л':'L','М':'M','Н':'N',
  'О':'O','П':'P','Қ':'Q','Р':'R','С':'S','Т':'T','У':'U','Ў':'Oʻ','Ғ':'Gʻ',
  'Ш':'Sh','Ч':'Ch','Ё':'Yo','Ю':'Yu','Я':'Ya'
};
function convertText(text, toCyrillic) {
  if (!text) return text;
  const map = toCyrillic ? latToCyr : cyrToLat;
  let result = '';
  let i = 0;
  while (i < text.length) {
    // 2-character combinations check
    if (i < text.length - 1) {
      const two = text.substring(i, i+2);
      const twoLower = two.toLowerCase();
      const found = Object.keys(map).find(k => k.toLowerCase() === twoLower && k.length === 2);
      if (found) {
        const output = map[found];
        // Preserve capitalization: if the first character of the digraph is uppercase, keep the output capitalized
        const isFirstUpper = two[0] === two[0].toUpperCase();
        result += isFirstUpper ? output.toUpperCase() : output.toLowerCase();
        i += 2;
        continue;
      }
    }
    // 1-character check
    const ch = text[i];
    if (map[ch]) {
      result += map[ch];
    } else {
      // If single char casing mismatch
      const chLower = ch.toLowerCase();
      if (map[chLower]) {
        const output = map[chLower];
        result += ch === ch.toUpperCase() ? output.toUpperCase() : output;
      } else {
        result += ch;
      }
    }
    i++;
  }
  return result;
}

function compressImage(file, maxDim = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      resolve(null);
      return;
    }
    
    // Do not compress SVG files as they are vector format
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const webpDataUrl = canvas.toDataURL("image/webp", quality);
          resolve(webpDataUrl);
        } catch (e) {
          try {
            const jpegDataUrl = canvas.toDataURL("image/jpeg", quality);
            resolve(jpegDataUrl);
          } catch (err) {
            reject(err);
          }
        }
      };
      img.onerror = (err) => reject(err);
      img.src = event.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("yk-lang") || "uzk");
  const [page, setPage] = useState(() => {
    const isAdmin = window.location.hash === "#admin" || window.location.pathname === "/admin" || window.location.pathname === "/admin/";
    if (isAdmin) return "admin";
    const initialLang = localStorage.getItem("yk-lang") || "uz";
    if (initialLang === "uzk") return "Бош саҳифа";
    if (initialLang === "ru") return "Главная";
    return "Bosh sahifa";
  });
  const fallbackStories = useMemo(() => withIds(storyData), []);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [activeStory, setActiveStory] = useState(null);
  const [allStories, setAllStories] = useState(fallbackStories);
  const [serverMessage, setServerMessage] = useState("");
  const [siteConfig, setSiteConfig] = useState(DEFAULT_SITE_CONFIG);
  const [stats, setStats] = useState(null);
  const [videosList, setVideosList] = useState([]);
  const [photosList, setPhotosList] = useState([]);

  // Initialize visitor ID and session
  const visitorId = useMemo(() => {
    let vid = localStorage.getItem("yk_visitor_id");
    if (!vid) {
      vid = "v-" + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem("yk_visitor_id", vid);
    }
    return vid;
  }, []);

  const sessionStart = useMemo(() => {
    let start = sessionStorage.getItem("yk_session_start");
    if (!start) {
      start = Date.now().toString();
      sessionStorage.setItem("yk_session_start", start);
    }
    return Number(start);
  }, []);

  const sendPing = useCallback(async (action = false) => {
    if (siteConfig && siteConfig.visitorStatsActive === false) return;
    try {
      const sessionTime = Math.round((Date.now() - sessionStart) / 1000);
      await fetch((import.meta.env.VITE_API_URL || "") + "/api/visitor/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId, action, sessionTime })
      });
    } catch (err) {
      console.error("Stats ping failed", err);
    }
  }, [visitorId, sessionStart, siteConfig]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/visitor/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Stats fetch failed", err);
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/public/videos");
      const data = await res.json();
      if (data.videos) {
        setVideosList(data.videos);
      }
    } catch (err) {
      console.error("Videos fetch failed", err);
    }
  }, []);

  const fetchPhotos = useCallback(async () => {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/public/photos");
      const data = await res.json();
      if (data.photos) {
        setPhotosList(data.photos);
      }
    } catch (err) {
      console.error("Photos fetch failed", err);
    }
  }, []);

  // Send ping on page mount and periodically every 10 seconds
  useEffect(() => {
    sendPing(true); // initial visit action
    fetchStats();   // initial load of stats
    fetchVideos();  // initial load of videos
    fetchPhotos();  // initial load of photos

    const pingInterval = setInterval(() => {
      sendPing(false);
    }, 10000);

    const statsInterval = setInterval(() => {
      fetchStats();
    }, 10000);

    return () => {
      clearInterval(pingInterval);
      clearInterval(statsInterval);
    };
  }, [sendPing, fetchStats, fetchVideos, fetchPhotos]);

  // Track page navigation and story clicks as actions
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sendPing(true);
  }, [page, activeStory, sendPing]);

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("yk-dark") === "1");
  const [savedIds, setSavedIds] = useState(() => JSON.parse(localStorage.getItem("yk-saved") || "[]"));
  const [scrollVisible, setScrollVisible] = useState(false);
  const [pinnedHeroId, setPinnedHeroId] = useState(() => localStorage.getItem("yk-hero") || "");
  const [pinnedSideIds, setPinnedSideIds] = useState(() => JSON.parse(localStorage.getItem("yk-sides") || "[]"));
  const [copiedShare, setCopiedShare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeAuthor, setActiveAuthor] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [reactions, setReactions] = useState(() => {
    try {
      const saved = localStorage.getItem("yk-reactions");
      return saved ? JSON.parse(saved) || {} : {};
    } catch (e) {
      return {};
    }
  });
  const [ads, setAds] = useState(() => JSON.parse(localStorage.getItem("yk-ads") || "[]"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeQuote, setActiveQuote] = useState(null);
  const [expandedMobileCat, setExpandedMobileCat] = useState(null);

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || "") + "/api/public/quotes")
      .then(res => res.json())
      .then(data => {
        if (data.quotes && data.quotes.length) {
          setActiveQuote(data.quotes[0]);
        }
      })
      .catch(() => null);

    fetch((import.meta.env.VITE_API_URL || "") + "/api/public/videos")
      .then(res => res.json())
      .then(data => {
        if (data.videos) {
          setVideosList(data.videos);
        }
      })
      .catch(() => null);

    fetch((import.meta.env.VITE_API_URL || "") + "/api/public/photos")
      .then(res => res.json())
      .then(data => {
        if (data.photos) {
          setPhotosList(data.photos);
        }
      })
      .catch(() => null);
  }, []);

  const langLabels = {
    uz: "O'zbekcha",
    uzk: "Ўзбекча",
    ru: "Русский"
  };

  const activeLangs = useMemo(() => {
    const list = [];
    if (siteConfig.langUzActive !== false) list.push("uz");
    if (siteConfig.langRuActive !== false) list.push("ru");
    if (siteConfig.langUzkActive !== false) list.push("uzk");
    if (list.length === 0) list.push("uz");
    return list;
  }, [siteConfig]);

  const cycleLang = () => {
    const currentIndex = activeLangs.indexOf(lang);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % activeLangs.length;
    changeLang(activeLangs[nextIndex]);
  };

  useEffect(() => {
    localStorage.setItem("yk-ads", JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem("yk-reactions", JSON.stringify(reactions));
  }, [reactions]);

  function addReaction(storyId, emoji) {
    setReactions(prev => {
      const cur = prev[storyId] || {};
      const myPrev = cur._mine;
      if (myPrev === emoji) return prev;
      const updated = { ...cur };
      if (myPrev) updated[myPrev] = Math.max(0, (updated[myPrev] || 1) - 1);
      updated[emoji] = (updated[emoji] || 0) + 1;
      updated._mine = emoji;
      return { ...prev, [storyId]: updated };
    });
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("yk-dark", darkMode ? "1" : "0");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("yk-saved", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    if (pinnedHeroId) localStorage.setItem("yk-hero", pinnedHeroId);
    else localStorage.removeItem("yk-hero");
  }, [pinnedHeroId]);

  useEffect(() => {
    localStorage.setItem("yk-sides", JSON.stringify(pinnedSideIds));
  }, [pinnedSideIds]);

  useEffect(() => {
    function onScroll() {
      setScrollVisible(window.scrollY > 400);
      // Glassmorphism header scrolled class
      const header = document.querySelector(".header");
      if (header) header.classList.toggle("scrolled", window.scrollY > 10);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll fade-in animation (IntersectionObserver)
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in-up");
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/config");
        const data = await res.json();
        if (data.config) {
          setSiteConfig(data.config);
          
          const currentLang = localStorage.getItem("yk-lang") || "uz";
          const uzActive = data.config.langUzActive !== false;
          const ruActive = data.config.langRuActive !== false;
          const uzkActive = data.config.langUzkActive !== false;
          
          let isCurrentLangInactive = false;
          if (currentLang === "uz" && !uzActive) isCurrentLangInactive = true;
          if (currentLang === "ru" && !ruActive) isCurrentLangInactive = true;
          if (currentLang === "uzk" && !uzkActive) isCurrentLangInactive = true;
          
          if (isCurrentLangInactive) {
            let fallbackLang = "uz";
            if (!uzActive) {
              if (uzkActive) fallbackLang = "uzk";
              else if (ruActive) fallbackLang = "ru";
            }
            setLang(fallbackLang);
            localStorage.setItem("yk-lang", fallbackLang);
          }

          if (data.config.brandColor) {
            document.documentElement.style.setProperty("--brand", data.config.brandColor);
          }
          if (data.config.pinnedHeroId !== undefined) {
            setPinnedHeroId(data.config.pinnedHeroId);
          }
          if (data.config.pinnedSideIds !== undefined) {
            setPinnedSideIds(data.config.pinnedSideIds);
          }
          if (data.config.ads !== undefined) {
            setAds(data.config.ads);
          }
        }
      } catch (e) {}
    }
    loadConfig();
  }, []);

  // Keyboard shortcuts: / → search, ESC → close story
  useEffect(() => {
    function onKey(e) {
      if (e.key === "/" && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        document.querySelector(".search")?.focus();
      }
      if (e.key === "Escape" && activeStory) {
        closeStory();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeStory]);

  function toggleSave(id) {
    setSavedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleView(storyId) {
    setAllStories(prev => ({
      ...prev,
      uz: prev.uz.map(s => s.id === storyId ? { ...s, views: (s.views || 0) + 1 } : s),
      ru: prev.ru.map(s => s.id === storyId ? { ...s, views: (s.views || 0) + 1 } : s),
      uzk: prev.uzk ? prev.uzk.map(s => s.id === storyId ? { ...s, views: (s.views || 0) + 1 } : s) : [],
    }));
  }

  function openStory(story) {
    setActiveStory(story);
    const urlPath = story.slug ? `/news/${story.slug}` : `/news/${story.id}`;
    window.history.pushState({ storyId: story.id }, '', urlPath);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function closeStory() {
    setActiveStory(null);
    if (window.location.pathname.startsWith('/news/')) {
      window.history.pushState(null, '', '/');
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const t = copy[lang] || copy.uz;
  const dataLang = lang;
  const now = new Date().toISOString();
  const rawStories = (allStories[dataLang] || []).filter((story) => {
    if (story.status !== "published") return false;
    // Rejalashtirish sanasi o'tganmi yoki yo'qmi
    if (story.publishAt && story.publishAt > now) return false;
    return true;
  }).sort((a, b) => new Date(b.publishAt || b.createdAt || 0) - new Date(a.publishAt || a.createdAt || 0));

  // Krill tilda ko'rsatishda matnni avtomatik o'girish
  const stories = rawStories.map(story => {
    if (dataLang !== "uzk") return story;
    return {
      ...story,
      title: convertText(story.title, true),
      summary: convertText(story.summary, true),
      body: convertText(story.body, true),
      category: cyrCategoryLabels[story.category] || convertText(story.category, true),
      author: convertText(story.author, true),
      subcategory: (() => {
        if (!story.subcategory) return "";
        const parentUz = story.category;
        const subsUz = siteConfig?.subcategoriesUz?.[parentUz];
        if (subsUz && Array.isArray(subsUz)) {
          const idx = subsUz.indexOf(story.subcategory);
          if (idx > -1) {
            const parentCyr = cyrCategoryLabels[parentUz] || convertText(parentUz, true);
            const subsCyr = siteConfig?.subcategoriesUzk?.[parentCyr];
            if (subsCyr && Array.isArray(subsCyr) && subsCyr[idx]) {
              return subsCyr[idx];
            }
          }
        }
        return convertText(story.subcategory, true);
      })()
    };
  });

  // URL pathname routing: /news/ID or /news/slug or /admin (with multi-language lookup)
  useEffect(() => {
    function onPopState() {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/news/')) {
        const storyPath = pathname.replace('/news/', '');
        let foundStory = null;
        let foundLang = null;
        
        const checkOrder = [lang, ...['uz', 'ru', 'uzk'].filter(l => l !== lang)];
        for (const l of checkOrder) {
          const list = allStories[l] || [];
          const match = list.find(s => s.slug === storyPath || s.id === storyPath);
          if (match) {
            foundStory = match;
            foundLang = l;
            break;
          }
        }
        
        if (!foundStory) {
          const matchVid = videosList.find(v => v.id === storyPath);
          if (matchVid) {
            foundStory = {
              id: matchVid.id,
              type: "video",
              title: matchVid.title,
              time: matchVid.meta ? (matchVid.meta.split("|")[1] || "").trim() : "",
              category: matchVid.meta ? (matchVid.meta.split("|")[0] || "").trim() : (matchVid.lang !== "ru" ? "Video" : "Видео"),
              image: matchVid.image,
              url: matchVid.url,
              summary: matchVid.summary || "",
              body: matchVid.body || "",
              author: matchVid.author || "Ishonch.uz tahririyati",
              views: matchVid.views || 0,
              lang: matchVid.lang
            };
            foundLang = matchVid.lang;
          }
        }
        
        if (!foundStory) {
          const matchPh = photosList.find(p => p.id === storyPath);
          if (matchPh) {
            foundStory = {
              id: matchPh.id,
              type: "photo",
              title: matchPh.title,
              time: matchPh.meta ? (matchPh.meta.split("|")[1] || "").trim() : "",
              category: matchPh.meta ? (matchPh.meta.split("|")[0] || "").trim() : (matchPh.lang !== "ru" ? "Foto" : "Фото"),
              image: matchPh.image,
              url: matchPh.url || "",
              summary: matchPh.summary || "",
              body: matchPh.body || "",
              author: matchPh.author || "Ishonch.uz tahririyati",
              views: matchPh.views || 0,
              lang: matchPh.lang
            };
            foundLang = matchPh.lang;
          }
        }
        
        if (foundStory) {
          if (foundLang && foundLang !== lang) {
            const isLangActive = (foundLang === "uz" && siteConfig.langUzActive !== false) ||
                                 (foundLang === "ru" && siteConfig.langRuActive !== false) ||
                                 (foundLang === "uzk" && siteConfig.langUzkActive !== false);
            if (isLangActive) {
              setLang(foundLang);
              localStorage.setItem("yk-lang", foundLang);
            }
          }
          setActiveStory(foundStory);
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      } else if (pathname === '/admin' || window.location.hash === '#admin') {
        setPage("admin");
        setActiveStory(null);
        setActiveAuthor(null);
        setActiveTag(null);
      } else if (pathname === '/' || pathname === '') {
        setActiveStory(null);
      }
    }
    window.addEventListener('popstate', onPopState);
    onPopState(); // initial check
    return () => window.removeEventListener('popstate', onPopState);
  }, [allStories, lang, videosList, photosList, siteConfig]);
  const adminStories = allStories[dataLang] || [];
  const pages = useMemo(() => {
    if (lang === "uz") return ["Bosh sahifa", ...(siteConfig.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"]), "Video", "Jurnallar", "Aloqa"];
    if (lang === "uzk") return ["Бош саҳифа", ...(siteConfig.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"]), "Видео", "Журналлар", "Алоқа"];
    return ["Главная", ...(siteConfig.categoriesRu || ["Политика", "Экономика", "Технологии", "Спорт", "Культура", "Аналитика"]), "Видео", "Журналы", "Контакты"];
  }, [lang, siteConfig]);

  const activeContacts = useMemo(() => {
    if (siteConfig && (siteConfig.phone || siteConfig.email || siteConfig.address)) {
      return [
        [lang === "ru" ? "Телефон" : "Telefon", siteConfig.phone || "+998 935241107"],
        ["Email", siteConfig.email || "vatan2024@yandex.ru"],
        [lang === "ru" ? "Адрес" : "Manzil", siteConfig.address || "Toshkent shahri, Buxoro ko'chasi, 24-uy"]
      ];
    }
    const list = lang === "ru" ? siteConfig.contactRu : siteConfig.contactUz;
    if (!list || list.length === 0) {
      return lang === "ru" ? copy.ru.contact : copy.uz.contact;
    }
    return list.map(c => [c.title, c.value]);
  }, [lang, siteConfig]);

  const dynamicMediaItems = useMemo(() => {
    const currentLangVideos = videosList.filter(v => v.lang === lang);
    const currentLangPhotos = photosList.filter(p => p.lang === lang);
    if (currentLangVideos.length > 0 || currentLangPhotos.length > 0) {
      return [
        ...currentLangVideos.map(v => [v.type || "video", v.title, v.meta, v.image, v.url, v.summary || "", v.body || "", v.author || "Ishonch.uz tahririyati", v.views || 0, v.id]),
        ...currentLangPhotos.map(p => [p.type || "photo", p.title, p.meta, p.image, p.url || "", p.summary || "", p.body || "", p.author || "Ishonch.uz tahririyati", p.views || 0, p.id])
      ];
    }
    return mediaItems[lang] || mediaItems.uz;
  }, [videosList, photosList, lang]);

  const selectedCategory = useMemo(() => {
    const isHomeOrContact = ["Bosh sahifa", "Бош саҳифа", "Главная", "Aloqa", "Алоқа", "Контакты"].includes(page);
    return isHomeOrContact ? null : page;
  }, [page]);

  function changeLang(nextLang) {
    try {
      const currentIndex = Math.max(0, pages.indexOf(page));
      const nextCategories = nextLang === "uz" ? (siteConfig.categoriesUz || []) : (nextLang === "uzk" ? (siteConfig.categoriesUzk || []) : (nextLang === "ru" ? (siteConfig.categoriesRu || []) : []));
      const nextPages = [
        nextLang === "uz" ? "Bosh sahifa" : (nextLang === "uzk" ? "Бош саҳифа" : "Главная"),
        ...nextCategories,
        nextLang === "uz" ? "Jurnallar" : (nextLang === "uzk" ? "Журналлар" : "Журналы"),
        nextLang === "uz" ? "Aloqa" : (nextLang === "uzk" ? "Алоқа" : "Контакты")
      ];
      setLang(nextLang);
      localStorage.setItem("yk-lang", nextLang);
      setPage(nextPages[currentIndex] || nextPages[0]);
      setFilter("all");
      setQuery("");
      closeStory();
    } catch(e) {
      console.error("changeLang error:", e);
    }
  }

  const categories = useMemo(() => [t.all, ...new Set(stories.map((story) => story.category))], [stories, t.all]);

  const pageChips = useMemo(() => {
    if (!selectedCategory) {
      return categories;
    }
    let subs = [];
    if (lang === "uz") {
      subs = siteConfig.subcategoriesUz?.[selectedCategory] || [];
    } else if (lang === "uzk") {
      subs = siteConfig.subcategoriesUzk?.[selectedCategory] || [];
    } else if (lang === "ru") {
      subs = siteConfig.subcategoriesRu?.[selectedCategory] || [];
    }
    if (subs.length === 0) return [];
    return [t.all, ...subs];
  }, [selectedCategory, lang, siteConfig, categories, t.all]);

  const visibleStories = stories.filter((story) => {
    const matchesPage = !selectedCategory || story.category === selectedCategory;
    const matchesFilter = filter === "all" || filter === t.all || story.subcategory === filter || story.category === filter;
    const text = `${story.title} ${story.summary} ${story.category} ${story.subcategory || ""}`.toLowerCase();
    return matchesPage && matchesFilter && text.includes(query.toLowerCase());
  });

  const pinnedStory = pinnedHeroId ? stories.find(s => s.id === pinnedHeroId) : null;
  const hero = pinnedStory || stories[0] || stories[1] || stories[2] || adminStories[0] || fallbackStory;
  const pinnedSideStories = pinnedSideIds.map(id => stories.find(s => s.id === id)).filter(Boolean);
  const sideStories = pinnedSideStories.length
    ? pinnedSideStories.slice(0, 3)
    : stories.filter(s => s.id !== hero.id).slice(0, 3);

  useEffect(() => {
    refreshPublicStories();
  }, []);

  async function fetchJsonResource(path) {
    const response = await fetch(path, { cache: "no-store" });
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) throw new Error("JSON javob kelmadi");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "API javob bermadi");
    return data;
  }

  function applyPublicStories(publicStories) {
    const uzStories = Array.isArray(publicStories?.uz) && publicStories.uz.length ? publicStories.uz : fallbackStories.uz;
    const ruStories = Array.isArray(publicStories?.ru) && publicStories.ru.length ? publicStories.ru : fallbackStories.ru;
    const uzkStories = Array.isArray(publicStories?.uzk) && publicStories.uzk.length ? publicStories.uzk : uzStories;
    setAllStories(prev => ({
      ...prev,
      uz: uzStories,
      ru: ruStories,
      uzk: uzkStories,
    }));
  }

  async function refreshPublicStories() {
    setLoading(true);
    try {
      const data = await fetchJsonResource("/api/stories");
      applyPublicStories(data.stories);
      setServerMessage("");
    } catch (error) {
      try {
        const data = await fetchJsonResource("/stories.json");
        applyPublicStories(data.stories);
        setServerMessage("");
      } catch (staticError) {
        applyPublicStories(fallbackStories);
        const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
        setServerMessage(isLocal ? "Server API bilan aloqa bo'lmadi, demo maqolalar ko'rsatilmoqda." : "");
      }
    } finally {
      setLoading(false);
    }
  }

  if (siteConfig && siteConfig.maintenanceMode && page !== "admin") {
    const isUz = lang === "uz" || lang === "uzk";
    return (
      <div className="maintenance-screen" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0b0f19, #111827)",
        color: "#fff",
        fontFamily: "Outfit, Inter, sans-serif",
        textAlign: "center",
        padding: "20px"
      }}>
        <div style={{fontSize: "72px", marginBottom: "20px"}}>🛠️</div>
        <h1 style={{fontSize: "32px", margin: "0 0 10px 0", fontWeight: "700", color: "#f3f4f6"}}>Таъмирлаш режими</h1>
        <p style={{fontSize: "18px", color: "#9ca3af", maxWidth: "500px", lineHeight: "1.6", margin: "0 0 30px 0"}}>
          {isUz 
            ? "Ҳурматли мухлислар, сайтда техник таъмирлаш ва янгилаш ишлари олиб борилмоқда. Тез орада хизматингизда бўламиз!"
            : "Уважаемые читатели, на сайте проводятся технические работы. Мы скоро вернемся!"}
        </p>
        <div style={{marginTop: "20px", fontSize: "14px", color: "#4b5563"}}>
          {siteConfig.siteName || "VATAN"} © {new Date().getFullYear()}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <WeatherBar lang={lang} />
      {siteConfig.bannerActive && siteConfig.bannerText && (
        <div className="announcement-banner">
          <span className="announcement-text">📢 {siteConfig.bannerText}</span>
        </div>
      )}
      <header className="header">
        <div className="nav-inner">
          <button className="brand nav-link" onClick={() => { setPage(pages[0]); closeStory(); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Ishonch.uz">
            <Logo height={36} logoUrl={siteConfig.logoUrl} siteName={siteConfig.siteName} />
          </button>
          <nav className="nav-links" aria-label="Main navigation">
            {pages.map((item) => {
              // Check if it's a category and has subcategories
              let subs = [];
              if (lang === "uz" && siteConfig.categoriesUz?.includes(item)) {
                subs = siteConfig.subcategoriesUz?.[item] || [];
              } else if (lang === "uzk" && siteConfig.categoriesUzk?.includes(item)) {
                subs = siteConfig.subcategoriesUzk?.[item] || [];
              } else if (lang === "ru" && siteConfig.categoriesRu?.includes(item)) {
                subs = siteConfig.subcategoriesRu?.[item] || [];
              }

              if (subs.length > 0) {
                return (
                  <div key={item} className="nav-item-dropdown">
                    <button
                      className={`nav-link ${page === item ? "active" : ""} dropdown-trigger`}
                      onClick={() => {
                        setPage(item);
                        setFilter("all");
                        closeStory();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {item} <span className="dropdown-arrow">▼</span>
                    </button>
                    <div className="dropdown-menu">
                      {subs.map((sub, i) => (
                        <button
                          key={sub + "_" + i}
                          className="dropdown-item"
                          onClick={() => {
                            setPage(item);
                            setFilter(sub);
                            closeStory();
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item}
                  className={`nav-link ${page === item ? "active" : ""}`}
                  onClick={() => {
                    setPage(item);
                    setFilter("all");
                    closeStory();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {item}
                </button>
              );
            })}
          </nav>
          <div className="actions">
            <div className="search-wrap">
              <input
                className="search-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
                aria-label={t.search}
              />
            </div>
            
            {activeLangs.length > 1 && (
              <button className="lang-selector-btn" onClick={cycleLang} aria-label="Language selector">
                🌐 {langLabels[lang]}
              </button>
            )}

            {savedIds.length > 0 && (
              <button
                className={`nav-link bookmark-btn ${page === "__saved__" ? "active" : ""}`}
                style={{fontSize:18, padding:"4px 8px", position:"relative"}}
                title={lang !== "ru" ? "Saqlangan" : "Сохранённые"}
                onClick={() => { setPage("__saved__"); closeStory(); window.scrollTo({top:0,behavior:"smooth"}); }}
              >🔖 <span style={{fontSize:12,fontWeight:800}}>{savedIds.length}</span></button>
            )}

            <button className="menu-toggle-btn" onClick={() => setMenuOpen(true)} aria-label="Menu toggle">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      {/* Slide-out Menu Drawer */}
      {menuOpen && <div className="drawer-backdrop" onClick={() => setMenuOpen(false)} />}
      <div className={`drawer ${menuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <Logo height={32} logoUrl={siteConfig.logoUrl} siteName={siteConfig.siteName} />
          <button className="drawer-close-btn" onClick={() => setMenuOpen(false)}>✕</button>
        </div>
        <div className="drawer-content">
          <nav className="drawer-nav">
            {pages.map((item) => {
              // Check if it's a category and has subcategories
              let subs = [];
              if (lang === "uz" && siteConfig.categoriesUz?.includes(item)) {
                subs = siteConfig.subcategoriesUz?.[item] || [];
              } else if (lang === "uzk" && siteConfig.categoriesUzk?.includes(item)) {
                subs = siteConfig.subcategoriesUzk?.[item] || [];
              } else if (lang === "ru" && siteConfig.categoriesRu?.includes(item)) {
                subs = siteConfig.subcategoriesRu?.[item] || [];
              }

              if (subs.length > 0) {
                const isExpanded = expandedMobileCat === item;
                return (
                  <div key={item} className="drawer-nav-group">
                    <div className="drawer-nav-row">
                      <button
                        className={`drawer-nav-link ${page === item ? "active" : ""}`}
                        style={{flex: 1, textAlign: "left", border: 0}}
                        onClick={() => {
                          setPage(item);
                          setFilter("all");
                          closeStory();
                          setMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {item}
                      </button>
                      <button
                        className="drawer-nav-toggle-btn"
                        onClick={() => setExpandedMobileCat(isExpanded ? null : item)}
                        aria-label="Toggle subcategories"
                      >
                        <span style={{
                          display: "inline-block",
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                          fontSize: "10px"
                        }}>▼</span>
                      </button>
                    </div>
                    {isExpanded && (
                      <div className="drawer-subnav">
                        {subs.map((sub, i) => (
                          <button
                            key={sub + "_" + i}
                            className="drawer-subnav-link"
                            onClick={() => {
                              setPage(item);
                              setFilter(sub);
                              closeStory();
                              setMenuOpen(false);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item}
                  className={`drawer-nav-link ${page === item ? "active" : ""}`}
                  onClick={() => {
                    setPage(item);
                    setFilter("all");
                    closeStory();
                    setMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {item}
                </button>
              );
            })}
          </nav>
          
          <div className="drawer-divider" />
          
          <div className="drawer-section">
            <h4>{lang !== "ru" ? "Sozlamalar" : "Настройки"}</h4>
            <div className="drawer-setting-row">
              <span>{lang !== "ru" ? "Tungi rejim" : "Темная тема"}</span>
              <button
                className="drawer-setting-btn"
                onClick={() => setDarkMode(d => !d)}
              >
                {darkMode ? (lang !== "ru" ? "🌙 Yoqilgan" : "🌙 Включено") : (lang !== "ru" ? "☀️ O'chirilgan" : "☀️ Выключено")}
              </button>
            </div>
          </div>
          
          <div className="drawer-divider" />
          
          <div className="drawer-section">
            <h4>{lang !== "ru" ? "Bog'lanish" : "Контакты"}</h4>
            <p style={{fontSize: 14, color: "var(--muted)", lineHeight: 1.5, margin: "8px 0 0"}}>
              {activeContacts.map(([title, val]) => (
                <span key={title} style={{display: "block", marginBottom: "4px"}}>
                  <strong>{title}:</strong> {val}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
      {serverMessage && page !== "admin" && <div className="api-banner">{serverMessage}</div>}

      {activeStory ? (
        <ArticlePage
          t={t} story={activeStory} stories={stories}
          savedIds={savedIds} onToggleSave={toggleSave}
          copiedShare={copiedShare} setCopiedShare={setCopiedShare}
          onClose={closeStory}
          onOpen={openStory}
          onView={handleView}
          reactions={reactions} addReaction={addReaction}
          onAuthorClick={(author) => { setActiveAuthor(author); closeStory(); window.scrollTo({top:0,behavior:"smooth"}); }}
          onTagClick={(tag) => { setActiveTag(tag); closeStory(); window.scrollTo({top:0,behavior:"smooth"}); }}
        />
      ) : activeAuthor ? (
        <AuthorPage
          author={activeAuthor} stories={stories} lang={lang}
          onOpen={openStory}
          onBack={() => setActiveAuthor(null)}
          savedIds={savedIds} onToggleSave={toggleSave}
        />
      ) : activeTag ? (
        <TagPage
          tag={activeTag} stories={stories} lang={lang}
          onOpen={openStory}
          onBack={() => setActiveTag(null)}
          savedIds={savedIds} onToggleSave={toggleSave}
        />
      ) : (
        <>
          {page !== "admin" && page !== "__saved__" && <Hero t={t} hero={hero} sideStories={sideStories.filter(Boolean)} openStory={openStory} pinnedHeroId={pinnedHeroId} />}
          {page !== "admin" && page !== "__saved__" && <AdBanner ads={ads} position="top" />}

          {page === "admin" ? (
            <AdminPanel
              lang={lang}
              setLang={setLang}
              allStories={allStories}
              stories={adminStories}
              setAllStories={setAllStories}
              refreshPublicStories={refreshPublicStories}
              siteConfig={siteConfig}
              refreshPublicVideos={fetchVideos}
              refreshPublicPhotos={fetchPhotos}
              setSiteConfig={setSiteConfig}
              pinnedHeroId={pinnedHeroId}
              setPinnedHeroId={setPinnedHeroId}
              pinnedSideIds={pinnedSideIds}
              setPinnedSideIds={setPinnedSideIds}
              ads={ads}
              setAds={setAds}
            />
          ) : page === "__saved__" ? (
            <main className="section saved-page">
              <div className="section-inner">
                <div className="section-head">
                  <div>
                    <h2 className="section-title">🔖 {lang !== "ru" ? "Saqlangan maqolalar" : "Сохранённые статьи"}</h2>
                    <p className="saved-count">{savedIds.length} ta maqola saqlangan</p>
                  </div>
                  {savedIds.length > 0 && (
                    <button className="adm-btn ghost" style={{fontSize:12}} onClick={() => setSavedIds([])}>
                      {lang !== "ru" ? "Hammasini o'chirish" : "Очистить всё"}
                    </button>
                  )}
                </div>
                {savedIds.length === 0 ? (
                  <div className="saved-empty">
                    <span>🔖</span>
                    <p>{lang !== "ru" ? "Hozircha hech narsa saqlanmagan" : "Ничего не сохранено"}</p>
                    <small>{lang !== "ru" ? "Maqolalardagi ★ tugmasini bosing" : "Нажмите ★ в статье"}</small>
                  </div>
                ) : (
                  <div className="layout">
                    <div className="stories-grid">
                      {stories.filter(s => savedIds.includes(s.id)).map(story => (
                        <StoryCard key={story.id} story={story} savedIds={savedIds} onToggleSave={toggleSave}
                          onOpen={() => openStory(story)} />
                      ))}
                    </div>
                    <Sidebar t={t} stories={stories} onOpen={openStory} />
                  </div>
                )}
              </div>
            </main>
          ) : page === pages[pages.length - 1] ? (
            <ContactPage t={t} page={page} siteConfig={siteConfig} />
          ) : (page === "Video" || page === "Видео") ? (
            <VideoPage lang={lang} items={dynamicMediaItems} onOpen={openStory} />
          ) : (
            <main className={`section ${page === pages[0] ? "home-section" : "category-section"}`}>
              <div className="section-inner">
                {page !== pages[0] && (
                  <div className="category-masthead">
                    <span>{t.portal}</span>
                    <h1>{page}</h1>
                    <p>{t.pageNotes[page]}</p>
                  </div>
                )}
                <div className="section-head">
                  <div>
                    <h2 className="section-title">{page === pages[0] ? t.latest : page}</h2>
                    <p className="section-note">{page === pages[0] ? t.latestNote : t.pageNotes[page]}</p>
                  </div>
                  {pageChips.length > 0 && (
                    <div className="page-tools">
                      {pageChips.map((cat) => (
                        <button
                          key={cat}
                          className={`chip ${(filter === cat || (filter === "all" && cat === t.all)) ? "active" : ""}`}
                          onClick={() => setFilter(cat === t.all ? "all" : cat)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="layout">
                  <div>
                    <AdBanner ads={ads} position="inline" />
                    {page === pages[0] && activeQuote && (
                      <div className="quote-of-the-day-widget" style={{
                        background: "var(--surface)",
                        borderLeft: "4px solid var(--brand)",
                        padding: "16px 20px",
                        borderRadius: "8px",
                        marginBottom: "24px",
                        boxShadow: "var(--shadow-sm)"
                      }}>
                        <span style={{fontSize: "24px", color: "var(--brand)", display: "block", marginBottom: "4px", lineHeight: "1"}}>❝</span>
                        <p style={{fontStyle: "italic", fontSize: "15px", margin: "0 0 6px 0", color: "var(--ink)", lineHeight: "1.5"}}>
                          {lang === "uzk" ? convertText(activeQuote.text, true) : activeQuote.text}
                        </p>
                        <small style={{fontWeight: 700, color: "var(--muted)"}}>
                          — {lang === "uzk" ? convertText(activeQuote.author, true) : activeQuote.author}
                        </small>
                      </div>
                    )}
                    <div className="stories-grid">
                      {loading
                        ? Array.from({length: 6}).map((_, i) => <SkeletonCard key={i} />)
                        : visibleStories.length ? (page === pages[0] ? visibleStories.slice(0, 8) : visibleStories).map((story, index) => (
                          <StoryCard key={story.id} story={story} featured={page !== pages[0] && index === 0}
                            savedIds={savedIds} onToggleSave={toggleSave}
                            onOpen={openStory} />
                        )) : <div className="empty-state">Bu bo'limda hozircha maqola yo'q.</div>}
                    </div>
                    {page === pages[0] && visibleStories.length > 8 && (
                      <div style={{textAlign:"center", marginTop:24}}>
                        <button className="load-more-btn" onClick={() => { setFilter("all"); window.scrollTo({top:0,behavior:"smooth"}); }}>
                          {lang !== "ru" ? `Ko'proq ko'rish (${visibleStories.length - 8} ta qoldi)` : `Показать ещё (осталось ${visibleStories.length - 8})`}
                        </button>
                      </div>
                    )}
                  </div>
                  <Sidebar t={t} stories={stories} onOpen={openStory} />
                </div>
              </div>
            </main>
          )}

          {page !== "admin" && <AdBanner ads={ads} position="bottom" />}
          {page !== "admin" && page !== pages[pages.length - 1] && page !== "Video" && page !== "Видео" && <BreakingBanner lang={lang} stories={stories} onOpen={openStory} />}
          {page !== "admin" && page !== pages[pages.length - 1] && page !== "Video" && page !== "Видео" && <MediaSection lang={lang} items={dynamicMediaItems} onOpen={openStory} />}
          {page !== "admin" && <Special t={t} siteConfig={siteConfig} />}
        </>
      )}

      <Footer t={t} pages={pages} setPage={(p) => { setPage(p); closeStory(); window.scrollTo({ top: 0, behavior: "smooth" }); }} openAdmin={() => { setPage("admin"); closeStory(); }} siteConfig={siteConfig} lang={lang} />

      {page !== "admin" && stats && stats.enabled && (
        <div className="visitor-stats-bar">
          <div className="visitor-stats-inner">
            <span>{t.statsOnline}: <strong>{stats.online}</strong></span>
            <span>{t.statsActions}: <strong>{stats.actions}</strong></span>
            <span>{t.statsVisits}: <strong>{stats.visits}</strong></span>
            <span>{t.statsAvgTime}: <strong>{stats.averageTime}s</strong></span>
          </div>
        </div>
      )}

      <button
        className={`scroll-top-btn ${scrollVisible ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        title="Yuqoriga"
      >↑</button>

      {/* 📱 Mobile bottom navigation */}
      <nav className="mobile-bottom-nav">
        <button className={`mob-nav-btn ${page === pages[0] && !activeStory ? "active" : ""}`}
          onClick={() => { setPage(pages[0]); closeStory(); setActiveAuthor(null); setActiveTag(null); window.scrollTo({top:0,behavior:"smooth"}); }}>
          <span>🏠</span><span>{t.close === "Yopish" ? "Bosh" : "Главная"}</span>
        </button>
        <button className={`mob-nav-btn ${query ? "active" : ""}`}
          onClick={() => document.querySelector(".search")?.focus()}>
          <span>🔍</span><span>{t.close === "Yopish" ? "Qidirish" : "Поиск"}</span>
        </button>
        <button className={`mob-nav-btn ${page === "__saved__" ? "active" : ""}`}
          onClick={() => { setPage("__saved__"); closeStory(); window.scrollTo({top:0,behavior:"smooth"}); }}>
          <span>🔖</span><span>{t.close === "Yopish" ? "Saqlangan" : "Сохранённые"}</span>
          {savedIds.length > 0 && <span className="mob-nav-badge">{savedIds.length}</span>}
        </button>
        <button className={`mob-nav-btn ${page === "admin" ? "active" : ""}`}
          onClick={() => { setPage("admin"); closeStory(); window.scrollTo({top:0,behavior:"smooth"}); }}>
          <span>⚙️</span><span>Admin</span>
        </button>
      </nav>
    </div>
  );
}

function BreakingBanner({ lang, stories, onOpen }) {
  const isUz = lang !== "ru";
  const label = isUz ? "TEZKOR" : "СРОЧНО";
  const title = isUz ? "Bugungi eng dolzarb xabarlar" : "Самые актуальные новости сегодня";
  const sub = isUz ? "Tahririyat tanlovi" : "Выбор редакции";
  const btnLabel = isUz ? "Barchasini o'qish" : "Читать все";
  const picks = stories.slice(0, 3);

  return (
    <div className="breaking-banner">
      <div className="breaking-inner">
        <div className="breaking-left">
          <span className="breaking-badge">
            <span className="breaking-live-dot" />
            {label}
          </span>
          <h2>{title}</h2>
          <p>{sub}</p>
        </div>
        <div className="breaking-cards">
          {picks.map((story) => (
            <button key={story.id} className="breaking-card" onClick={() => onOpen(story)}>
              <img src={story.image} alt="" />
              <div className="breaking-card-overlay" />
              <div className="breaking-card-body">
                <span className="breaking-cat">{story.category}</span>
                <strong>{story.title}</strong>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function MediaSection({ lang, items, onOpen }) {
  const isUz = lang !== "ru";
  const safeItems = items || [];
  const videos = safeItems.filter(([type]) => type === "video");
  const photos = safeItems.filter(([type]) => type === "photo");

  const videoLabel = isUz ? "Video" : "Видео";
  const photoLabel = isUz ? "Foto" : "Фото";
  const videoNote = isUz ? "Kunning eng muhim videolari" : "Главные видео дня";
  const photoNote = isUz ? "Fotoreportajlar va vizual materiallar" : "Фоторепортажи и визуальные материалы";
  const watchLabel = isUz ? "Tomosha qilish →" : "Смотреть →";
  const viewLabel = isUz ? "Ko'rish →" : "Посмотреть →";

  function MediaBlock({ type, blockItems, title, note }) {
    if (!blockItems.length) return null;
    const featured = blockItems[0];
    const rest = blockItems.slice(1);
    return (
      <div className="media-block">
        <div className="media-block-head">
          <span className={`media-block-icon-label ${type}`}>
            {type === "video" ? "▶" : "◉"} {title}
          </span>
          <p>{note}</p>
        </div>

        {type === "video" ? (
          <div className="media-v2-layout">
            <article className="media-featured" style={{ cursor: "pointer" }} onClick={() => {
              if (onOpen) {
                onOpen({
                  id: featured[9] || featured[1],
                  type: "video",
                  title: featured[1],
                  time: featured[2] ? (featured[2].split("|")[1] || "").trim() : "",
                  category: featured[2] ? (featured[2].split("|")[0] || "").trim() : (isUz ? "Video" : "Видео"),
                  image: featured[3],
                  url: featured[4],
                  summary: featured[5] || "",
                  body: featured[6] || "",
                  author: featured[7] || "Ishonch.uz tahririyati",
                  views: featured[8] || 0
                });
              }
            }}>
              <div className="media-featured-thumb">
                <img src={featured[3]} alt="" />
                <div className="media-featured-overlay" />
                <span className={`media-featured-icon video`}>▶</span>
                <div className="media-featured-meta">
                  <span className="media-type-badge video">{title}</span>
                  <span>{featured[2]}</span>
                </div>
              </div>
              <div className="media-featured-body">
                <strong>{featured[1]}</strong>
                <button className="media-play-btn" type="button">{isUz ? "Tomosha qilish →" : "Смотреть →"}</button>
              </div>
            </article>
            <div className="media-v2-list">
              {rest.map(([t, itemTitle, meta, image, url, summary, body, author, views, id]) => (
                <article className="media-list-item" key={itemTitle} style={{ cursor: "pointer" }} onClick={() => {
                  if (onOpen) {
                    onOpen({
                      id: id || itemTitle,
                      type: "video",
                      title: itemTitle,
                      time: meta ? (meta.split("|")[1] || "").trim() : "",
                      category: meta ? (meta.split("|")[0] || "").trim() : (isUz ? "Video" : "Видео"),
                      image: image,
                      url: url,
                      summary: summary || "",
                      body: body || "",
                      author: author || "Ishonch.uz tahririyati",
                      views: views || 0
                    });
                  }
                }}>
                  <button type="button" style={{ display: "flex", width: "100%", textAlign: "left", background: "none", border: 0, padding: 0, cursor: "pointer", color: "inherit", fontFamily: "inherit" }}>
                    <span className="media-list-thumb">
                      <img src={image} alt="" />
                      <span className="media-list-icon video">▶</span>
                    </span>
                    <span className="media-list-body">
                      <strong>{itemTitle}</strong>
                      <small>{meta}</small>
                    </span>
                  </button>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <div className="media-photo-grid">
            {blockItems.map(([t, itemTitle, meta, image, url, summary, body, author, views, id]) => (
              <article className="media-photo-card" key={itemTitle} style={{ cursor: "pointer" }} onClick={() => {
                if (onOpen) {
                  onOpen({
                    id: id || itemTitle,
                    type: "photo",
                    title: itemTitle,
                    time: meta ? (meta.split("|")[1] || "").trim() : "",
                    category: meta ? (meta.split("|")[0] || "").trim() : (isUz ? "Foto" : "Фото"),
                    image: image,
                    url: url || "",
                    summary: summary || "",
                    body: body || "",
                    author: author || "Ishonch.uz tahririyati",
                    views: views || 0
                  });
                }
              }}>
                <button type="button" style={{ display: "block", width: "100%", border: 0, background: "none", padding: 0, cursor: "pointer", color: "inherit", fontFamily: "inherit", textAlign: "left" }}>
                  <div className="media-photo-thumb">
                    <img src={image} alt="" />
                    <div className="media-photo-overlay" />
                    <span className="media-photo-icon">◉</span>
                    <span className="media-photo-meta">{meta}</span>
                  </div>
                  <div className="media-photo-body">
                    <strong>{itemTitle}</strong>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="media-section-v2">
      <div className="section-inner">
        <MediaBlock type="video" blockItems={videos} title={videoLabel} note={videoNote} actionLabel={watchLabel} />
        <MediaBlock type="photo" blockItems={photos} title={photoLabel} note={photoNote} actionLabel={viewLabel} />
      </div>
    </section>
  );
}



function Logo({ height = 36, logoUrl = "", siteName = "Ishonch.uz", textColor, forceSvg = false }) {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false); // Reset error state if logoUrl changes
  }, [logoUrl]);

  if (logoUrl && !imgError && !forceSvg) {
    return (
      <img
        src={logoUrl}
        alt={siteName}
        style={{ height: height, width: "auto", display: "inline-block", verticalAlign: "middle", objectFit: "contain" }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 36" style={{ height: height, width: "auto", display: "inline-block", verticalAlign: "middle" }}>
      <defs>
        <pattern id="logo-stripes" width="36" height="3.5" patternUnits="userSpaceOnUse">
          <line x1="0" y1="1.75" x2="36" y2="1.75" stroke="#ffffff" strokeWidth="1.2" />
        </pattern>
        <mask id="logo-circle-mask">
          <circle cx="18" cy="18" r="14" fill="#ffffff" />
        </mask>
      </defs>
      <circle cx="18" cy="18" r="14" fill="#6ba4ff" opacity="0.6" />
      <circle cx="18" cy="18" r="14" fill="url(#logo-stripes)" mask="url(#logo-circle-mask)" />
      <path d="M11 18l5 5 10-10" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 18l5 5 10-10" fill="none" stroke="#0e5ff2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="40" y="25" fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontWeight="900" fontSize="21" fill={textColor || "currentColor"} letterSpacing="-0.5">{siteName}</text>
    </svg>
  );
}


function WeatherBar({ lang }) {
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState(new Date());
  const [rawCity, setRawCity] = useState("Tashkent");
  const [coords, setCoords] = useState({ lat: 41.2995, lon: 69.2401 });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        if (data.latitude && data.longitude) {
          setCoords({ lat: data.latitude, lon: data.longitude });
        }
        if (data.city) {
          setRawCity(data.city);
        }
      })
      .catch(() => {
        fetch("https://freeipapi.com/api/json")
          .then(res => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then(data => {
            if (data.latitude && data.longitude) {
              setCoords({ lat: data.latitude, lon: data.longitude });
            }
            if (data.cityName) {
              setRawCity(data.cityName);
            }
          })
          .catch(() => {});
      });
  }, []);

  useEffect(() => {
    const { lat, lon } = coords;
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&timezone=auto`)
      .then(r => r.json())
      .then(data => {
        const code = data.current.weathercode;
        const temp = Math.round(data.current.temperature_2m);
        const wind = Math.round(data.current.windspeed_10m);
        const icons = {
          0:"☀️", 1:"🌤", 2:"⛅", 3:"☁️",
          45:"🌫", 48:"🌫", 51:"🌦", 53:"🌦", 55:"🌧",
          61:"🌧", 63:"🌧", 65:"🌧", 71:"🌨", 73:"🌨",
          75:"🌨", 80:"🌦", 81:"🌧", 82:"⛈", 95:"⛈", 96:"⛈", 99:"⛈"
        };
        const descs = {
          uz:  { 0:"Ochiq", 1:"Asosan ochiq", 2:"Qisman bulutli", 3:"Bulutli", 45:"Tuman", 48:"Tuman",
            51:"Yengil yomg'ir", 53:"Yomg'ir", 55:"Kuchli yomg'ir", 61:"Yomg'ir", 63:"Yomg'ir",
            65:"Kuchli yomg'ir", 71:"Qor", 73:"Qor", 75:"Kuchli qor", 80:"Yomg'ir", 81:"Yomg'ir",
            82:"Momaqaldiroq", 95:"Momaqaldiroq", 96:"Do'l", 99:"Do'l" },
          uzk: { 0:"Очиқ", 1:"Асосан очиқ", 2:"Қисман булутли", 3:"Булутли", 45:"Туман", 48:"Туман",
            51:"Енгил ёмғир", 53:"Ёмғир", 55:"Кучли ёмғир", 61:"Ёмғир", 63:"Ёмғир",
            65:"Кучли ёмғир", 71:"Қор", 73:"Қор", 75:"Кучли қор", 80:"Ёмғир", 81:"Ёмғир",
            82:"Момақалдироқ", 95:"Момақалдироқ", 96:"Дўл", 99:"Дўл" },
          ru:  { 0:"Ясно", 1:"Преимущественно ясно", 2:"Переменная облачность", 3:"Пасмурно",
            45:"Туман", 48:"Туман", 51:"Лёгкий дождь", 53:"Дождь", 55:"Сильный дождь",
            61:"Дождь", 63:"Дождь", 65:"Ливень", 71:"Снег", 73:"Снег", 75:"Сильный снег",
            80:"Дождь", 81:"Дождь", 82:"Гроза", 95:"Гроза", 96:"Град", 99:"Град" }
        };
        const langKey = lang === "ru" ? "ru" : lang === "uzk" ? "uzk" : "uz";
        const fallback = lang === "ru" ? "Погода" : lang === "uzk" ? "Об-ҳаво" : "Ob-havo";
        const desc = (descs[langKey] || descs.uz)[code] || fallback;
        setWeather({ temp, wind, icon: icons[code] || "🌡", desc });
      })
      .catch(() => {});
  }, [coords, lang]);

  const isUz = lang !== "ru";
  const locale = lang === "ru" ? "ru-RU" : "uz-UZ";
  const dd = String(time.getDate()).padStart(2, "0");
  const mm = String(time.getMonth() + 1).padStart(2, "0");
  const yyyy = time.getFullYear();
  const timeStr = time.toLocaleTimeString(locale, { hour:"2-digit", minute:"2-digit", second:"2-digit" });

  const cityNames = {
    "tashkent": { uz: "Toshkent", uzk: "Тошкент", ru: "Ташкент" },
    "samarkand": { uz: "Samarqand", uzk: "Самарқанд", ru: "Самарканд" },
    "bukhara": { uz: "Buxoro", uzk: "Бухоро", ru: "Бухара" },
    "andijan": { uz: "Andijon", uzk: "Андижон", ru: "Андижан" },
    "namangan": { uz: "Namangan", uzk: "Наманган", ru: "Наманган" },
    "fergana": { uz: "Farg'ona", uzk: "Фарғона", ru: "Фергана" },
    "kokand": { uz: "Qo'qon", uzk: "Қўқон", ru: "Коканд" },
    "qo'qon": { uz: "Qo'qon", uzk: "Қўқон", ru: "Коканд" },
    "margilan": { uz: "Marg'ilon", uzk: "Марғилон", ru: "Маргилан" },
    "marg'ilon": { uz: "Marg'ilon", uzk: "Марғилон", ru: "Маргилан" },
    "nukus": { uz: "Nukus", uzk: "Нукус", ru: "Нукус" },
    "karshi": { uz: "Qarshi", uzk: "Қарши", ru: "Карши" },
    "qarshi": { uz: "Qarshi", uzk: "Қарши", ru: "Карши" },
    "urgench": { uz: "Urganch", uzk: "Урганч", ru: "Ургенч" },
    "khiva": { uz: "Xiva", uzk: "Хива", ru: "Хива" },
    "xiva": { uz: "Xiva", uzk: "Хива", ru: "Хива" },
    "jizzakh": { uz: "Jizzax", uzk: "Жиззах", ru: "Джизак" },
    "jizzax": { uz: "Jizzax", uzk: "Жиззах", ru: "Джизак" },
    "termez": { uz: "Termiz", uzk: "Термиз", ru: "Термез" },
    "termiz": { uz: "Termiz", uzk: "Термиз", ru: "Термез" },
    "navoiy": { uz: "Navoiy", uzk: "Навоий", ru: "Навои" },
    "navoi": { uz: "Navoiy", uzk: "Навоий", ru: "Навои" },
    "guliston": { uz: "Guliston", uzk: "Гулистон", ru: "Гулистан" },
    "gulistan": { uz: "Guliston", uzk: "Гулистон", ru: "Гулистан" },
    "chirchiq": { uz: "Chirchiq", uzk: "Чирчиқ", ru: "Чирчик" },
    "chirchik": { uz: "Chirchiq", uzk: "Чирчиқ", ru: "Чирчик" },
    "angren": { uz: "Angren", uzk: "Ангрен", ru: "Ангрен" },
    "olmaliq": { uz: "Olmaliq", uzk: "Олмалиқ", ru: "Алмалык" },
    "almalyk": { uz: "Olmaliq", uzk: "Олмалиқ", ru: "Алмалык" },
    "denov": { uz: "Denov", uzk: "Денов", ru: "Денау" },
    "denau": { uz: "Denov", uzk: "Денов", ru: "Денау" },
    "shahrisabz": { uz: "Shahrisabz", uzk: "Шаҳрисабз", ru: "Шахрисабз" }
  };

  const langKey = lang === "ru" ? "ru" : lang === "uzk" ? "uzk" : "uz";
  const cityLower = rawCity.toLowerCase().trim();
  const displayCity = cityNames[cityLower]
    ? (cityNames[cityLower][langKey] || rawCity)
    : rawCity.replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="weather-bar">
      <div className="weather-bar-inner">
        <div className="weather-left">
          {weather ? (
            <>
              <span className="weather-icon">{weather.icon}</span>
              <span className="weather-city">{displayCity}</span>
              <span className="weather-temp">{weather.temp}°C</span>
              <span className="weather-desc">{weather.desc}</span>
              <span className="weather-wind">💨 {weather.wind} km/h</span>
            </>
          ) : (
            <span className="weather-loading">🌡 {isUz ? "Yuklanmoqda..." : "Загрузка..."}</span>
          )}
        </div>
        <div className="weather-right">
          <span className="wdate-dot">
            <span className="wdate-part">{dd}</span>
            <span className="wdate-sep">.</span>
            <span className="wdate-part">{mm}</span>
            <span className="wdate-sep">.</span>
            <span className="wdate-part">{yyyy}</span>
          </span>
          <span className="weather-time">{timeStr}</span>
        </div>
      </div>
    </div>
  );
}

function Hero({ t, hero, sideStories, openStory }) {
  return (
    <section className="hero">
      <div className="hero-container">
        {/* Featured Story: Horizontal Split Layout */}
        <article className="hero-featured" onClick={() => openStory(hero)} style={{ cursor: "pointer" }}>
          <div className="hero-featured-media">
            <img className="hero-featured-img" src={hero.image} alt="" />
          </div>
          <div className="hero-featured-body">
            <span className="kicker">{hero.category}</span>
            <h1>{hero.title}</h1>
            <p>{hero.summary}</p>
            <div className="meta">
              <span>{hero.author}</span>
              <span>{hero.time}</span>
              <span>{hero.read}</span>
            </div>
          </div>
        </article>

        {/* Secondary Stories Grid: 3 columns */}
        <div className="hero-grid-secondary">
          {sideStories.map((story) => (
            <article
              className="hero-card-secondary"
              key={story.title}
              onClick={() => openStory(story)}
              style={{ cursor: "pointer" }}
            >
              <div className="hero-card-secondary-media">
                <img className="hero-card-secondary-img" src={story.image} alt="" />
              </div>
              <div className="hero-card-secondary-body">
                <span className="kicker-sub">{story.category}</span>
                <h3>{story.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryBadge({ story }) {
  if (story.isBreaking) return <span className="story-badge breaking">🔴 TEZKOR</span>;
  if (story.isEditorPick) return <span className="story-badge editor">⭐ MUHARRIR</span>;
  if ((story.views || 0) > 50) return <span className="story-badge trend">🔥 TREND</span>;
  return null;
}

function calcReadTime(text, lang) {
  if (!text) return null;
  const words = text.replace(/<[^>]+>/g,"").split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return lang === "ru" ? `${mins} мин` : `${mins} daq`;
}

function StoryCard({ story, onOpen, featured = false, savedIds = [], onToggleSave }) {
  const isSaved = savedIds.includes(story.id);
  return (
    <article className={`story-card fade-in-up ${featured ? "featured-story" : ""}`} style={{position:"relative"}}>
      <StoryBadge story={story} />
      <button onClick={() => onOpen(story)}>
        <img className="story-image" src={story.image} alt="" loading="lazy" />
        <div className="story-body">
          <span className="category" data-cat={story.category}>{story.category}</span>
          <h3>{story.title}</h3>
          <p>{story.summary}</p>
          <div className="story-footer">
            <span>{story.read}</span>
            {(story.views || 0) > 0 && <span className="story-views">👁 {story.views}</span>}
          </div>
        </div>
      </button>
      {onToggleSave && (
        <button
          className={`bookmark-corner ${isSaved ? "saved" : ""}`}
          onClick={e => { e.stopPropagation(); onToggleSave(story.id); }}
          title={isSaved ? "Saqlangandan olib tashlash" : "Saqlash"}
        >{isSaved ? "★" : "☆"}</button>
      )}
    </article>
  );
}

function Sidebar({ t, stories, onOpen }) {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const [donorName, setDonorName] = React.useState("");
  const [donorAmount, setDonorAmount] = React.useState("");
  const [donationSuccess, setDonationSuccess] = React.useState(false);

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!email.includes("@")) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 4000);
      }
    } catch(err) {
      console.error(err);
    }
  }

  async function handleDonate(e) {
    e.preventDefault();
    const amount = Number(donorAmount);
    if (amount <= 0) return;
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: donorName.trim() || "Anonim",
          amount: amount,
          currency: "UZS",
          description: t.close === "Yopish" ? "Saytni qo'llab-quvvatlash" : "Поддержка сайта",
          status: "success"
        })
      });
      if (res.ok) {
        setDonationSuccess(true);
        setDonorName("");
        setDonorAmount("");
        setTimeout(() => setDonationSuccess(false), 5000);
      }
    } catch(err) {
      console.error(err);
    }
  }

  return (
    <aside className="sidebar">
      <div className="panel">
        <h3>{t.popular}</h3>
        {[...stories].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map((story, index) => (
          <button className="trend" key={story.id} onClick={() => onOpen && onOpen(story)} style={{ display: "grid", gridTemplateColumns: "28px 1fr", gap: "12px", width: "100%", border: 0, background: "transparent", textAlign: "left", cursor: "pointer", padding: "12px 0", borderTop: index === 0 ? 0 : "1px solid var(--line)" }}>
            <span className="trend-num">{index + 1}</span>
            <span>
              <strong style={{ display: "block", lineHeight: "1.28", color: "var(--ink)" }}>{story.title}</strong>
              <small style={{ color: "var(--muted)" }}>{story.category}</small>
            </span>
          </button>
        ))}
      </div>
      
      <div className="panel newsletter">
        <h3>{t.newsletterTitle}</h3>
        <p>{t.newsletterText}</p>
        {subscribed ? (
          <p style={{ color: "#4ade80", fontWeight: 700, margin: "8px 0 0" }}>✓ Muvaffaqiyatli obuna bo'ldingiz!</p>
        ) : (
          <form onSubmit={handleSubscribe}>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder={t.email} type="email" />
            <button className="primary" type="submit" style={{ width: "100%", marginTop: "2px" }}>{t.subscribe}</button>
          </form>
        )}
      </div>

      <div className="panel donation-panel" style={{
        background: "linear-gradient(135deg, rgba(14, 95, 242, 0.05) 0%, rgba(195, 25, 50, 0.05) 100%)",
        border: "1px solid var(--line)",
        padding: "16px",
        borderRadius: "8px"
      }}>
        <h3 style={{marginTop: 0, marginBottom: "8px", fontSize: "16px", color: "var(--ink)"}}>
          {t.close === "Yopish" ? "Loyiha xayriyasi" : "Поддержка проекта"}
        </h3>
        <p style={{fontSize: "12.5px", color: "var(--muted)", margin: "0 0 12px 0", lineHeight: "1.4"}}>
          {t.close === "Yopish" 
            ? "Mustaqil jurnalistikamiz rivojiga o'z hissangizni qo'shing." 
            : "Внесите свой вклад в развитие независимой журналистики."}
        </p>
        {donationSuccess ? (
          <div style={{color: "#16a34a", fontWeight: "600", fontSize: "13px", padding: "10px", background: "rgba(22, 163, 74, 0.1)", borderRadius: "4px"}}>
            {t.close === "Yopish" ? "✓ Katta rahmat! To'lov qabul qilindi." : "✓ Спасибо! Платеж принят."}
          </div>
        ) : (
          <form onSubmit={handleDonate} style={{display: "flex", flexDirection: "column", gap: "8px"}}>
            <input type="text" placeholder={t.close === "Yopish" ? "Ismingiz" : "Ваше имя"} value={donorName} onChange={e => setDonorName(e.target.value)} style={{fontSize: "13px", padding:"6px"}} />
            <input type="number" placeholder={t.close === "Yopish" ? "Miqdor (UZS)" : "Сумма (UZS)"} value={donorAmount} onChange={e => setDonorAmount(e.target.value)} required style={{fontSize: "13px", padding:"6px"}} />
            <button className="primary" type="submit" style={{width: "100%", background: "var(--brand)", border:"none", borderRadius:"4px", color:"white", padding:"8px", cursor:"pointer", fontWeight:"bold"}}>
              💳 {t.close === "Yopish" ? "Simulyator to'lov" : "Оплатить (Симуляция)"}
            </button>
          </form>
        )}
      </div>

      <div className="panel ai-recommend-panel">
        <div className="ai-panel-head">
          <span className="ai-badge">AI</span>
          <h3>{t.close === "Yopish" ? "Siz uchun tavsiyalar" : "Рекомендации для вас"}</h3>
        </div>
        <p className="ai-panel-sub">{t.close === "Yopish" ? "O'qish tarixingiz asosida" : "На основе истории чтения"}</p>
        {(() => {
          const historyIds = JSON.parse(localStorage.getItem("yk-history") || "[]").map(h => h.id);
          const readCats = JSON.parse(localStorage.getItem("yk-history") || "[]").map(h => h.category);
          const topCat = readCats.length ? readCats.sort((a,b) => readCats.filter(c=>c===b).length - readCats.filter(c=>c===a).length)[0] : null;
          const recommended = topCat
            ? stories.filter(s => s.category === topCat && !historyIds.includes(s.id)).slice(0, 4)
            : stories.filter(s => (s.views||0) > 0).sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,4);
          const fallback = stories.slice(0,4);
          const list = recommended.length ? recommended : fallback;
          return list.map((s, i) => (
            <button key={s.id} className="ai-rec-item" onClick={() => onOpen && onOpen(s)}
              style={{borderTop: i === 0 ? 0 : "1px solid var(--line)"}}>
              <img src={s.image} alt="" loading="lazy" />
              <div>
                <span className="ai-rec-cat">{s.category}</span>
                <p>{s.title}</p>
              </div>
            </button>
          ));
        })()}
      </div>
    </aside>
  );
}



function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const num = parseInt(target);
    if (isNaN(num)) { setCount(target); return; }
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = Math.ceil(num / (duration / 16));
      const timer = setInterval(() => {
        start += step;
        if (start >= num) { setCount(target); clearInterval(timer); }
        else setCount(start + (target.includes("+") ? "+" : ""));
      }, 16);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return [count, ref];
}

function StatNum({ value }) {
  const [count, ref] = useCountUp(String(value));
  return <strong ref={ref} className="counter-num">{count || value}</strong>;
}

function Special({ t, siteConfig }) {
  const isUz = t.close === "Yopish";
  const cfg = siteConfig
    ? (isUz ? siteConfig.specialUz : siteConfig.specialRu)
    : null;

  const kicker   = cfg?.kicker   || t.special;
  const title    = cfg?.title    || t.specialTitle;
  const text     = cfg?.text     || t.specialText;
  const badge    = cfg?.badge    || (isUz ? "Jonli tahririyat" : "Живая редакция");
  const imgSrc   = cfg?.image    || images.newsroom;
  const features = cfg?.features
    ? cfg.features.split(",").map(f => f.trim()).filter(Boolean)
    : (isUz
      ? ["Tezkor yangiliklar", "Mustaqil tahlil", "Ikki tilda", "Ishonchli manba"]
      : ["Быстрые новости", "Независимый анализ", "На двух языках", "Надёжный источник"]);

  const stats = [
    { num: cfg?.stat1 || "24/7", label: cfg?.stat1label || (isUz ? "Monitoring" : "Мониторинг") },
    { num: cfg?.stat2 || "7",    label: cfg?.stat2label || (isUz ? "Bo'lim" : "Разделов") },
    { num: cfg?.stat3 || "2",    label: cfg?.stat3label || (isUz ? "Til" : "Языка") },
    { num: cfg?.stat4 || "100+", label: cfg?.stat4label || (isUz ? "Maqola" : "Статей") },
  ];

  return (
    <section className="special-section">
      <div className="special-bg-grid" />
      <div className="special-inner">
        <div className="special-left">
          <span className="special-kicker">{kicker}</span>
          <h2 className="special-title">{title}</h2>
          <p className="special-desc">{text}</p>
          <div className="special-features">
            {features.map((f) => (
              <span key={f} className="special-feature-tag">
                <span className="special-dot" />
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="special-right">
          <div className="special-img-wrap">
            <img src={imgSrc} alt="" className="special-img" />
            <div className="special-img-overlay" />
            <div className="special-img-badge">
              <span className="live-dot" />
              {badge}
            </div>
          </div>
          <div className="special-stats">
            {stats.map((s) => (
              <div key={s.num + s.label} className="special-stat fade-in-up">
                <StatNum value={s.num} />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function JournalPage({ t, lang }) {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const isUz = t.close === "Yopish";

  useEffect(() => {
    setLoading(true);
    fetch((import.meta.env.VITE_API_URL || "") + "/api/public/journals")
      .then(res => res.json())
      .then(data => setJournals(data.journals || []))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="section">
      <div className="section-inner">
        <div className="section-head">
          <div>
            <h2 className="section-title">
              {isUz ? "Gazeta va Jurnallar" : "Газеты и журналы"}
            </h2>
            <p className="section-note">
              {isUz ? "Ishonch.uz nashr etgan jurnallar va gazetalarning PDF sonlarini yuklab oling." : "Скачайте PDF-выпуски журналов и газет, опубликованных Ishonch.uz."}
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{textAlign:"center", padding:"40px", color:"var(--muted)"}}>Yuklanmoqda...</div>
        ) : (
          <div className="journals-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "24px",
            marginTop: "24px"
          }}>
            {journals.map(j => (
              <div key={j.id} style={{
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "8px",
                padding: "16px",
                textAlign: "center",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}>
                <div style={{
                  width: "140px",
                  height: "200px",
                  background: "var(--bg)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  marginBottom: "12px",
                  border: "1px solid var(--line)"
                }}>
                  {j.coverUrl ? (
                    <img src={j.coverUrl} alt="" style={{width:"100%", height:"100%", objectFit:"cover"}} />
                  ) : (
                    <span style={{fontSize: "64px"}}>📰</span>
                  )}
                </div>
                <h3 style={{fontSize: "14px", margin: "0 0 6px 0", color: "var(--ink)", fontWeight: "700"}}>{j.title}</h3>
                <small style={{display:"block", color:"var(--muted)", marginBottom:"12px"}}>{j.publishDate}</small>
                <a href={j.pdfUrl} download target="_blank" style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  background: "var(--brand)",
                  color: "white",
                  borderRadius: "4px",
                  fontWeight: "700",
                  textDecoration: "none",
                  fontSize: "12.5px",
                  width: "100%",
                  marginTop: "auto"
                }}>
                  ⬇ {isUz ? "PDF yuklab olish" : "Скачать PDF"}
                </a>
              </div>
            ))}
            {journals.length === 0 && (
              <div style={{gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--muted)"}}>
                {isUz ? "Hozircha yuklangan jurnallar mavjud emas." : "Журналы пока не загружены."}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function ContactPage({ t, page, siteConfig }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);

  const isUz = t.close === "Yopish";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !message) {
      setError(isUz ? "Ism va xabar kiritilishi shart" : "Имя и сообщение обязательны");
      return;
    }
    setLoadingForm(true);
    setError("");
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });
      if (res.ok) {
        setSent(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        const d = await res.json();
        setError(d.error || "Xatolik");
      }
    } catch(err) {
      setError("Aloqa xatosi");
    } finally {
      setLoadingForm(false);
    }
  }

  return (
    <main className="section">
      <div className="section-inner">
        <div className="section-head">
          <div>
            <h2 className="section-title">{page}</h2>
            <p className="section-note">{t.pageNotes[page]}</p>
          </div>
        </div>
        
        <div className="contact-grid" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginTop: "20px"}}>
          <div style={{display:"flex", flexDirection:"column", gap:"15px"}}>
            {(() => {
              const isUz = t.close === "Yopish";
              const contacts = siteConfig && (siteConfig.phone || siteConfig.email || siteConfig.address) ? [
                [isUz ? "Telefon" : "Телефон", siteConfig.phone || "+998 935241107"],
                ["Email", siteConfig.email || "vatan2024@yandex.ru"],
                [isUz ? "Manzil" : "Адрес", siteConfig.address || "Toshkent shahri, Buxoro ko'chasi, 24-uy"]
              ] : t.contact;
              return contacts.map(([title, text]) => (
                <div className="contact-card" key={title} style={{padding: "16px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px"}}>
                  <strong>{title}</strong>
                  <p style={{margin: "8px 0 0 0", color: "var(--muted)", fontSize: "14px"}}>{text}</p>
                </div>
              ));
            })()}
          </div>

          <div className="contact-form-wrap" style={{padding: "24px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px"}}>
            <h3 style={{marginBottom: "16px", color: "var(--ink)", marginTop: 0}}>
              {isUz ? "Tahririyatga xabar yuborish" : "Отправить сообщение"}
            </h3>
            {sent ? (
              <div style={{color: "#16a34a", fontWeight: "600", padding: "16px", background: "rgba(22, 163, 74, 0.1)", borderRadius: "6px"}}>
                {isUz ? "✓ Xabaringiz yuborildi! Tez orada ko'rib chiqamiz." : "✓ Сообщение отправлено! Мы скоро ответим."}
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                {error && <div style={{color: "var(--brand)", fontSize: "13px"}}>⚠️ {error}</div>}
                <div style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                  <span style={{fontSize: "13px", fontWeight: "500", color: "var(--ink)"}}>{isUz ? "Ismingiz *" : "Имя *"}</span>
                  <input value={name} onChange={e => setName(e.target.value)} required style={{padding:"8px", borderRadius:"4px", border:"1px solid var(--line)", background:"var(--bg)", color:"var(--ink)"}} />
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                  <span style={{fontSize: "13px", fontWeight: "500", color: "var(--ink)"}}>{isUz ? "Email manzilingiz" : "Email"}</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{padding:"8px", borderRadius:"4px", border:"1px solid var(--line)", background:"var(--bg)", color:"var(--ink)"}} />
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                  <span style={{fontSize: "13px", fontWeight: "500", color: "var(--ink)"}}>{isUz ? "Mavzu" : "Тема"}</span>
                  <input value={subject} onChange={e => setSubject(e.target.value)} style={{padding:"8px", borderRadius:"4px", border:"1px solid var(--line)", background:"var(--bg)", color:"var(--ink)"}} />
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "4px"}}>
                  <span style={{fontSize: "13px", fontWeight: "500", color: "var(--ink)"}}>{isUz ? "Xabar matni *" : "Текст сообщения *"}</span>
                  <textarea rows="4" value={message} onChange={e => setMessage(e.target.value)} required style={{padding:"8px", borderRadius:"4px", border:"1px solid var(--line)", background:"var(--bg)", color:"var(--ink)"}} />
                </div>
                <button type="submit" disabled={loadingForm} style={{
                  padding: "10px 16px",
                  background: "var(--brand)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "700",
                  cursor: "pointer",
                  marginTop: "8px"
                }}>
                  {loadingForm ? "..." : (isUz ? "Yuborish" : "Отправить")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}



function SkeletonCard() {
  return (
    <article className="story-card skeleton-card">
      <div className="skeleton-img skeleton-anim" />
      <div className="story-body">
        <div className="skeleton-line skeleton-anim" style={{width:"40%",height:14,marginBottom:8}} />
        <div className="skeleton-line skeleton-anim" style={{width:"90%",height:18,marginBottom:6}} />
        <div className="skeleton-line skeleton-anim" style={{width:"75%",height:18,marginBottom:12}} />
        <div className="skeleton-line skeleton-anim" style={{width:"60%",height:13}} />
      </div>
    </article>
  );
}

function AuthorPage({ author, stories, lang, onOpen, onBack, savedIds, onToggleSave }) {
  const authorStories = stories.filter(s => (s.author || "Ishonch.uz tahririyati") === author);
  const initials = author.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const isUz = lang !== "ru";
  return (
    <main className="section">
      <div className="section-inner">
        <button className="article-back-btn" onClick={onBack} style={{marginBottom:24}}>
          <span>&#8592;</span> {isUz ? "Orqaga" : "Назад"}
        </button>
        <div className="author-page-header">
          <div className="author-page-avatar">{initials}</div>
          <div>
            <h1 className="author-page-name">{author}</h1>
            <p className="author-page-count">{authorStories.length} {isUz ? "ta maqola" : "материалов"}</p>
          </div>
        </div>
        <div className="stories-grid" style={{marginTop:32}}>
          {authorStories.length === 0 ? (
            <p style={{color:"var(--muted)"}}>{isUz ? "Maqolalar topilmadi" : "Материалы не найдены"}</p>
          ) : authorStories.map(story => (
            <StoryCard key={story.id} story={story} savedIds={savedIds} onToggleSave={onToggleSave}
              onOpen={() => onOpen(story)} />
          ))}
        </div>
      </div>
    </main>
  );
}

function TagPage({ tag, stories, lang, onOpen, onBack, savedIds, onToggleSave }) {
  const tagStories = stories.filter(s => s.tags && s.tags.split(",").map(t => t.trim()).includes(tag));
  const isUz = lang !== "ru";
  return (
    <main className="section">
      <div className="section-inner">
        <button className="article-back-btn" onClick={onBack} style={{marginBottom:24}}>
          <span>&#8592;</span> {isUz ? "Orqaga" : "Назад"}
        </button>
        <div className="section-head">
          <div>
            <h2 className="section-title">🏷️ #{tag}</h2>
            <p className="section-note">{tagStories.length} {isUz ? "ta maqola" : "материалов"}</p>
          </div>
        </div>
        <div className="stories-grid" style={{marginTop:24}}>
          {tagStories.length === 0 ? (
            <p style={{color:"var(--muted)"}}>{isUz ? "Bu teg bo'yicha maqolalar topilmadi" : "Материалы по этому тегу не найдены"}</p>
          ) : tagStories.map(story => (
            <StoryCard key={story.id} story={story} savedIds={savedIds} onToggleSave={onToggleSave}
              onOpen={() => onOpen(story)} />
          ))}
        </div>
      </div>
    </main>
  );
}

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

function ArticlePage({ t, story, stories, onClose, onOpen, onView, savedIds = [], onToggleSave, copiedShare, setCopiedShare, reactions = {}, addReaction, onAuthorClick, onTagClick }) {
  const initials = (story.author || "IU").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const isHtml = story.body && /<[a-z]/.test(story.body);
  const paragraphs = isHtml ? [] : (story.body || story.summary || "").split("\n\n").filter(Boolean);
  const related = stories.filter(s => s.id !== story.id && s.category === story.category).slice(0, 3);
  const more = stories.filter(s => s.id !== story.id && s.category !== story.category).slice(0, 3);
  const readMore = related.length ? related : more;
  const tags = story.tags ? story.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  const embedUrl = getYouTubeEmbedUrl(story.url);
  const isDirectVideo = story.url && (story.url.endsWith(".mp4") || story.url.endsWith(".webm") || story.url.endsWith(".ogg"));
  const [readProgress, setReadProgress] = useState(0);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [zenMode, setZenMode] = useState(false);

  async function loadApprovedComments() {
    setLoadingComments(true);
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "") + `/api/public/comments?storyId=${story.id}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingComments(false);
    }
  }

  useEffect(() => {
    loadApprovedComments();
  }, [story.id]);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentSent, setCommentSent] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const isUz = t.close === "Yopish";
  const readTime = calcReadTime((story.body || story.summary || ""), t.close !== "Yopish" ? "ru" : "uz");
  // Table of contents (h2 headings dan)
  const headings = isHtml ? Array.from(new DOMParser().parseFromString(story.body,"text/html").querySelectorAll("h2")).map(h=>h.textContent) : [];
  // Swipe navigation (ignoring vertical scrolling)
  const storyIndex = stories.findIndex(s => s.id === story.id);
  const prevStory = storyIndex > 0 ? stories[storyIndex - 1] : null;
  const nextStory = storyIndex < stories.length - 1 ? stories[storyIndex + 1] : null;
  const touchStartRef = useRef(null);
  useEffect(() => {
    function onTouchStart(e) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
    function onTouchEnd(e) {
      if (!touchStartRef.current) return;
      const diffX = touchStartRef.current.x - e.changedTouches[0].clientX;
      const diffY = touchStartRef.current.y - e.changedTouches[0].clientY;
      if (Math.abs(diffX) > 80 && Math.abs(diffX) > Math.abs(diffY) * 1.8) {
        if (diffX > 0 && nextStory) { onOpen(nextStory); window.scrollTo({top:0,behavior:"auto"}); }
        if (diffX < 0 && prevStory) { onOpen(prevStory); window.scrollTo({top:0,behavior:"auto"}); }
      }
      touchStartRef.current = null;
    }
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [nextStory, prevStory]);

  useEffect(() => {
    if (onView) onView(story.id);
    const history = JSON.parse(localStorage.getItem("yk-history") || "[]");
    const filtered = history.filter(h => h.id !== story.id);
    const updated = [{ id: story.id, title: story.title, image: story.image, category: story.category, time: story.time }, ...filtered].slice(0, 15);
    localStorage.setItem("yk-history", JSON.stringify(updated));
  }, [story.id]);

  useEffect(() => {
    document.title = `${story.title} — Ishonch.uz`;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = story.summary || "";
    let og = document.querySelector('meta[property="og:title"]');
    if (!og) { og = document.createElement('meta'); og.setAttribute('property','og:title'); document.head.appendChild(og); }
    og.content = story.title;
    let ogImg = document.querySelector('meta[property="og:image"]');
    if (!ogImg) { ogImg = document.createElement('meta'); ogImg.setAttribute('property','og:image'); document.head.appendChild(ogImg); }
    ogImg.content = story.image || "";
    return () => { document.title = "Ishonch.uz"; };
  }, [story.id]);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop || (document.body ? document.body.scrollTop : 0);
      const total = el.scrollHeight - el.clientHeight;
      const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;
      setReadProgress(Math.max(0, Math.min(100, pct)));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function submitComment(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    const payload = {
      storyId: story.id,
      name: commentName.trim() || (isUz ? "Mehmon" : "Гость"),
      text: commentText.trim()
    };
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setCommentText("");
        setCommentName("");
        setCommentSent(true);
        setTimeout(() => setCommentSent(false), 3000);
        alert(isUz ? "✓ Izohingiz yuborildi. Moderator tasdiqlaganidan so'ng saytda ko'rinadi." : "✓ Ваш комментарий отправлен. Он появится после модерации.");
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  }

  return (
    <div className={`article-page ${isEntering ? "entering" : ""}`} onAnimationEnd={() => setIsEntering(false)}>
      <div className="read-progress-bar" style={{width: readProgress + "%"}} />
      <div className={`article-page-inner ${zenMode ? "zen-mode" : ""}`}>

        <div className="article-top-actions" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <button className="article-back-btn" onClick={onClose} style={{ margin: 0 }}>
            <span>&#8592;</span> {t.close === "Yopish" ? "Orqaga" : "Назад"}
          </button>
          <button className={`zen-toggle-btn ${zenMode ? "active" : ""}`} onClick={() => setZenMode(!zenMode)} title={t.close === "Yopish" ? "O'qish rejimi" : "Режим чтения"}>
            {zenMode ? "👁️ " + (t.close === "Yopish" ? "Oddiy rejim" : "Обычный") : "👓 " + (t.close === "Yopish" ? "Toza o'qish" : "Режим чтения")}
          </button>
        </div>

        <article className="article-full">
          <div className="article-page-content">
            {/* Breadcrumbs */}
            <div className="breadcrumbs" style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "12px", display: "flex", gap: "6px" }}>
              <span style={{ cursor: "pointer" }} onClick={onClose}>{t.close === "Yopish" ? "Bosh sahifa" : "Главная"}</span>
              <span>&gt;</span>
              <span>{story.category || (t.close === "Yopish" ? "Video" : "Видео")}</span>
            </div>

            {/* Header: Title and Summary */}
            <div className="article-header" style={{ marginBottom: "16px" }}>
              <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--ink)", lineHeight: "1.3", marginBottom: "12px" }}>{story.title}</h1>
              <p className="article-lead" style={{ fontSize: "16px", color: "var(--muted)", lineHeight: "1.5", fontWeight: "normal" }}>{story.summary}</p>
            </div>

            {/* Metadata Bar */}
            <div className="article-meta-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--line)", paddingBottom: "12px", marginBottom: "20px" }}>
              <span className="kicker" style={{ margin: 0, textTransform: "uppercase", background: "rgba(195,25,50,0.08)", color: "var(--brand)", padding: "4px 10px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>{story.category}</span>
              <div style={{ display: "flex", gap: "15px", fontSize: "13px", color: "var(--muted)", alignItems: "center" }}>
                {story.views > 0 && <span>👁 {story.views}</span>}
                <span>⏱ {story.time || "12:00"} | {story.date || new Date(story.createdAt || Date.now()).toLocaleDateString('ru-RU')}</span>
              </div>
            </div>

            {/* Media Block: Video player or Hero image */}
            {embedUrl ? (
              <div className="article-video-player" style={{ position: "relative", paddingTop: "56.25%", height: 0, overflow: "hidden", borderRadius: "12px", border: "1px solid var(--line)", marginBottom: "24px", background: "#000" }}>
                <iframe
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  src={embedUrl}
                  title={story.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : isDirectVideo ? (
              <div className="article-video-player" style={{ marginBottom: "24px" }}>
                <video
                  src={story.url}
                  controls
                  style={{ width: "100%", borderRadius: "12px", border: "1px solid var(--line)" }}
                />
              </div>
            ) : story.image ? (
              <div className="article-hero-wrap" style={{ borderRadius: "12px", overflow: "hidden", marginBottom: "24px", maxHeight: "480px" }}>
                <img src={story.image} alt={story.title} className="article-hero-img" style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            ) : null}
            {tags.length > 0 && (
              <div className="article-tags">
                {tags.map(tag => <button key={tag} className="article-tag tag-btn" onClick={() => onTagClick && onTagClick(tag)}>#{tag}</button>)}
              </div>
            )}

            {headings.length > 1 && (
              <nav className="toc-box">
                <strong className="toc-title">{isUz ? "📋 Mundarija" : "📋 Содержание"}</strong>
                <ol className="toc-list">
                  {headings.map((h, i) => (
                    <li key={i}><a href={`#heading-${i}`} className="toc-link">{h}</a></li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="article-body-text">
              {isHtml
                ? <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(story.body)}} />
                : paragraphs.length > 1
                  ? paragraphs.map((para, i) => <p key={i}>{para}</p>)
                  : <p>{story.body || story.summary}</p>}
            </div>

            <div className="article-author-row">
              <button className="article-avatar author-btn" onClick={() => onAuthorClick && onAuthorClick(story.author || "Ishonch.uz tahririyati")}>{initials}</button>
              <div>
                <button className="author-name-btn" onClick={() => onAuthorClick && onAuthorClick(story.author || "Ishonch.uz tahririyati")}>{story.author || "Ishonch.uz tahririyati"}</button>
                <span style={{display:"flex",gap:10,alignItems:"center",fontSize:13,color:"var(--muted)"}}>
                  {story.read}
                  {readTime && <span style={{display:"flex",alignItems:"center",gap:4}}>⏱ {readTime}</span>}
                </span>
              </div>
            </div>

            <div className="article-meta-row">
              {story.views > 0 && <span className="article-views">👁 {story.views} marta o'qilgan</span>}
            </div>

            {addReaction && (() => {
              const storyReactions = (reactions || {})[story.id] || {};
              const myReaction = storyReactions._mine;
              const emojis = ["👍","❤️","😮","😂","😢"];
              return (
                <div className="reactions-row">
                  <span className="reactions-label">{isUz ? "Fikr bildiring:" : "Реакция:"}</span>
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      className={`reaction-btn ${myReaction === emoji ? "active" : ""}`}
                      onClick={() => addReaction(story.id, emoji)}
                    >
                      {emoji}
                      {storyReactions[emoji] > 0 && <span className="reaction-count">{storyReactions[emoji]}</span>}
                    </button>
                  ))}
                </div>
              );
            })()}

            <div className="article-share">
              <span className="article-share-label">{t.close === "Yopish" ? "Ulashish:" : "Поделиться:"}</span>
              <a
                className="share-btn telegram"
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(story.title)}`}
                target="_blank"
                rel="noopener noreferrer"
              >✈️ Telegram</a>
              <button
                className={`share-btn ${copiedShare ? "copied" : ""}`}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopiedShare(true);
                  setTimeout(() => setCopiedShare(false), 2000);
                }}
              >{copiedShare ? "✓ Nusxalandi" : "🔗 Havola"}</button>
              <button
                className={`bookmark-btn ${savedIds.includes(story.id) ? "saved" : ""}`}
                onClick={() => onToggleSave && onToggleSave(story.id)}
              >{savedIds.includes(story.id) ? "★ Saqlangan" : "☆ Saqlash"}</button>
              <button className="share-btn" onClick={() => window.print()}>🖨️ {isUz ? "Chop etish" : "Печать"}</button>
            </div>
          </div>
        </article>

        {readMore.length > 0 && (
          <section className="article-related">
            <h2 className="section-title">{isUz ? "O'xshash maqolalar" : "Похожие материалы"}</h2>
            <div className="article-related-grid">
              {readMore.map(s => (
                <article key={s.id} className="story-card">
                  <button onClick={() => onOpen(s)}>
                    <img className="story-image" src={s.image} alt="" loading="lazy" />
                    <div className="story-body">
                      <span className="category" data-cat={s.category}>{s.category}</span>
                      <h3>{s.title}</h3>
                      <p>{s.summary}</p>
                      <div className="story-footer">
                        <span>{s.time}</span>
                        <span>{s.read}</span>
                      </div>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="comments-section">
          <h2 className="section-title">
            💬 {isUz ? "Izohlar" : "Комментарии"}
            {comments.length > 0 && <span className="comments-count">{comments.length}</span>}
          </h2>

          <form className="comment-form" onSubmit={submitComment}>
            <input
              className="comment-input"
              placeholder={isUz ? "Ismingiz (ixtiyoriy)" : "Ваше имя (необязательно)"}
              value={commentName}
              onChange={e => setCommentName(e.target.value)}
              maxLength={60}
            />
            <textarea
              className="comment-textarea"
              placeholder={isUz ? "Fikringizni yozing..." : "Напишите ваш комментарий..."}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              rows={3}
              maxLength={1000}
              required
            />
            <div className="comment-form-footer">
              {commentSent && <span className="comment-sent">✓ {isUz ? "Izoh qo'shildi!" : "Комментарий добавлен!"}</span>}
              <button type="submit" className="adm-btn primary" style={{marginLeft:"auto"}}>
                {isUz ? "Yuborish" : "Отправить"}
              </button>
            </div>
          </form>

          {comments.length === 0 ? (
            <div className="comments-empty">
              <span>💬</span>
              <p>{isUz ? "Hozircha izoh yo'q. Birinchi bo'ling!" : "Комментариев пока нет. Будьте первым!"}</p>
            </div>
          ) : (
            <div className="comments-list">
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="comment-avatar">{(c.name || "?")[0].toUpperCase()}</div>
                  <div className="comment-body">
                    <div className="comment-meta">
                      <strong>{c.name}</strong>
                      <span>{c.date}</span>
                    </div>
                    <p>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function AdminPanel({ lang, setLang, allStories, stories, setAllStories, refreshPublicStories, siteConfig, setSiteConfig, pinnedHeroId, setPinnedHeroId, pinnedSideIds, setPinnedSideIds, ads, setAds, refreshPublicVideos, refreshPublicPhotos }) {
  const adminLang = lang === "uzk" ? "uz" : lang;
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // New Security State variables
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [loginHistory, setLoginHistory] = useState([]);
  const [accountCreatedAt, setAccountCreatedAt] = useState("");
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("stats");
  const [form, setForm] = useState({ ...emptyStory, category: lang !== "ru" ? "Siyosat" : "Политика" });

  const itemSubcategories = useMemo(() => {
    if (!siteConfig) return {};
    if (lang === "uz") return siteConfig.subcategoriesUz || {};
    if (lang === "uzk") return siteConfig.subcategoriesUzk || {};
    return siteConfig.subcategoriesRu || {};
  }, [lang, siteConfig]);
  
  // 🔄 Undo/Redo history
  const [formHistory, setFormHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const maxHistory = 20;

  // 📱 Bulk actions
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaFilter, setMediaFilter] = useState("all");
  const [mediaUploading, setMediaUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState("");
  const mediaFileRef = useRef(null);
  const importFileRef = useRef(null);
  const mainLogoInputRef = useRef(null);
  const footerLogoInputRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const EMPTY_AD = { id: "", title: "", subtitle: "", image: "", link: "", position: "top", active: true };
  const [adForm, setAdForm] = useState(EMPTY_AD);
  const [editingAdId, setEditingAdId] = useState(null);
  
  // 🖼️ Cropper and Ad Stats States
  const [cropSrc, setCropSrc] = useState(null);
  const [cropSliders, setCropSliders] = useState({ x: 0, y: 0, scale: 100 });
  const cropCanvasRef = useRef(null);

  // --- 🆕 NEW COLLECTIONS STATES ---
  const [quotes, setQuotes] = useState([]);
  const [videosAdminList, setVideosAdminList] = useState([]);
  const EMPTY_VIDEO = { type: "video", title: "", meta: "", image: "", url: "", lang: "uz", summary: "", body: "", author: "Ishonch.uz tahririyati", tags: "", metaTitle: "", metaDesc: "" };
  const [videoForm, setVideoForm] = useState(EMPTY_VIDEO);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const videoThumbnailRef = useRef(null);

  const [photosAdminList, setPhotosAdminList] = useState([]);
  const EMPTY_PHOTO = { type: "photo", title: "", meta: "", image: "", url: "", lang: "uz", summary: "", body: "", author: "Ishonch.uz tahririyati", tags: "", metaTitle: "", metaDesc: "" };
  const [photoForm, setPhotoForm] = useState(EMPTY_PHOTO);
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const photoCoverRef = useRef(null);
  const [activeMediaSelector, setActiveMediaSelector] = useState(null);
  const [seoSearch, setSeoSearch] = useState("");
  const [seoFilter, setSeoFilter] = useState("all");
  const [aiSeoResult, setAiSeoResult] = useState(null);
  const [aiSeoLoading, setAiSeoLoading] = useState(false);
  const [journals, setJournals] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [comments, setComments] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pagesList, setPagesList] = useState([]);
  const [newsletterHistory, setNewsletterHistory] = useState([]);

  // --- 🆕 FORMS STATES FOR NEW TABS ---
  const EMPTY_QUOTE = { text: "", author: "", status: "active" };
  const [quoteForm, setQuoteForm] = useState(EMPTY_QUOTE);
  const [editingQuoteId, setEditingQuoteId] = useState(null);

  const EMPTY_JOURNAL = { title: "", coverUrl: "", pdfUrl: "", publishDate: new Date().toISOString().split("T")[0] };
  const [journalForm, setJournalForm] = useState(EMPTY_JOURNAL);
  const [editingJournalId, setEditingJournalId] = useState(null);

  const EMPTY_AUTHOR = { name: "", bio: "", avatar: "", role: "", status: "active" };
  const [authorForm, setAuthorForm] = useState(EMPTY_AUTHOR);
  const [editingAuthorId, setEditingAuthorId] = useState(null);

  const EMPTY_PAGE = { title: "", slug: "", body: "", status: "published" };
  const [pageForm, setPageForm] = useState(EMPTY_PAGE);
  const [editingPageId, setEditingPageId] = useState(null);

  const EMPTY_NEWSLETTER = { subject: "", body: "" };
  const [newsletterForm, setNewsletterForm] = useState(EMPTY_NEWSLETTER);

  // Home configuration page states (expanded for all system settings)
  const [homeConfig, setHomeConfig] = useState({
    siteName: "",
    tagline: "",
    logoUrl: "",
    footerLogoUrl: "",
    phone: "",
    email: "",
    address: "",
    telegram: "",
    facebook: "",
    instagram: "",
    youtube: "",
    googleAnalyticsId: "",
    yandexMetrikaId: "",
    telegramBotToken: "",
    telegramChatId: "",
    descriptionUz: "",
    descriptionRu: "",
    descriptionUzk: "",
    keywords: "",
    brandColor: "",
    bannerText: "",
    bannerActive: false,
    maintenanceMode: false,
    visitorStatsActive: true,
    langUzActive: true,
    langUzkActive: true,
    langRuActive: true
  });

  const [settingsSubTab, setSettingsSubTab] = useState("general");
  const [generatingSeoFiles, setGeneratingSeoFiles] = useState(false);

  async function generateStaticSeoFiles() {
    setGeneratingSeoFiles(true);
    try {
      const data = await api("/api/admin/seo/generate", { method: "POST" });
      if (data.success) {
        notify("✓ Static Sitemap va Robots.txt muvaffaqiyatli yaratildi!", "success");
      } else {
        notify("Xatolik: " + (data.error || "Nomalum xatolik"), "error");
      }
    } catch (e) {
      notify("Xatolik: Ulanish imkonsiz", "error");
    } finally {
      setGeneratingSeoFiles(false);
    }
  }

  async function handleAiSeoOptimize(type) {
    setAiSeoLoading(true);
    setAiSeoResult(null);
    try {
      let title = "";
      let body = "";
      
      if (type === 'story') {
        title = form.title || "";
        body = (form.body || "") + " " + (form.summary || "");
      } else if (type === 'video') {
        title = videoForm.title || "";
        body = (videoForm.body || "") + " " + (videoForm.summary || "") + " " + (videoForm.meta || "");
      } else if (type === 'photo') {
        title = photoForm.title || "";
        body = (photoForm.body || "") + " " + (photoForm.summary || "") + " " + (photoForm.meta || "");
      }
      
      if (!title.trim() && !body.trim()) {
        notify("Avval sarlavha (title) yoki matn kiriting", "info");
        setAiSeoLoading(false);
        return;
      }
      
      if (!title.trim()) {
        const cleanBody = body.replace(/<[^>]*>/g, "").trim();
        const firstWords = cleanBody.split(/\s+/).slice(0, 6).join(" ");
        title = firstWords || "Mavzulashtirilmagan maqola";
      }
      
      const data = await api("/api/admin/seo/ai-suggest", {
        method: "POST",
        body: JSON.stringify({ title, body, type })
      });
      
      setAiSeoResult(data);
      notify("✨ AI SEO tavsiyalari tayyorlandi!", "success");
    } catch (e) {
      console.error("AI SEO request failed", e);
      notify("AI tahlilida xatolik: " + e.message, "error");
    } finally {
      setAiSeoLoading(false);
    }
  }

  useEffect(() => {
    setAiSeoResult(null);
  }, [activeTab, editingId, editingVideoId, editingPhotoId]);

  function renderAiSeoAssistantWidget(type) {
    return (
      <div style={{marginTop: "12px", borderBottom: "1px dashed var(--line)", paddingBottom: "16px", marginBottom: "16px"}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <strong style={{color: "var(--brand)", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px"}}>
            <span>✨</span> Sun'iy Intellekt (AI) Yordamchisi
          </strong>
          <button
            type="button"
            className="adm-btn primary"
            disabled={aiSeoLoading}
            onClick={() => handleAiSeoOptimize(type)}
            style={{fontSize: "11px", padding: "4px 10px"}}
          >
            {aiSeoLoading ? "⏳ Tahlil qilinmoqda..." : "✨ AI bilan to'ldirish"}
          </button>
        </div>

        {aiSeoResult && (
          <div style={{
            background: "rgba(195, 25, 50, 0.05)",
            border: "1px solid rgba(195, 25, 50, 0.15)",
            padding: "12px",
            borderRadius: "6px",
            marginTop: "12px",
            fontSize: "12px",
            color: "var(--ink)"
          }}>
            <h5 style={{margin: "0 0 8px 0", color: "var(--brand)", fontWeight: "600"}}>✨ AI SEO Tavsiyalari:</h5>
            
            <div style={{marginBottom: "8px"}}>
              <strong style={{display: "block", color: "var(--muted)", marginBottom: "2px"}}>Meta sarlavha tavsiyasi:</strong>
              <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
                <span style={{fontStyle: "italic", flex: 1}}>{aiSeoResult.metaTitle}</span>
                <button
                  type="button"
                  className="adm-btn primary"
                  style={{padding: "3px 8px", fontSize: "10px", minWidth: "70px"}}
                  onClick={() => {
                    if (type === 'story') updateField("metaTitle", aiSeoResult.metaTitle);
                    else if (type === 'video') setVideoForm(v => ({ ...v, metaTitle: aiSeoResult.metaTitle }));
                    else if (type === 'photo') setPhotoForm(p => ({ ...p, metaTitle: aiSeoResult.metaTitle }));
                  }}
                >Tadbiq etish</button>
              </div>
            </div>

            <div style={{marginBottom: "8px"}}>
              <strong style={{display: "block", color: "var(--muted)", marginBottom: "2px"}}>Meta tavsif tavsiyasi:</strong>
              <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
                <span style={{fontStyle: "italic", flex: 1}}>{aiSeoResult.metaDesc}</span>
                <button
                  type="button"
                  className="adm-btn primary"
                  style={{padding: "3px 8px", fontSize: "10px", minWidth: "70px"}}
                  onClick={() => {
                    if (type === 'story') updateField("metaDesc", aiSeoResult.metaDesc);
                    else if (type === 'video') setVideoForm(v => ({ ...v, metaDesc: aiSeoResult.metaDesc }));
                    else if (type === 'photo') setPhotoForm(p => ({ ...p, metaDesc: aiSeoResult.metaDesc }));
                  }}
                >Tadbiq etish</button>
              </div>
            </div>

            <div style={{marginBottom: "8px"}}>
              <strong style={{display: "block", color: "var(--muted)", marginBottom: "2px"}}>Teglar / Kalit so'zlar:</strong>
              <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
                <span style={{fontStyle: "italic", flex: 1}}>{aiSeoResult.tags}</span>
                <button
                  type="button"
                  className="adm-btn primary"
                  style={{padding: "3px 8px", fontSize: "10px", minWidth: "70px"}}
                  onClick={() => {
                    if (type === 'story') updateField("tags", aiSeoResult.tags);
                    else if (type === 'video') setVideoForm(v => ({ ...v, tags: aiSeoResult.tags }));
                    else if (type === 'photo') setPhotoForm(p => ({ ...p, tags: aiSeoResult.tags }));
                  }}
                >Tadbiq etish</button>
              </div>
            </div>

            {aiSeoResult.suggestions && aiSeoResult.suggestions.length > 0 && (
              <div style={{borderTop: "1px solid var(--line)", paddingTop: "8px", marginTop: "8px"}}>
                <strong style={{color: "var(--muted)"}}>SEO bo'yicha tavsiyalar:</strong>
                <ul style={{margin: "4px 0 0 0", paddingLeft: "16px", color: "var(--muted)"}}>
                  {aiSeoResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            <div style={{display: "flex", gap: "8px", marginTop: "12px", borderTop: "1px solid var(--line)", paddingTop: "8px"}}>
              <button
                type="button"
                className="adm-btn primary"
                style={{padding: "5px 10px", fontSize: "11px", flex: 1}}
                onClick={() => {
                  if (type === 'story') {
                    updateField("metaTitle", aiSeoResult.metaTitle);
                    updateField("metaDesc", aiSeoResult.metaDesc);
                    updateField("tags", aiSeoResult.tags);
                  } else if (type === 'video') {
                    setVideoForm(v => ({
                      ...v,
                      metaTitle: aiSeoResult.metaTitle,
                      metaDesc: aiSeoResult.metaDesc,
                      tags: aiSeoResult.tags
                    }));
                  } else if (type === 'photo') {
                    setPhotoForm(p => ({
                      ...p,
                      metaTitle: aiSeoResult.metaTitle,
                      metaDesc: aiSeoResult.metaDesc,
                      tags: aiSeoResult.tags
                    }));
                  }
                  notify("Barcha tavsiyalar tadbiq etildi!", "success");
                }}
              >Barchasini qabul qilish</button>
              <button
                type="button"
                className="adm-btn ghost"
                style={{padding: "5px 10px", fontSize: "11px"}}
                onClick={() => setAiSeoResult(null)}
              >Yopish</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Transliterator Cyrillic Map
  function generateSlug(title) {
    const cyrMap = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'j', 'з': 'z',
      'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
      'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh',
      'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', 'ў': 'o', 'қ': 'q', 'ғ': 'g', 'ҳ': 'h'
    };
    let text = (title || "").toLowerCase().trim();
    let transliterated = "";
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      transliterated += cyrMap[char] !== undefined ? cyrMap[char] : char;
    }
    return transliterated
      .replace(/[ʻ'ʽ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // --- 🆕 LOAD COLLECTIONS ---
  async function loadAllAdminCollections() {
    try {
      const qData = await api("/api/admin/quotes"); setQuotes(qData.quotes || []);
      const vData = await api("/api/admin/videos"); setVideosAdminList(vData.videos || []);
      const phData = await api("/api/admin/photos"); setPhotosAdminList(phData.photos || []);
      const jData = await api("/api/admin/journals"); setJournals(jData.journals || []);
      const mData = await api("/api/admin/messages"); setMessagesList(mData.messages || []);
      const cData = await api("/api/admin/comments"); setComments(cData.comments || []);
      const aData = await api("/api/admin/authors"); setAuthors(aData.authors || []);
      const sData = await api("/api/admin/subscribers"); setSubscribers(sData.subscribers || []);
      const pData = await api("/api/admin/payments"); setPayments(pData.payments || []);
      const pgData = await api("/api/admin/pages"); setPagesList(pgData.pages || []);
      
      const nlRes = await fetch((import.meta.env.VITE_API_URL || "") + "/api/admin/newsletter/history"); 
      const nlData = await nlRes.json();
      setNewsletterHistory(nlData.sentNewsletters || []);

      try {
        const lhRes = await fetch((import.meta.env.VITE_API_URL || "") + "/api/admin/login-history", { credentials: "same-origin" });
        if (lhRes.ok) {
          const lhData = await lhRes.json();
          setLoginHistory(lhData.history || []);
          setAccountCreatedAt(lhData.createdAt || "");
        }
      } catch(e) { console.error("Failed to load login history", e); }
    } catch (e) {
      console.error("Collections loading failed:", e);
    }
  }

  const seoAudit = useMemo(() => {
    // 1. Gather all database items
    const storiesList = [];
    for (const langKey of ['uz', 'ru', 'uzk']) {
      const list = allStories[langKey] || [];
      list.forEach(s => storiesList.push({ ...s, type: 'story', lang: langKey }));
    }

    const videosList = (videosAdminList || []).map(v => ({ ...v, type: 'video' }));
    const photosList = (photosAdminList || []).map(ph => ({ ...ph, type: 'photo' }));
    
    const allItems = [...storiesList, ...videosList, ...photosList];

    // 2. Audit each item
    let totalScoreSum = 0;
    const itemsScanned = allItems.length;
    const auditedItems = allItems.map(item => {
      const audit = calculateSeoScore(item, item.type);
      totalScoreSum += audit.score;
      return {
        ...item,
        seoScore: audit.score,
        seoIssues: audit.issues
      };
    });

    // 3. Audit global site config
    const globalIssues = [];
    let globalConfigScore = 0;

    if (siteConfig) {
      if (siteConfig.siteName && siteConfig.siteName.trim()) {
        globalConfigScore += 10;
      } else {
        globalIssues.push({ severity: 'high', text: "Site nomi kiritilmagan (Missing Site Name)" });
      }

      if (siteConfig.logoUrl && siteConfig.logoUrl.trim()) {
        globalConfigScore += 10;
      } else {
        globalIssues.push({ severity: 'high', text: "Site logo URL belgilanmagan (Missing Site Logo)" });
      }

      if (siteConfig.footerLogoUrl && siteConfig.footerLogoUrl.trim()) {
        globalConfigScore += 10;
      } else {
        globalIssues.push({ severity: 'medium', text: "Footer logo URL belgilanmagan (Missing Footer Logo)" });
      }

      const keywords = siteConfig.keywords || "";
      const kwCount = keywords.split(',').map(k => k.trim()).filter(Boolean).length;
      if (kwCount >= 5) {
        globalConfigScore += 10;
      } else {
        globalIssues.push({ severity: 'medium', text: `Global kalit so'zlar kam (${kwCount} ta, ideal: kamida 5 ta kalit so'z)` });
      }

      const descUz = siteConfig.descriptionUz || "";
      if (descUz.length >= 100) {
        globalConfigScore += 10;
      } else {
        globalIssues.push({ severity: 'medium', text: "Global Uzbek Latin tavsifi juda qisqa yoki bo'sh" });
      }

      const descUzk = siteConfig.descriptionUzk || "";
      if (descUzk.length >= 100) {
        globalConfigScore += 10;
      } else {
        globalIssues.push({ severity: 'medium', text: "Global Uzbek Cyrillic tavsifi juda qisqa yoki bo'sh" });
      }
    } else {
      globalIssues.push({ severity: 'high', text: "Global sozlamalar fayli (siteConfig) yuklanmagan" });
    }

    // 4. Calculate distributions and totals
    const criticalItems = auditedItems.filter(x => x.seoScore < 50);
    const warningItems = auditedItems.filter(x => x.seoScore >= 50 && x.seoScore < 80);
    const goodItems = auditedItems.filter(x => x.seoScore >= 80);

    const averageArticleScore = itemsScanned > 0 ? Math.round(totalScoreSum / itemsScanned) : 100;
    const globalScore = Math.round((averageArticleScore * 0.7) + (globalConfigScore * 0.3 * (100 / 60)));

    // WebP Coverage
    const coverImages = auditedItems.map(x => x.image).filter(Boolean);
    const webpCount = coverImages.filter(img => img.toLowerCase().includes('.webp')).length;
    const webpCoverage = coverImages.length > 0 ? Math.round((webpCount / coverImages.length) * 100) : 100;

    return {
      auditedItems,
      globalIssues,
      globalScore,
      webpCoverage,
      counts: {
        total: itemsScanned,
        critical: criticalItems.length,
        warnings: warningItems.length,
        good: goodItems.length
      }
    };
  }, [allStories, videosAdminList, photosAdminList, siteConfig]);

  // Cropper effect
  useEffect(() => {
    if (!cropSrc) return;
    const canvas = cropCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = cropSrc;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const canvasRatio = 16 / 9;
      const imgRatio = img.width / img.height;
      let sWidth = img.width;
      let sHeight = img.height;
      if (imgRatio > canvasRatio) {
        sWidth = img.height * canvasRatio;
      } else {
        sHeight = img.width / canvasRatio;
      }
      const scaleFactor = 100 / cropSliders.scale;
      const cropW = sWidth * scaleFactor;
      const cropH = sHeight * scaleFactor;
      const maxDeltaX = (img.width - cropW) / 2;
      const maxDeltaY = (img.height - cropH) / 2;
      const offsetX = (cropSliders.x / 50) * maxDeltaX;
      const offsetY = (cropSliders.y / 50) * maxDeltaY;
      const sx = Math.max(0, Math.min(img.width - cropW, (img.width - cropW) / 2 + offsetX));
      const sy = Math.max(0, Math.min(img.height - cropH, (img.height - cropH) / 2 + offsetY));
      ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, canvas.width, canvas.height);
    };
  }, [cropSrc, cropSliders]);

  async function handleCropUpload() {
    const canvas = cropCanvasRef.current;
    if (!canvas) return;
    const croppedDataUrl = canvas.toDataURL("image/webp", 0.8);
    setCropSrc(null);
    setMediaUploading(true);
    notify("⏳ Rasm yuklanmoqda...", "info");
    try {
      const data = await api("/api/admin/upload", {
        method: "POST",
        body: JSON.stringify({ dataUrl: croppedDataUrl }),
      });
      updateField("image", data.url);
      notify("✓ Rasm muvaffaqiyatli qirqildi va yuklandi.", "success");
    } catch (error) {
      notify("Xatolik: " + error.message, "error");
    }
    setMediaUploading(false);
  }

  // Auto-save draft
  useEffect(() => {
    if (activeTab !== "editor" || !form.title) return;
    const interval = setInterval(() => {
      const draftKey = `yk-draft-${editingId || 'new'}`;
      localStorage.setItem(draftKey, JSON.stringify({
        form,
        savedAt: new Date().toISOString(),
        lang
      }));
      notify("💾 Qoralama saqlandi", "info", 1500);
    }, 30000);
    return () => clearInterval(interval);
  }, [activeTab, form, editingId, lang]);

  // Restore draft
  useEffect(() => {
    if (activeTab === "editor" && !editingId) {
      const draft = localStorage.getItem('yk-draft-new');
      if (draft) {
        const { form: savedForm, savedAt } = JSON.parse(draft);
        const minutesAgo = Math.floor((Date.now() - new Date(savedAt).getTime()) / 60000);
        if (minutesAgo < 60 && window.confirm(`💾 ${minutesAgo} daqiqa oldingi qoralama topildi. Tiklashni xohlaysizmi?`)) {
          setForm(savedForm);
        }
      }
    }
  }, [activeTab, editingId]);

  const categories = useMemo(() => {
    if (lang === "uz") return siteConfig.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"];
    if (lang === "uzk") return siteConfig.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"];
    return siteConfig.categoriesRu || ["Политика", "Экономика", "Технологии", "Спорт", "Культура", "Аналитика"];
  }, [lang, siteConfig]);

  // Initialize Home settings form
  useEffect(() => {
    if (siteConfig) {
      setHomeConfig({
        siteName: siteConfig.siteName || "VATAN",
        tagline: siteConfig.tagline || "",
        logoUrl: siteConfig.logoUrl || (import.meta.env.VITE_API_URL || "") + "/uploads/logo.svg",
        footerLogoUrl: siteConfig.footerLogoUrl || "",
        phone: siteConfig.phone || "",
        email: siteConfig.email || "",
        address: siteConfig.address || "",
        telegram: siteConfig.telegram || "",
        facebook: siteConfig.facebook || "",
        instagram: siteConfig.instagram || "",
        youtube: siteConfig.youtube || "",
        googleAnalyticsId: siteConfig.googleAnalyticsId || "",
        yandexMetrikaId: siteConfig.yandexMetrikaId || "",
        telegramBotToken: siteConfig.telegramBotToken || "",
        telegramChatId: siteConfig.telegramChatId || "",
        descriptionUz: siteConfig.descriptionUz || "",
        descriptionRu: siteConfig.descriptionRu || "",
        descriptionUzk: siteConfig.descriptionUzk || "",
        keywords: siteConfig.keywords || "",
        brandColor: siteConfig.brandColor || "#c31932",
        bannerText: siteConfig.bannerText || "",
        bannerActive: siteConfig.bannerActive || false,
        maintenanceMode: siteConfig.maintenanceMode || false,
        visitorStatsActive: siteConfig.visitorStatsActive !== false,
        langUzActive: siteConfig.langUzActive !== false,
        langUzkActive: siteConfig.langUzkActive !== false,
        langRuActive: siteConfig.langRuActive !== false
      });
    }
  }, [siteConfig]);

  async function loadMedia() {
    try {
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/admin/media", { credentials: "same-origin" });
      const data = await res.json();
      setMediaFiles(data.media || []);
    } catch {}
  }

  async function uploadMediaFile(file) {
    if (!file) return;
    setMediaUploading(true);
    try {
      const compressedDataUrl = await compressImage(file);
      if (!compressedDataUrl) {
        setMediaUploading(false);
        return;
      }
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/admin/upload", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl: compressedDataUrl }),
      });
      const data = await res.json();
      if (data.url) {
        await loadMedia();
        notify("✓ Fayl yuklandi.", "success");
      } else {
        notify(data.error || "Xatolik", "error");
      }
    } catch (e) {
      console.error("Media file upload failed", e);
      notify("Yuklashda xatolik", "error");
    } finally {
      setMediaUploading(false);
    }
  }

  async function uploadLogo(file, type) {
    if (!file) return;
    try {
      notify("⏳ Rasm yuklanmoqda...", "info");
      const compressedDataUrl = await compressImage(file);
      if (!compressedDataUrl) return;
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/admin/upload", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl: compressedDataUrl }),
      });
      const data = await res.json();
      if (data.url) {
        if (type === 'logo') {
          setHomeConfig(prev => ({ ...prev, logoUrl: data.url }));
        } else if (type === 'footer') {
          setHomeConfig(prev => ({ ...prev, footerLogoUrl: data.url }));
        }
        await loadMedia();
        notify("✓ Rasm yuklandi.", "success");
      } else {
        notify(data.error || "Xatolik", "error");
      }
    } catch (e) {
      console.error("Logo upload failed", e);
      notify("Yuklashda xatolik", "error");
    }
  }

  async function deleteMedia(name) {
    if (!confirm(`"${name}" ni o'chirasizmi?`)) return;
    try {
      await fetch((import.meta.env.VITE_API_URL || "") + `/api/admin/media/${name}`, { method: "DELETE", credentials: "same-origin" });
      await loadMedia();
      notify("✓ O'chirildi.", "success");
    } catch { notify("Xatolik", "error"); }
  }

  function selectMediaFile(url) {
    if (!activeMediaSelector) return;
    const target = activeMediaSelector.target;
    if (target === 'story') {
      setForm(prev => ({ ...prev, image: url }));
    } else if (target === 'video') {
      setVideoForm(prev => ({ ...prev, image: url }));
    } else if (target === 'photo') {
      setPhotoForm(prev => ({ ...prev, image: url }));
    } else if (target === 'logo') {
      setHomeConfig(prev => ({ ...prev, logoUrl: url }));
    } else if (target === 'footer') {
      setHomeConfig(prev => ({ ...prev, footerLogoUrl: url }));
    } else if (target === 'ad') {
      setAdForm(prev => ({ ...prev, image: url }));
    }
    setActiveMediaSelector(null);
  }

  async function saveConfig(updatedConfig = siteConfig) {
    try {
      notify("⏳ Sozlamalar saqlanmoqda...", "info");
      const configToSave = {
        pinnedHeroId,
        pinnedSideIds,
        ads,
        ...updatedConfig
      };
      const data = await api("/api/admin/config", {
        method: "PUT",
        body: JSON.stringify({ config: configToSave })
      });
      setSiteConfig(configToSave);
      notify("✓ Barcha sozlamalar muvaffaqiyatli saqlandi!", "success");
    } catch (e) {
      notify("Sozlamalarni saqlashda xatolik: " + e.message, "error");
    }
  }

  function copyUrl(url) {
    navigator.clipboard.writeText(window.location.origin + url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(""), 2000);
    });
  }

  function handleSelectHero(storyId) {
    setPinnedHeroId(storyId);
    saveConfig({ ...siteConfig, pinnedHeroId: storyId });
  }

  function handleSelectSide(newList) {
    setPinnedSideIds(newList);
    saveConfig({ ...siteConfig, pinnedSideIds: newList });
  }

  function handleUpdateAds(newList) {
    setAds(newList);
    saveConfig({ ...siteConfig, ads: newList });
  }

  function notify(text, type = "info", timeout = 4000) {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(""), timeout);
    if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
      new Notification("Ishonch.uz Admin", {
        body: text,
        icon: "📰",
        tag: type,
      });
    }
  }

  function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }

  const [adStats, setAdStats] = useState({});
  async function loadAdStats() {
    try {
      const data = await api("/api/admin/ads/stats");
      setAdStats(data.adStats || {});
    } catch (e) {}
  }

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      loadMedia();
      loadAdStats();
      loadAllAdminCollections();
    }
  }, [loggedIn, activeTab]);

  useEffect(() => {
    setForm((current) => ({ ...current, category: categories.includes(current.category) ? current.category : categories[0] }));
  }, [lang]);

  async function api(path, options = {}) {
    const response = await fetch(path, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options,
    });
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await response.json().catch(() => ({})) : {};
    if (!isJson) throw new Error("Server API mavjud emas");
    if (!response.ok) throw new Error(data.error || "Server xatosi");
    return data;
  }

  function loadUzkStories() {
    return JSON.parse(localStorage.getItem("yk-uzk-stories") || "[]");
  }

  function saveUzkStories(list) {
    localStorage.setItem("yk-uzk-stories", JSON.stringify(list));
  }

  async function loadAdminStories() {
    const data = await api("/api/admin/stories");
    setAllStories(prev => ({ ...prev, ...data.stories, uzk: loadUzkStories() }));
  }

  async function checkSession() {
    try {
      const data = await api("/api/admin/session");
      setLoggedIn(data.authenticated);
      if (data.authenticated) await loadAdminStories();
    } catch (error) {
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }

  async function login(event) {
    event.preventDefault();
    try {
      await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
      setLoggedIn(true);
      notify("Admin panelga xush kelibsiz! ", "success");
      setPassword("");
      requestNotificationPermission();
      await loadAdminStories();
    } catch (error) {
      const staticMessage = "Netlify static hostingda admin panel saqlash funksiyalari ishlamaydi. Admin uchun Node server yoki serverless backend kerak.";
      notify(error.message === "Server API mavjud emas" || error.message.includes("Netlify static hostingda") ? staticMessage : `${error.message}. Standart parol: ${DEFAULT_PASSWORD}`, "error");
    }
  }

  async function logout() {
    await api("/api/admin/logout", { method: "POST", body: "{}" }).catch(() => null);
    setLoggedIn(false);
    await refreshPublicStories();
    notify("Tizimdan chiqildi.", "info");
  }

  function validateForm(f) {
    const errs = {};
    if (!f.title.trim()) errs.title = "Sarlavha kiritish shart!";
    else if (f.title.trim().length < 5) errs.title = "Sarlavha kamida 5 belgi bo'lsin";
    if (!f.summary.trim()) errs.summary = "Qisqa mazmun kiritish shart!";
    else if (f.summary.trim().length < 10) errs.summary = "Mazmun kamida 10 belgi bo'lsin";
    if (!f.body.trim() || f.body === "<p></p>" || f.body === "<p><br></p>") errs.body = "Maqola matni kiritish shart!";
    return errs;
  }

  function updateField(field, value) {
    setIsDirty(true);
    setForm((current) => {
      const newForm = { ...current, [field]: value };
      if (field === 'title' && !current.slug) {
        newForm.slug = generateSlug(value);
      }
      if (formErrors[field]) {
        const errs = validateForm(newForm);
        setFormErrors(prev => ({ ...prev, [field]: errs[field] || null }));
      }
      setFormHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newForm);
        if (newHistory.length > maxHistory) newHistory.shift();
        return newHistory;
      });
      setHistoryIndex(prev => Math.min(prev + 1, maxHistory - 1));
      return newForm;
    });
  }

  function undo() {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setForm(formHistory[newIdx]);
      notify("↩️ Bekor qilindi", "info", 1000);
    }
  }
  function redo() {
    if (historyIndex < formHistory.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setForm(formHistory[newIdx]);
      notify("↪️ Qayta qilindi", "info", 1000);
    }
  }

  // Keyboard shortcuts + beforeunload
  useEffect(() => {
    function onKey(e) {
      if (!loggedIn) return;
      const inInput = ["INPUT","TEXTAREA","SELECT"].includes(e.target.tagName) || e.target.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (activeTab === "editor") document.getElementById("story-form")?.requestSubmit();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        if (isDirty && !window.confirm("O'zgarishlar saqlanmagan. Yangi maqolaga o'tishni xohlaysizmi?")) return;
        resetForm(); setActiveTab("editor");
      }
      if (activeTab !== "editor" || inInput) return;
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    }
    function onBeforeUnload(e) {
      if (isDirty && activeTab === "editor") {
        e.preventDefault();
        e.returnValue = "O'zgarishlar saqlanmagan. Sahifadan chiqishni xohlaysizmi?";
      }
    }
    window.addEventListener('keydown', onKey);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [activeTab, historyIndex, formHistory, isDirty, loggedIn]);

  function handleImageFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropSrc(reader.result);
      setCropSliders({ x: 0, y: 0, scale: 100 });
    };
    reader.readAsDataURL(file);
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyStory, category: categories[0], image: images.newsroom });
    setFormErrors({});
    setIsDirty(false);
  }

  function duplicateStory(story) {
    const dupl = { ...story, id: undefined, title: story.title + " (nusxa)", status: "draft" };
    setForm(dupl);
    setEditingId(null);
    setActiveTab("editor");
    setIsDirty(true);
    notify("📋 Maqola nusxalandi — tahrirlash rejimi", "info");
  }

  function exportStories(format) {
    if (format === "json") {
      const blob = new Blob([JSON.stringify(stories, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `ishonch_uz-${lang}-${new Date().toISOString().slice(0,10)}.json`; a.click();
    } else {
      const cols = ["id","title","category","status","author","views","time"];
      const rows = stories.map(s => cols.map(c => `"${String(s[c]||"").replace(/"/g,'""')}"`).join(","));
      const csv = [cols.join(","), ...rows].join("\n");
      const blob = new Blob(["\uFEFF"+csv], { type: "text/csv;charset=utf-8" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
      a.download = `ishonch_uz-${lang}-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    }
    notify(`✓ ${format.toUpperCase()} sifatida yuklandi`, "success");
  }

  async function saveStory(event) {
    event.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      notify("⚠️ Iltimos, xatolarni to'g'irlang", "error");
      const firstErr = Object.keys(errs)[0];
      document.querySelector(`[data-field="${firstErr}"]`)?.scrollIntoView({ behavior:"smooth", block:"center" });
      return;
    }
    setFormErrors({});

    const shouldSendToTelegram = form.sendToTelegram && form.status === "published";
    const payload = {
      ...form,
      title: form.title.trim(),
      summary: form.summary.trim(),
      body: form.body.trim(),
      author: form.author.trim() || "Ishonch.uz tahririyati",
      time: form.time.trim() || "Hozir",
      read: form.read.trim() || "3 daqiqa",
      image: form.image || images.newsroom,
      script: lang === "uzk" ? "cyrillic" : (form.script || "latin"),
    };

    try {
      const data = editingId
        ? await api(`/api/admin/stories/${adminLang}/${editingId}`, { method: "PUT", body: JSON.stringify({ story: payload, sendToTelegram: shouldSendToTelegram }) })
        : await api("/api/admin/stories", { method: "POST", body: JSON.stringify({ lang: adminLang, story: payload, sendToTelegram: shouldSendToTelegram }) });
      const newUzk = lang === "uzk" ? (data.stories?.uz || []) : (allStories.uzk || []);
      saveUzkStories(newUzk);
      setAllStories(prev => ({
        ...prev,
        ...data.stories,
        uzk: newUzk,
      }));
      if (form.isHero) {
        const savedId = editingId || (data.stories?.[adminLang]?.[0]?.id);
        if (savedId) setPinnedHeroId(savedId);
      }
      resetForm();
      setActiveTab("list");
      localStorage.removeItem(`yk-draft-${editingId || 'new'}`);
      notify(editingId ? "✓ Maqola yangilandi." : "✓ Yangi maqola qo'shildi.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  // Home Config save
  async function saveHomeConfig(e) {
    if (e && e.preventDefault) e.preventDefault();
    try {
      await saveConfig({
        ...siteConfig,
        siteName: homeConfig.siteName,
        tagline: homeConfig.tagline,
        logoUrl: homeConfig.logoUrl,
        footerLogoUrl: homeConfig.footerLogoUrl || "",
        phone: homeConfig.phone,
        email: homeConfig.email,
        address: homeConfig.address,
        telegram: homeConfig.telegram,
        facebook: homeConfig.facebook,
        instagram: homeConfig.instagram,
        youtube: homeConfig.youtube,
        googleAnalyticsId: homeConfig.googleAnalyticsId,
        yandexMetrikaId: homeConfig.yandexMetrikaId,
        telegramBotToken: homeConfig.telegramBotToken,
        telegramChatId: homeConfig.telegramChatId,
        descriptionUz: homeConfig.descriptionUz,
        descriptionRu: homeConfig.descriptionRu,
        descriptionUzk: homeConfig.descriptionUzk,
        keywords: homeConfig.keywords,
        brandColor: homeConfig.brandColor,
        bannerText: homeConfig.bannerText,
        bannerActive: homeConfig.bannerActive,
        maintenanceMode: homeConfig.maintenanceMode,
        visitorStatsActive: homeConfig.visitorStatsActive,
        langUzActive: homeConfig.langUzActive,
        langUzkActive: homeConfig.langUzkActive,
        langRuActive: homeConfig.langRuActive
      });
      if (homeConfig.brandColor) {
        document.documentElement.style.setProperty("--brand", homeConfig.brandColor);
      }
      notify("✓ Sozlamalar saqlandi", "success");
    } catch (e) {
      notify("Xato: " + e.message, "error");
    }
  }

  function editStory(story) {
    setEditingId(story.id);
    let category = story.category;
    let subcategory = story.subcategory || "";
    if (lang === "uzk") {
      const uzCats = siteConfig.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"];
      const uzkCats = siteConfig.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"];
      const idx = uzkCats.indexOf(story.category);
      if (idx > -1 && uzCats[idx]) {
        category = uzCats[idx];
        const parentCyr = story.category;
        const subsCyr = siteConfig?.subcategoriesUzk?.[parentCyr] || [];
        const subIdx = subsCyr.indexOf(story.subcategory);
        if (subIdx > -1) {
          const subsUz = siteConfig?.subcategoriesUz?.[category] || [];
          if (subsUz[subIdx]) {
            subcategory = subsUz[subIdx];
          }
        }
      }
    }
    setForm({ ...emptyStory, ...story, category, subcategory });
    setActiveTab("editor");
    notify("Tahrirlash rejimi yoqildi.", "info");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteStory(id) {
    if (!confirm("Maqolani o'chirishni tasdiqlaysizmi?")) return;
    try {
      const data = await api(`/api/admin/stories/${adminLang}/${id}`, { method: "DELETE" });
      const newUzk = lang === "uzk" ? (data.stories?.uz || []) : (allStories.uzk || []);
      saveUzkStories(newUzk);
      setAllStories(prev => ({ ...prev, ...data.stories, uzk: newUzk }));
      if (editingId === id) resetForm();
      notify("Maqola o'chirildi.", "info");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function changeStatus(story, status) {
    try {
      const data = await api(`/api/admin/stories/${adminLang}/${story.id}`, {
        method: "PUT",
        body: JSON.stringify({ story: { ...story, status } }),
      });
      const newUzk = lang === "uzk" ? (data.stories?.uz || []) : (allStories.uzk || []);
      saveUzkStories(newUzk);
      setAllStories(prev => ({ ...prev, ...data.stories, uzk: newUzk }));
      notify(status === "published" ? "✓ Maqola chop etildi." : "Qoralamaga o'tkazildi.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    if (newPassword.trim().length < 6) {
      notify("Parol kamida 6 ta belgidan iborat bo'lsin.", "error");
      return;
    }
    try {
      await api("/api/admin/password", { method: "POST", body: JSON.stringify({ password: newPassword.trim() }) });
      setNewPassword("");
      notify("✓ Parol yangilandi.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  async function resetContent() {
    if (!confirm("Demo maqolalar tiklanadi. Davom etamizmi?")) return;
    try {
      const data = await api("/api/admin/reset", { method: "POST", body: "{}" });
      setAllStories(prev => ({ ...prev, ...data.stories, uzk: data.stories.uz || prev.uzk || [] }));
      resetForm();
      notify("✓ Demo maqolalar tiklandi.", "success");
    } catch (error) {
      notify(error.message, "error");
    }
  }

  // --- 🆕 NEW CRUD OPERATIONS ---
  // Videos CRUD
  async function saveVideo(e) {
    e.preventDefault();
    if (!videoForm.title.trim()) return notify("Video sarlavhasi shart", "error");
    try {
      if (editingVideoId) {
        await api(`/api/admin/videos/${editingVideoId}`, { method: "PUT", body: JSON.stringify(videoForm) });
        notify("✓ Video yangilandi", "success");
      } else {
        await api("/api/admin/videos", { method: "POST", body: JSON.stringify(videoForm) });
        notify("✓ Yangi video qo'shildi", "success");
      }
      setVideoForm(EMPTY_VIDEO);
      setEditingVideoId(null);
      loadAllAdminCollections();
      if (refreshPublicVideos) refreshPublicVideos();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deleteVideo(id) {
    if (!confirm("Ushbu videoni o'chirasizmi?")) return;
    try {
      await api(`/api/admin/videos/${id}`, { method: "DELETE" });
      notify("✓ O'chirildi", "success");
      loadAllAdminCollections();
      if (refreshPublicVideos) refreshPublicVideos();
    } catch (e) { notify(e.message, "error"); }
  }

  async function uploadVideoThumbnail(file) {
    if (!file) return;
    try {
      notify("⏳ Rasm yuklanmoqda...", "info");
      const compressedDataUrl = await compressImage(file);
      if (!compressedDataUrl) return;
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/admin/upload", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl: compressedDataUrl }),
      });
      const data = await res.json();
      if (data.url) {
        setVideoForm(prev => ({ ...prev, image: data.url }));
        await loadMedia();
        notify("✓ Rasm yuklandi.", "success");
      } else {
        notify(data.error || "Xatolik", "error");
      }
    } catch (e) {
      console.error("Video thumbnail upload failed", e);
      notify("Yuklashda xatolik", "error");
    }
  }

  // Photos CRUD
  async function savePhoto(e) {
    e.preventDefault();
    if (!photoForm.title.trim()) return notify("Foto sarlavhasi shart", "error");
    try {
      if (editingPhotoId) {
        await api(`/api/admin/photos/${editingPhotoId}`, { method: "PUT", body: JSON.stringify(photoForm) });
        notify("✓ Foto maqola yangilandi", "success");
      } else {
        await api("/api/admin/photos", { method: "POST", body: JSON.stringify(photoForm) });
        notify("✓ Yangi foto maqola qo'shildi", "success");
      }
      setPhotoForm(EMPTY_PHOTO);
      setEditingPhotoId(null);
      loadAllAdminCollections();
      if (refreshPublicPhotos) refreshPublicPhotos();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deletePhoto(id) {
    if (!confirm("Ushbu foto maqolani o'chirasizmi?")) return;
    try {
      await api(`/api/admin/photos/${id}`, { method: "DELETE" });
      notify("✓ O'chirildi", "success");
      loadAllAdminCollections();
      if (refreshPublicPhotos) refreshPublicPhotos();
    } catch (e) { notify(e.message, "error"); }
  }

  async function uploadPhotoCover(file) {
    if (!file) return;
    try {
      notify("⏳ Rasm yuklanmoqda...", "info");
      const compressedDataUrl = await compressImage(file);
      if (!compressedDataUrl) return;
      const res = await fetch((import.meta.env.VITE_API_URL || "") + "/api/admin/upload", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl: compressedDataUrl }),
      });
      const data = await res.json();
      if (data.url) {
        setPhotoForm(prev => ({ ...prev, image: data.url }));
        await loadMedia();
        notify("✓ Rasm yuklandi.", "success");
      } else {
        notify(data.error || "Xatolik", "error");
      }
    } catch (e) {
      console.error("Photo cover upload failed", e);
      notify("Yuklashda xatolik", "error");
    }
  }

  // Quotes CRUD
  async function saveQuote(e) {
    e.preventDefault();
    if (!quoteForm.text.trim()) return notify("Iqtibos matni shart", "error");
    try {
      if (editingQuoteId) {
        await api(`/api/admin/quotes/${editingQuoteId}`, { method: "PUT", body: JSON.stringify(quoteForm) });
        notify("✓ Iqtibos yangilandi", "success");
      } else {
        await api("/api/admin/quotes", { method: "POST", body: JSON.stringify(quoteForm) });
        notify("✓ Yangi iqtibos qo'shildi", "success");
      }
      setQuoteForm(EMPTY_QUOTE);
      setEditingQuoteId(null);
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deleteQuote(id) {
    if (!confirm("Ushbu iqtibosni o'chirasizmi?")) return;
    try {
      await api(`/api/admin/quotes/${id}`, { method: "DELETE" });
      notify("✓ O'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Journals CRUD
  async function saveJournal(e) {
    e.preventDefault();
    if (!journalForm.title.trim()) return notify("Jurnal nomi shart", "error");
    try {
      if (editingJournalId) {
        await api(`/api/admin/journals/${editingJournalId}`, { method: "PUT", body: JSON.stringify(journalForm) });
        notify("✓ Jurnal yangilandi", "success");
      } else {
        await api("/api/admin/journals", { method: "POST", body: JSON.stringify(journalForm) });
        notify("✓ Yangi jurnal qo'shildi", "success");
      }
      setJournalForm(EMPTY_JOURNAL);
      setEditingJournalId(null);
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deleteJournal(id) {
    if (!confirm("Ushbu jurnal sonini o'chirasizmi?")) return;
    try {
      await api(`/api/admin/journals/${id}`, { method: "DELETE" });
      notify("✓ Jurnal o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Authors CRUD
  async function saveAuthor(e) {
    e.preventDefault();
    if (!authorForm.name.trim()) return notify("Muallif ismi shart", "error");
    try {
      if (editingAuthorId) {
        await api(`/api/admin/authors/${editingAuthorId}`, { method: "PUT", body: JSON.stringify(authorForm) });
        notify("✓ Muallif ma'lumoti yangilandi", "success");
      } else {
        await api("/api/admin/authors", { method: "POST", body: JSON.stringify(authorForm) });
        notify("✓ Yangi muallif qo'shildi", "success");
      }
      setAuthorForm(EMPTY_AUTHOR);
      setEditingAuthorId(null);
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deleteAuthor(id) {
    if (!confirm("Ushbu muallifni o'chirasizmi?")) return;
    try {
      await api(`/api/admin/authors/${id}`, { method: "DELETE" });
      notify("✓ Muallif o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Pages CRUD
  async function savePage(e) {
    e.preventDefault();
    if (!pageForm.title.trim()) return notify("Sahifa sarlavhasi shart", "error");
    if (!pageForm.slug.trim()) return notify("Sahifa slugi shart", "error");
    try {
      if (editingPageId) {
        await api(`/api/admin/pages/${editingPageId}`, { method: "PUT", body: JSON.stringify(pageForm) });
        notify("✓ Sahifa yangilandi", "success");
      } else {
        await api("/api/admin/pages", { method: "POST", body: JSON.stringify(pageForm) });
        notify("✓ Yangi sahifa qo'shildi", "success");
      }
      setPageForm(EMPTY_PAGE);
      setEditingPageId(null);
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deletePage(id) {
    if (!confirm("Ushbu sahifani o'chirasizmi?")) return;
    try {
      await api(`/api/admin/pages/${id}`, { method: "DELETE" });
      notify("✓ Sahifa o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Comments moderation
  async function approveComment(comment) {
    try {
      await api(`/api/admin/comments/${comment.id}`, { method: "PUT", body: JSON.stringify({ ...comment, status: "approved" }) });
      notify("✓ Izoh tasdiqlandi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function rejectComment(comment) {
    try {
      await api(`/api/admin/comments/${comment.id}`, { method: "PUT", body: JSON.stringify({ ...comment, status: "rejected" }) });
      notify("Izoh rad etildi", "info");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  async function deleteComment(id) {
    if (!confirm("Izohni o'chirasizmi?")) return;
    try {
      await api(`/api/admin/comments/${id}`, { method: "DELETE" });
      notify("✓ Izoh o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Messages management
  async function markMessageRead(msg) {
    try {
      await api(`/api/admin/messages/${msg.id}`, { method: "PUT", body: JSON.stringify({ ...msg, isRead: true }) });
      loadAllAdminCollections();
    } catch (e) {}
  }

  async function deleteMessage(id) {
    if (!confirm("Xabarni o'chirasizmi?")) return;
    try {
      await api(`/api/admin/messages/${id}`, { method: "DELETE" });
      notify("✓ Xabar o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Newsletter sending
  async function sendNewsletter(e) {
    e.preventDefault();
    if (!newsletterForm.subject.trim() || !newsletterForm.body.trim()) {
      return notify("Mavzu va matn shart", "error");
    }
    notify("⏳ Xabar yuborilmoqda...", "info");
    try {
      const data = await api("/api/admin/newsletter/send", { method: "POST", body: JSON.stringify(newsletterForm) });
      notify(`✓ Ommaviy xat muvaffaqiyatli yuborildi! Jami ${data.sentCount} ta qabul qiluvchi.`, "success");
      setNewsletterForm(EMPTY_NEWSLETTER);
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Subscribers management
  async function deleteSubscriber(id) {
    if (!confirm("Ushbu emailni obuna ro'yxatidan o'chirasizmi?")) return;
    try {
      await api(`/api/admin/subscribers/${id}`, { method: "DELETE" });
      notify("✓ Obunachi o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }

  // Payments management
  async function deletePayment(id) {
    if (!confirm("To'lov logini o'chirasizmi?")) return;
    try {
      await api(`/api/admin/payments/${id}`, { method: "DELETE" });
      notify("✓ To'lov logi o'chirildi", "success");
      loadAllAdminCollections();
    } catch (e) { notify(e.message, "error"); }
  }



  // Security update password and PIN functions
  async function updatePassword(e) {
    e.preventDefault();
    if (newPassword.trim().length < 6) {
      notify("Yangi parol kamida 6 ta belgidan iborat bo'lsin.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      notify("Yangi parollar mos kelmadi.", "error");
      return;
    }
    try {
      await api("/api/admin/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, password: newPassword.trim() })
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      notify("✓ Parol muvaffaqiyatli yangilandi.", "success");
    } catch (e) {
      notify("Xato: " + e.message, "error");
    }
  }

  async function updatePin(e) {
    e.preventDefault();
    if (newPin.length !== 4 || isNaN(newPin)) {
      notify("PIN-kod 4 ta raqamdan iborat bo'lishi kerak.", "error");
      return;
    }
    try {
      await api("/api/admin/pin", {
        method: "POST",
        body: JSON.stringify({ currentPin, newPin })
      });
      setCurrentPin("");
      setNewPin("");
      notify("✓ PIN-kod muvaffaqiyatli yangilandi.", "success");
    } catch (e) {
      notify("Xato: " + e.message, "error");
    }
  }

  async function toggleMaintenanceMode(checked) {
    setHomeConfig(p => ({ ...p, maintenanceMode: checked }));
    try {
      await saveConfig({ ...siteConfig, maintenanceMode: checked });
      notify(checked ? "✓ Ta'mirlash rejimi yoqildi" : "✓ Ta'mirlash rejimi o'chirildi", "success");
    } catch (e) {
      notify("Xato: " + e.message, "error");
    }
  }

  // Helper to parse categories with subcategories in parentheses
  function parseCategoriesWithSubs(text) {
    const parts = [];
    let current = "";
    let inParens = false;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === "(") inParens = true;
      if (char === ")") inParens = false;
      if (char === "," && !inParens) {
        parts.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    if (current.trim()) {
      parts.push(current.trim());
    }

    const categories = [];
    const subcategories = {};

    parts.forEach(part => {
      const match = part.match(/^([^(]+)(?:\(([^)]+)\))?$/);
      if (!match) {
        const name = part.trim();
        if (name) {
          categories.push(name);
          subcategories[name] = [];
        }
        return;
      }
      const name = match[1].trim();
      if (!name) return;
      const subsStr = match[2];
      const subs = subsStr ? subsStr.split(",").map(s => s.trim()).filter(Boolean) : [];
      categories.push(name);
      subcategories[name] = subs;
    });

    return { categories, subcategories };
  }

  // Categories config save
  const [categoriesFormText, setCategoriesFormText] = useState({
    uz: "",
    ru: "",
    uzk: ""
  });

  const [visualCategories, setVisualCategories] = useState([]);

  useEffect(() => {
    if (siteConfig) {
      const buildText = (cats = [], subMap = {}) => {
        return cats.map(cat => {
          const subs = subMap[cat];
          if (subs && subs.length > 0) {
            return `${cat} (${subs.join(", ")})`;
          }
          return cat;
        }).join(", ");
      };

      setCategoriesFormText({
        uz: buildText(siteConfig.categoriesUz, siteConfig.subcategoriesUz),
        ru: buildText(siteConfig.categoriesRu, siteConfig.subcategoriesRu),
        uzk: buildText(siteConfig.categoriesUzk, siteConfig.subcategoriesUzk)
      });

      // Populate visual categories
      const catsUz = siteConfig.categoriesUz || [];
      const catsRu = siteConfig.categoriesRu || [];
      const catsUzk = siteConfig.categoriesUzk || [];
      
      const subMapUz = siteConfig.subcategoriesUz || {};
      const subMapRu = siteConfig.subcategoriesRu || {};
      const subMapUzk = siteConfig.subcategoriesUzk || {};
      
      const newVisual = catsUz.map((catUz, idx) => {
        const catRu = catsRu[idx] || catUz;
        const catUzk = catsUzk[idx] || catUz;
        
        const subsUz = subMapUz[catUz] || [];
        const subsRu = subMapRu[catRu] || [];
        const subsUzk = subMapUzk[catUzk] || [];
        
        const maxSubLen = Math.max(subsUz.length, subsRu.length, subsUzk.length);
        const subcategories = [];
        for (let i = 0; i < maxSubLen; i++) {
          subcategories.push({
            uz: subsUz[i] || "",
            ru: subsRu[i] || "",
            uzk: subsUzk[i] || ""
          });
        }
        
        return {
          uz: catUz,
          ru: catRu,
          uzk: catUzk,
          subcategories
        };
      });
      
      setVisualCategories(newVisual);
    }
  }, [siteConfig, activeTab]);

  async function saveCategoriesConfig(e) {
    e.preventDefault();
    const parsedUz = parseCategoriesWithSubs(categoriesFormText.uz);
    const parsedRu = parseCategoriesWithSubs(categoriesFormText.ru);
    const parsedUzk = parseCategoriesWithSubs(categoriesFormText.uzk);

    if (!parsedUz.categories.length || !parsedRu.categories.length) {
      return notify("Kamida bitta kategoriya kiritish shart", "error");
    }
    try {
      await saveConfig({
        ...siteConfig,
        categoriesUz: parsedUz.categories,
        categoriesRu: parsedRu.categories,
        categoriesUzk: parsedUzk.categories,
        subcategoriesUz: parsedUz.subcategories,
        subcategoriesRu: parsedRu.subcategories,
        subcategoriesUzk: parsedUzk.subcategories
      });
    } catch (e) {
      notify("Xato: " + e.message, "error");
    }
  }

  // Visual Category Manager Helpers
  function addVisualCategory() {
    setVisualCategories(prev => [
      ...prev,
      { uz: "", ru: "", uzk: "", subcategories: [] }
    ]);
  }

  function removeVisualCategory(index) {
    setVisualCategories(prev => prev.filter((_, i) => i !== index));
  }

  function updateVisualCategory(index, field, value) {
    setVisualCategories(prev => prev.map((c, i) => i === index ? { ...c, [field]: value } : c));
  }

  function moveVisualCategory(index, direction) {
    setVisualCategories(prev => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[nextIndex];
      copy[nextIndex] = temp;
      return copy;
    });
  }

  function addVisualSubcategory(catIndex) {
    setVisualCategories(prev => prev.map((c, idx) => {
      if (idx !== catIndex) return c;
      return {
        ...c,
        subcategories: [...c.subcategories, { uz: "", ru: "", uzk: "" }]
      };
    }));
  }

  function removeVisualSubcategory(catIndex, subIndex) {
    setVisualCategories(prev => prev.map((c, idx) => {
      if (idx !== catIndex) return c;
      return {
        ...c,
        subcategories: c.subcategories.filter((_, sIdx) => sIdx !== subIndex)
      };
    }));
  }

  function updateVisualSubcategory(catIndex, subIndex, field, value) {
    setVisualCategories(prev => prev.map((c, idx) => {
      if (idx !== catIndex) return c;
      const newSubs = c.subcategories.map((s, sIdx) => sIdx === subIndex ? { ...s, [field]: value } : s);
      return {
        ...c,
        subcategories: newSubs
      };
    }));
  }

  async function saveVisualCategoriesConfig(e) {
    if (e && e.preventDefault) e.preventDefault();
    
    // Filter and sanitize visual categories with smart fallback and conversion
    const filteredVisual = visualCategories.map(c => {
      let uz = c.uz.trim();
      let uzk = c.uzk.trim();
      let ru = c.ru.trim();
      
      if (!uz && uzk) {
        uz = convertText(uzk, false);
      }
      if (!uzk && uz) {
        uzk = convertText(uz, true);
      }
      if (!ru) {
        ru = uz;
      }
      
      const subcategories = c.subcategories.map(s => {
        let subUz = s.uz.trim();
        let subUzk = s.uzk.trim();
        let subRu = s.ru.trim();
        
        if (!subUz && subUzk) {
          subUz = convertText(subUzk, false);
        }
        if (!subUzk && subUz) {
          subUzk = convertText(subUz, true);
        }
        if (!subRu) {
          subRu = subUz;
        }
        
        return {
          uz: subUz,
          uzk: subUzk,
          ru: subRu
        };
      }).filter(s => s.uz !== "");

      return {
        uz,
        uzk,
        ru,
        subcategories
      };
    }).filter(c => c.uz !== "");

    if (filteredVisual.length === 0) {
      return notify("Kamida bitta rukn bo'lishi shart", "error");
    }

    const categoriesUz = filteredVisual.map(c => c.uz);
    const categoriesRu = filteredVisual.map(c => c.ru);
    const categoriesUzk = filteredVisual.map(c => c.uzk);

    const subcategoriesUz = {};
    const subcategoriesRu = {};
    const subcategoriesUzk = {};

    filteredVisual.forEach(c => {
      subcategoriesUz[c.uz] = c.subcategories.map(s => s.uz);
      subcategoriesRu[c.ru] = c.subcategories.map(s => s.ru);
      subcategoriesUzk[c.uzk] = c.subcategories.map(s => s.uzk);
    });

    try {
      await saveConfig({
        ...siteConfig,
        categoriesUz,
        categoriesRu,
        categoriesUzk,
        subcategoriesUz,
        subcategoriesRu,
        subcategoriesUzk
      });
      notify("✓ Ruknlar muvaffaqiyatli saqlandi", "success");
    } catch (err) {
      notify("Xato: " + err.message, "error");
    }
  }

  const published = stories.filter(s => s.status === "published").length;
  const drafts = stories.filter(s => s.status === "draft").length;
  const uzTotal = allStories ? (allStories.uz || []).length : 0;
  const uzkTotal = allStories ? (allStories.uzk || []).length : 0;

  const filteredStories = stories
    .filter(s => {
      const matchCat = filterCat === "all" || s.category === filterCat;
      const matchStatus = filterStatus === "all" || s.status === filterStatus;
      const matchQ = !searchQ || `${s.title} ${s.summary} ${s.category}`.toLowerCase().includes(searchQ.toLowerCase());
      return matchCat && matchStatus && matchQ;
    })
    .sort((a, b) => sortOrder === "newest" ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id));

  const topStories = [...stories].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
  // Translate menu labels dynamically
  const menuLabels = {
    uz: {
      stats: "Boshqaruv paneli",
      quotes: "Iqtiboslar",
      featured: "Muhim maqolalar",
      list: "Maqolalar ro'yxati",
      news: "Tezkor xabarlar",
      editor: "Yangi maqola",
      categories: "Ruknlar",
      journals: "Jurnal sonlari",
      messages: "Foydalanuvchilar xatlari",
      comments: "Maqola izohlari",
      tags: "Teglar",
      pages: "Statik sahifalar",
      media: "Media kutubxonasi",
      authors: "Mualliflar",
      subscribers: "Obunachilar",
      newsletter: "Ommaviy xat",
      payments: "Xayriya va to'lovlar",
      videos: "Video gallereyasi",
      photos: "Foto gallereyasi",
      seo: "SEO Nazoratchi",
      settings: "Tizim sozlamalari"
    },
    uzk: {
      stats: "Бошқарув панели",
      quotes: "Иқтибослар",
      featured: "Муҳим мақолалар",
      list: "Мақолалар рўйхати",
      news: "Тезкор хабарлар",
      editor: "Янги мақола",
      categories: "Рукнлар",
      journals: "Журнал сонлари",
      messages: "Фойдаланувчилар хатлари",
      comments: "Мақола изоҳлари",
      tags: "Теглар",
      pages: "Статик саҳифалар",
      media: "Медиа кутубхонаси",
      authors: "Муаллифлар",
      subscribers: "Обуначилар",
      newsletter: "Оммавий хат",
      payments: "Хайрия ва тўловлар",
      videos: "Видео галереяси",
      photos: "Фото галереяси",
      seo: "SEO Назоратчи",
      settings: "Тизим созламалари"
    },
    ru: {
      stats: "Панель управления",
      quotes: "Цитаты",
      featured: "Важные статьи",
      list: "Список статей",
      news: "Бегущая строка",
      editor: "Новая статья",
      categories: "Рубрики",
      journals: "Выпуски журнала",
      messages: "Письма пользователей",
      comments: "Комментарии",
      tags: "Теги",
      pages: "Статические страницы",
      media: "Медиатека",
      authors: "Авторы",
      subscribers: "Подписчики",
      newsletter: "Рассылка писем",
      payments: "Пожертвования и платежи",
      videos: "Видеогалерея",
      photos: "Фотогалерея",
      seo: "SEO Инспектор",
      settings: "Настройки системы"
    }
  };

  const labels = menuLabels[lang] || menuLabels.uz;

  const menuIcons = {
    stats: "📊",
    quotes: "💬",
    featured: "⭐",
    list: "📋",
    news: "⚡",
    editor: "✏️",
    categories: "📁",
    journals: "📚",
    messages: "✉️",
    comments: "💬",
    tags: "🏷️",
    pages: "📄",
    media: "🖼️",
    authors: "✍️",
    subscribers: "👥",
    newsletter: "📧",
    payments: "💳",
    videos: "🎥",
    photos: "📸",
    seo: "🔍",
    settings: "⚙️"
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner" />
        <p>Sessiya tekshirilmoqda...</p>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="admin-login-wrap">
        <div className="admin-login-box">
          <div className="admin-login-logo">
            <Logo height={42} />
            <div>
              <strong>Ishonch.uz CMS</strong>
              <span>Boshqaruv paneli</span>
            </div>
          </div>
          <form onSubmit={login}>
            <h2>Tizimga kirish</h2>
            <p>Maqolalarni boshqarish uchun admin parolni kiriting.</p>
            <div className="admin-input-group">
              <span className="admin-input-icon">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Parolni kiriting..."
                autoFocus
              />
            </div>
            <button className="admin-login-btn" type="submit">Kirish →</button>
            {message && <div className={`admin-notify ${msgType}`}>{message}</div>}
          </form>
          <p className="admin-login-hint">Standart parol: <code>admin2026</code></p>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-wrap">
      {message && <div className={`adm-toast ${msgType}`}>{message}</div>}

      <aside className="adm-sidebar" style={{overflowY: "auto", maxHeight: "100vh"}}>
        <div className="adm-sidebar-logo">
          <Logo height={32} />
          <div>
            <strong>Ishonch.uz</strong>
            <span>CMS Panel</span>
          </div>
        </div>

        <div className="adm-lang-switch">
          <button className={lang === "uzk" ? "active" : ""} onClick={() => setLang("uzk")}>
            🇺🇿 {"\u040e\u0417"} <span>{uzkTotal}</span>
          </button>
        </div>

        <nav className="adm-nav" style={{display: "flex", flexDirection: "column", gap: "2px"}}>
          {Object.keys(labels).map((tabKey) => (
            <button
              key={tabKey}
              className={activeTab === tabKey ? "active" : ""}
              onClick={() => setActiveTab(tabKey)}
              style={{display: "flex", alignItems: "center", width: "100%", textAlign: "left"}}
            >
              <span style={{marginRight: "8px"}}>{menuIcons[tabKey]}</span> {labels[tabKey]}
              {tabKey === "list" && <span className="adm-nav-count">{stories.length}</span>}
              {tabKey === "media" && mediaFiles.length > 0 && <span className="adm-nav-count">{mediaFiles.length}</span>}
              {tabKey === "messages" && messagesList.filter(m => !m.isRead).length > 0 && (
                <span className="adm-nav-count" style={{background: "var(--brand)"}}>{messagesList.filter(m => !m.isRead).length}</span>
              )}
              {tabKey === "comments" && comments.filter(c => c.status === "pending").length > 0 && (
                <span className="adm-nav-count" style={{background: "var(--gold)", color: "#000"}}>{comments.filter(c => c.status === "pending").length}</span>
              )}
              {tabKey === "subscribers" && subscribers.length > 0 && <span className="adm-nav-count">{subscribers.length}</span>}
              {tabKey === "videos" && videosAdminList.length > 0 && <span className="adm-nav-count">{videosAdminList.length}</span>}
              {tabKey === "photos" && photosAdminList.length > 0 && <span className="adm-nav-count">{photosAdminList.length}</span>}
            </button>
          ))}
        </nav>

        <div className="adm-sidebar-stats">
          <div className="adm-stat-item">
            <strong>{stories.length}</strong>
            <span>Jami</span>
          </div>
          <div className="adm-stat-item published">
            <strong>{published}</strong>
            <span>Chop etilgan</span>
          </div>
        </div>
        <button className="adm-logout" onClick={logout}>← Chiqish</button>
      </aside>

      <main className="adm-main" style={{padding: "20px", overflowY: "auto", flex: 1}}>
        <header className="adm-header">
          <div>
            <h1>{labels[activeTab]}</h1>
            <p>Til: <strong>{lang.toUpperCase()}</strong> · Barcha o'zgarishlar server bazasida saqlanadi</p>
          </div>
          <div className="adm-header-actions">
            {activeTab === "list" && (
              <>
                <button className="adm-btn ghost" onClick={() => {
                  const data = { exportedAt: new Date().toISOString(), stories: allStories };
                  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url;
                  a.download = `ishonch_uz-backup-${new Date().toISOString().split('T')[0]}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                  notify("📤 Eksport yuklandi", "success");
                }}>📤 Eksport</button>
                <button className="adm-btn ghost" onClick={() => importFileRef.current?.click()}>📥 Import</button>
                <input type="file" ref={importFileRef} accept=".json" style={{display:"none"}} onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    if (data.stories) {
                      if (confirm(`📥 ${file.name} dan ${Object.values(data.stories).flat().length} ta maqola yuklansinmi?`)) {
                        setAllStories(data.stories);
                        notify("📥 Import muvaffaqiyatli", "success");
                      }
                    }
                  } catch(err) {
                    notify("❌ Xato: Fayl noto'g'ri format", "error");
                  }
                  e.target.value = '';
                }} />
                <button className="adm-btn ghost" onClick={resetContent}>↺ Demo tiklash</button>
                <button className="adm-btn primary" onClick={() => { resetForm(); setActiveTab("editor"); }}>+ Yangi maqola</button>
              </>
            )}
            {activeTab === "editor" && (
              <>
                <button className="adm-btn ghost" type="button" onClick={() => { resetForm(); setActiveTab("list"); }}>← Ortga</button>
                <button className="adm-btn ghost" type="button" onClick={undo} disabled={historyIndex <= 0} title="Ctrl+Z">↩️ Undo</button>
                <button className="adm-btn ghost" type="button" onClick={redo} disabled={historyIndex >= formHistory.length - 1} title="Ctrl+Y">↪️ Redo</button>
                <button className="adm-btn primary" type="submit" form="story-form">{editingId ? "✓ Yangilash" : "+ Qo'shish"}</button>
              </>
            )}
            {activeTab === "media" && (
              <>
                <button className="adm-btn ghost" onClick={() => loadMedia()}>↺ Yangilash</button>
                <button className="adm-btn primary" onClick={() => mediaFileRef.current?.click()}>
                  {mediaUploading ? "⏳ Yuklanmoqda..." : "+ Fayl yuklash"}
                </button>
                <input ref={mediaFileRef} type="file" accept="image/*,video/*" multiple style={{display:"none"}}
                  onChange={e => { Array.from(e.target.files).forEach(f => uploadMediaFile(f)); e.target.value=""; }}
                />
              </>
            )}
          </div>
        </header>

        {/* --- 📊 TAB: STATS --- */}
        {activeTab === "stats" && (
          <div className="adm-dashboard">
            <div className="adm-dash-cards">
              <div className="adm-dash-card blue">
                <span className="adm-dash-icon">📰</span>
                <div>
                  <StatNum value={stories.length} />
                  <span>Maqolalar ({lang.toUpperCase()})</span>
                </div>
              </div>
              <div className="adm-dash-card green">
                <span className="adm-dash-icon">💬</span>
                <div>
                  <StatNum value={comments.filter(c => c.status === "approved").length} />
                  <span>Tasdiqlangan izohlar</span>
                </div>
              </div>
              <div className="adm-dash-card yellow">
                <span className="adm-dash-icon">✉️</span>
                <div>
                  <StatNum value={messagesList.length} />
                  <span>Xabarlar (Aloqa)</span>
                </div>
              </div>
              <div className="adm-dash-card purple">
                <span className="adm-dash-icon">👥</span>
                <div>
                  <StatNum value={subscribers.length} />
                  <span>Newsletter obunachilar</span>
                </div>
              </div>
            </div>

            <div className="adm-dash-grid">
              <div className="adm-dash-section full-width">
                <h3>📈 So'nggi 7 kunlik ko'rishlar trafigi</h3>
                {(() => {
                  const baseViews = stories.reduce((sum, s) => sum + (s.views || 0), 0) || 1250;
                  const lineData = [
                    Math.round(baseViews * 0.45),
                    Math.round(baseViews * 0.52),
                    Math.round(baseViews * 0.68),
                    Math.round(baseViews * 0.61),
                    Math.round(baseViews * 0.79),
                    Math.round(baseViews * 0.92),
                    baseViews
                  ];
                  const maxVal = Math.max(...lineData) || 100;
                  const points = lineData.map((val, i) => {
                    const x = 45 + i * (435 / 6);
                    const y = 160 - (val / maxVal) * 130;
                    return { x, y, val };
                  });
                  const pathD = `M ${points.map(p => `${p.x} ${p.y}`).join(" L ")}`;
                  const areaD = `${pathD} L ${points[6].x} 160 L ${points[0].x} 160 Z`;
                  
                  return (
                    <div className="adm-svg-chart-container">
                      <svg viewBox="0 0 500 200" className="adm-svg-line-chart">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.0"/>
                          </linearGradient>
                        </defs>
                        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                          const y = 160 - p * 130;
                          const valLabel = Math.round(p * maxVal);
                          return (
                            <g key={i}>
                              <line x1="45" y1={y} x2="480" y2={y} stroke="var(--line)" strokeWidth="1" strokeDasharray="3,3" />
                              <text x="35" y={y + 4} fontSize="9" fill="var(--muted)" textAnchor="end">{valLabel}</text>
                            </g>
                          );
                        })}
                        <path d={areaD} fill="url(#chartGrad)" />
                        <path d={pathD} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {points.map((p, i) => (
                          <g key={i} className="chart-dot-group">
                            <circle cx={p.x} cy={p.y} r="5" fill="var(--surface)" stroke="var(--brand)" strokeWidth="2.5" />
                            <circle cx={p.x} cy={p.y} r="8" fill="transparent" style={{cursor:"pointer"}} />
                            <text x={p.x} y={p.y - 10} fontSize="9" fontWeight="700" fill="var(--ink)" textAnchor="middle" className="chart-tooltip-text">{p.val}</text>
                          </g>
                        ))}
                      </svg>
                    </div>
                  );
                })()}
              </div>

              <div className="adm-dash-section">
                <h3>🏆 Eng ko'p o'qilgan maqolalar</h3>
                {stories.some(s => s.views > 0) ? (
                  <table className="adm-table" style={{width:"100%"}}>
                    <thead>
                      <tr><th>Sarlavha</th><th>Rukn</th><th>Ko'rishlar</th></tr>
                    </thead>
                    <tbody>
                      {[...stories].filter(s=>s.views>0).sort((a,b) => (b.views||0)-(a.views||0)).slice(0,5).map((s) => (
                        <tr key={s.id}>
                          <td style={{fontWeight:600}}>{s.title.slice(0, 30)}...</td>
                          <td><span className="adm-item-cat">{s.category}{s.subcategory ? ` › ${s.subcategory}` : ""}</span></td>
                          <td style={{fontWeight:700, color:"var(--brand)"}}>👁 {s.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p style={{color:"var(--muted)", textAlign:"center", padding:"20px"}}>O'qilgan maqolalar yo'q</p>
                )}
              </div>

              <div className="adm-dash-section">
                <h3>💳 Moliyaviy xayriyalar ({payments.length} ta)</h3>
                {payments.length > 0 ? (
                  <div>
                    <h2 style={{color: "var(--brand)", marginBottom: "12px"}}>
                      {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} UZS
                    </h2>
                    <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                      {payments.slice(0, 4).map(p => (
                        <div key={p.id} style={{display:"flex", justifyContent:"space-between", fontSize:12, paddingBottom:6, borderBottom:"1px solid var(--line)"}}>
                          <span><strong>{p.name}</strong> ({p.description})</span>
                          <span style={{fontWeight:700}}>{p.amount.toLocaleString()} {p.currency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{color:"var(--muted)", textAlign:"center", padding:"20px"}}>Hozircha xayriyalar yo'q</p>
                )}
              </div>
            </div>
          </div>
        )}



        {/* --- 💬 TAB: QUOTES --- */}
        {activeTab === "quotes" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 2fr"}}>
            <div className="adm-dash-section">
              <h3>{editingQuoteId ? "Iqtibosni tahrirlash" : "Yangi iqtibos qo'shish"}</h3>
              <form onSubmit={saveQuote} className="adm-form">
                <label>
                  Iqtibos matni
                  <textarea rows="4" value={quoteForm.text} onChange={e => setQuoteForm({...quoteForm, text: e.target.value})} placeholder="Hikmatli so'z yoki iqtibos matni..." required />
                </label>
                <label>
                  Muallif
                  <input value={quoteForm.author} onChange={e => setQuoteForm({...quoteForm, author: e.target.value})} placeholder="Masalan: Alisher Navoiy" required />
                </label>
                <label>
                  Holati
                  <select value={quoteForm.status} onChange={e => setQuoteForm({...quoteForm, status: e.target.value})}>
                    <option value="active">Faol (Saytda ko'rinadi)</option>
                    <option value="inactive">Nofaol</option>
                  </select>
                </label>
                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  <button className="adm-btn primary" type="submit">{editingQuoteId ? "Saqlash" : "Qo'shish"}</button>
                  {editingQuoteId && (
                    <button className="adm-btn ghost" type="button" onClick={() => { setEditingQuoteId(null); setQuoteForm(EMPTY_QUOTE); }}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Barcha iqtiboslar ({quotes.length} ta)</h3>
              <table className="adm-table" style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Iqtibos</th>
                    <th>Muallif</th>
                    <th>Holat</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {quotes.map(q => (
                    <tr key={q.id}>
                      <td>{q.text.slice(0, 60)}...</td>
                      <td><strong>{q.author}</strong></td>
                      <td>
                        <span className={`adm-status ${q.status === 'active' ? 'published' : 'draft'}`}>
                          {q.status === 'active' ? "Faol" : "Nofaol"}
                        </span>
                      </td>
                      <td>
                        <button className="adm-btn ghost" onClick={() => { setEditingQuoteId(q.id); setQuoteForm(q); }} style={{padding: "4px 8px", marginRight: "4px"}}>✏️</button>
                        <button className="adm-btn danger" onClick={() => deleteQuote(q.id)} style={{padding: "4px 8px"}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {quotes.length === 0 && (
                    <tr><td colSpan="4" style={{textAlign:"center", color:"var(--muted)"}}>Hozircha iqtiboslar yo'q</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ⭐ TAB: FEATURED --- */}
        {activeTab === "featured" && (
          <div className="adm-dash-section" style={{maxWidth: "700px"}}>
            <h3>Muhim (qatirilgan) maqolalarni sozlash</h3>
            <p style={{color:"var(--muted)", fontSize:"13px", marginBottom:"20px"}}>
              Bosh sahifaning eng yuqori qismida ko'rsatiladigan bosh maqola (Hero) va yon paneldagi muhim xabarlarni tanlang.
            </p>
            <div className="adm-form">
              <label>
                Asosiy maqola (Hero Story)
                <select value={pinnedHeroId} onChange={e => handleSelectHero(e.target.value)}>
                  <option value="">-- Tizim tomonidan avtomatik tanlash --</option>
                  {stories.map(s => (
                    <option key={s.id} value={s.id}>[{s.category}] {s.title.slice(0, 60)}...</option>
                  ))}
                </select>
              </label>

              <div style={{marginTop: "24px"}}>
                <h4>Yon paneldagi 3 ta muhim maqola</h4>
                <div style={{display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px"}}>
                  {[0, 1, 2].map(index => (
                    <label key={index}>
                      {index + 1}-maqola
                      <select
                        value={pinnedSideIds[index] || ""}
                        onChange={e => {
                          const newList = [...pinnedSideIds];
                          if (e.target.value) newList[index] = e.target.value;
                          else newList.splice(index, 1);
                          handleSelectSide(newList.filter(Boolean));
                        }}
                      >
                        <option value="">-- Avtomatik tanlash --</option>
                        {stories.map(s => (
                          <option key={s.id} value={s.id}>[{s.category}] {s.title.slice(0, 60)}...</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 📁 TAB: CATEGORIES --- */}
        {activeTab === "categories" && (
          <div className="adm-dash-section" style={{maxWidth: "800px"}}>
            <h3>Ruknlar va Kategoriya ostilarini boshqarish</h3>
            <p style={{color: "var(--muted)", fontSize: 13, marginBottom: 20}}>
              Saytdagi barcha ruknlar (kategoriyalar) va ularga tegishli ichki ruknlarni (subkategoriyalarni) vizual tarzda tartiblang, qo'shing yoki o'chiring.
            </p>
            
            <div className="visual-categories-list" style={{display: "flex", flexDirection: "column", gap: "20px"}}>
              {visualCategories.map((cat, catIdx) => (
                <div 
                  key={catIdx} 
                  className="visual-category-card"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--line)",
                    borderRadius: "12px",
                    padding: "20px",
                    position: "relative",
                    boxShadow: "var(--shadow-sm)"
                  }}
                >
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px"}}>
                    <h4 style={{margin: 0, fontSize: "16px", fontWeight: "700", color: "var(--brand)"}}>
                      Rukn #{catIdx + 1}: {cat.uz || "Nomsiz rukn"}
                    </h4>
                    <div style={{display: "flex", gap: "6px"}}>
                      <button 
                        type="button" 
                        className="adm-btn ghost" 
                        disabled={catIdx === 0} 
                        onClick={() => moveVisualCategory(catIdx, -1)}
                        style={{padding: "4px 8px", fontSize: "12px"}}
                        title="Tepaga siljitish"
                      >
                        ↑
                      </button>
                      <button 
                        type="button" 
                        className="adm-btn ghost" 
                        disabled={catIdx === visualCategories.length - 1} 
                        onClick={() => moveVisualCategory(catIdx, 1)}
                        style={{padding: "4px 8px", fontSize: "12px"}}
                        title="Pastga siljitish"
                      >
                        ↓
                      </button>
                      <button 
                        type="button" 
                        className="adm-btn danger" 
                        onClick={() => removeVisualCategory(catIdx)}
                        style={{padding: "4px 8px", fontSize: "12px"}}
                        title="Ruknni o'chirish"
                      >
                        ✕ O'chirish
                      </button>
                    </div>
                  </div>

                  {/* Category Name Inputs (3 languages) */}
                  <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px"}}>
                    <label style={{margin: 0, fontSize: "12px"}}>
                      Rukn nomi (O'zbekcha Lotin) <span style={{color:"red"}}>*</span>
                      <input 
                        value={cat.uz} 
                        onChange={(e) => updateVisualCategory(catIdx, "uz", e.target.value)} 
                        placeholder="Masalan: Siyosat"
                        style={{marginTop: "4px", width: "100%"}}
                      />
                    </label>
                    <label style={{margin: 0, fontSize: "12px"}}>
                      Rukn nomi (Ўзбекча Кирилл)
                      <input 
                        value={cat.uzk} 
                        onChange={(e) => updateVisualCategory(catIdx, "uzk", e.target.value)} 
                        placeholder="Masalan: Сиёсат"
                        style={{marginTop: "4px", width: "100%"}}
                      />
                    </label>
                    <label style={{margin: 0, fontSize: "12px"}}>
                      Rukn nomi (Русский)
                      <input 
                        value={cat.ru} 
                        onChange={(e) => updateVisualCategory(catIdx, "ru", e.target.value)} 
                        placeholder="Masalan: Политика"
                        style={{marginTop: "4px", width: "100%"}}
                      />
                    </label>
                  </div>

                  {/* Subcategories block */}
                  <div style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "8px",
                    padding: "15px",
                    border: "1px dashed var(--line)"
                  }}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px"}}>
                      <span style={{fontSize: "13px", fontWeight: "700", color: "var(--ink)"}}>
                        Rukn ostilari (Subcategories)
                      </span>
                      <button 
                        type="button" 
                        className="adm-btn primary ghost" 
                        onClick={() => addVisualSubcategory(catIdx)}
                        style={{padding: "4px 8px", fontSize: "11px"}}
                      >
                        + Ichki rukn qo'shish
                      </button>
                    </div>

                    {cat.subcategories.length === 0 ? (
                      <p style={{margin: 0, fontSize: "12px", color: "var(--muted)", fontStyle: "italic"}}>
                        Ushbu ruknda hozircha ichki ruknlar yo'q (u menyuda oddiy tugma bo'lib ko'rinadi).
                      </p>
                    ) : (
                      <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                        {cat.subcategories.map((sub, subIdx) => (
                          <div 
                            key={subIdx} 
                            style={{
                              display: "grid", 
                              gridTemplateColumns: "1fr 1fr 1fr auto", 
                              gap: "8px", 
                              alignItems: "center"
                            }}
                          >
                            <input 
                              value={sub.uz} 
                              onChange={(e) => updateVisualSubcategory(catIdx, subIdx, "uz", e.target.value)} 
                              placeholder="Lotincha (Mahalliy)"
                              style={{fontSize: "12px", padding: "6px 8px", width: "100%"}}
                            />
                            <input 
                              value={sub.uzk} 
                              onChange={(e) => updateVisualSubcategory(catIdx, subIdx, "uzk", e.target.value)} 
                              placeholder="Кириллча (Маҳаллий)"
                              style={{fontSize: "12px", padding: "6px 8px", width: "100%"}}
                            />
                            <input 
                              value={sub.ru} 
                              onChange={(e) => updateVisualSubcategory(catIdx, subIdx, "ru", e.target.value)} 
                              placeholder="Русча (Местная)"
                              style={{fontSize: "12px", padding: "6px 8px", width: "100%"}}
                            />
                            <button 
                              type="button" 
                              className="adm-btn danger" 
                              onClick={() => removeVisualSubcategory(catIdx, subIdx)}
                              style={{padding: "6px 10px", fontSize: "12px"}}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px"}}>
              <button 
                type="button" 
                className="adm-btn ghost" 
                onClick={addVisualCategory}
                style={{borderColor: "var(--brand)", color: "var(--brand)"}}
              >
                + Yangi rukn qo'shish
              </button>
              
              <button 
                type="button" 
                className="adm-btn primary" 
                onClick={saveVisualCategoriesConfig}
              >
                Ruknlarni saqlash
              </button>
            </div>
          </div>
        )}

        {/* --- 📚 TAB: JOURNALS --- */}
        {activeTab === "journals" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 2fr"}}>
            <div className="adm-dash-section">
              <h3>{editingJournalId ? "Jurnalni tahrirlash" : "Yangi jurnal qo'shish"}</h3>
              <form onSubmit={saveJournal} className="adm-form">
                <label>
                  Jurnal nomi / Soni
                  <input value={journalForm.title} onChange={e => setJournalForm({...journalForm, title: e.target.value})} placeholder="Masalan: Ishonch 2026 yil 1-son" required />
                </label>
                <label>
                  Muqova rasm URL manzili
                  <input value={journalForm.coverUrl} onChange={e => setJournalForm({...journalForm, coverUrl: e.target.value})} placeholder="https://..." />
                </label>
                <label>
                  PDF fayl URL manzili
                  <input value={journalForm.pdfUrl} onChange={e => setJournalForm({...journalForm, pdfUrl: e.target.value})} placeholder="https://... yoki /uploads/jurnal.pdf" required />
                </label>
                <label>
                  Chop etilgan sana
                  <input type="date" value={journalForm.publishDate} onChange={e => setJournalForm({...journalForm, publishDate: e.target.value})} required />
                </label>
                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  <button className="adm-btn primary" type="submit">{editingJournalId ? "Saqlash" : "Qo'shish"}</button>
                  {editingJournalId && (
                    <button className="adm-btn ghost" type="button" onClick={() => { setEditingJournalId(null); setJournalForm(EMPTY_JOURNAL); }}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Yuklangan jurnallar ({journals.length} ta)</h3>
              <table className="adm-table" style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Muqova</th>
                    <th>Nomi</th>
                    <th>Chop etilgan sana</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {journals.map(j => (
                    <tr key={j.id}>
                      <td>
                        {j.coverUrl ? (
                          <img src={j.coverUrl} alt="" style={{width: "40px", height: "55px", objectFit: "cover", borderRadius: "2px"}} />
                        ) : (
                          <span style={{fontSize: "24px"}}>📘</span>
                        )}
                      </td>
                      <td>
                        <strong>{j.title}</strong>
                        <div style={{fontSize: "11px", color: "var(--muted)"}}>
                          <a href={j.pdfUrl} target="_blank">PDF yuklab olish</a>
                        </div>
                      </td>
                      <td>{j.publishDate}</td>
                      <td>
                        <button className="adm-btn ghost" onClick={() => { setEditingJournalId(j.id); setJournalForm(j); }} style={{padding: "4px 8px", marginRight: "4px"}}>✏️</button>
                        <button className="adm-btn danger" onClick={() => deleteJournal(j.id)} style={{padding: "4px 8px"}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {journals.length === 0 && (
                    <tr><td colSpan="4" style={{textAlign:"center", color:"var(--muted)"}}>Hozircha jurnallar yuklanmagan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ✉️ TAB: MESSAGES --- */}
        {activeTab === "messages" && (
          <div className="adm-dash-section">
            <h3>Foydalanuvchilarning aloqa xatlari ({messagesList.length} ta)</h3>
            <div style={{display: "flex", flexDirection: "column", gap: "15px", marginTop: "15px"}}>
              {messagesList.map(msg => (
                <div key={msg.id} style={{
                  padding: "15px",
                  border: "1px solid var(--line)",
                  borderRadius: "8px",
                  background: msg.isRead ? "var(--surface)" : "rgba(14, 95, 242, 0.05)",
                  position: "relative"
                }}>
                  {!msg.isRead && (
                    <span style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      background: "var(--brand)",
                      color: "white",
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      fontWeight: 700
                    }}>Yangi</span>
                  )}
                  <div style={{fontSize: "13px", color: "var(--muted)", marginBottom: "5px"}}>
                    Sana: <strong>{new Date(msg.createdAt).toLocaleString("uz-UZ")}</strong> |
                    Kimdan: <strong>{msg.name}</strong> ({msg.email})
                  </div>
                  <h4 style={{margin: "5px 0 10px", color: "var(--ink)"}}>Mavzu: {msg.subject || "Mavzusiz"}</h4>
                  <p style={{margin: 0, fontSize: "14px", lineHeight: "1.6", color: "var(--ink)", background: "var(--bg)", padding: "10px", borderRadius: "4px"}}>
                    {msg.message}
                  </p>
                  <div style={{marginTop: "10px", display: "flex", gap: "10px"}}>
                    {!msg.isRead && (
                      <button className="adm-btn primary" onClick={() => markMessageRead(msg)} style={{padding: "6px 12px", fontSize: "12px"}}>✓ O'qilgan deb belgilash</button>
                    )}
                    <button className="adm-btn danger" onClick={() => deleteMessage(msg.id)} style={{padding: "6px 12px", fontSize: "12px"}}>✕ O'chirish</button>
                  </div>
                </div>
              ))}
              {messagesList.length === 0 && (
                <p style={{color: "var(--muted)", textAlign: "center", padding: "40px"}}>Hozircha xabarlar yo'q.</p>
              )}
            </div>
          </div>
        )}

        {/* --- 💬 TAB: COMMENTS --- */}
        {activeTab === "comments" && (
          <div className="adm-dash-section">
            <h3>Izohlarni moderatsiya qilish ({comments.length} ta)</h3>
            <table className="adm-table" style={{width: "100%", marginTop: "15px"}}>
              <thead>
                <tr>
                  <th>Kimdan</th>
                  <th>Izoh matni</th>
                  <th>Maqola</th>
                  <th>Holat</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {comments.map(c => {
                  let statusText = "Kutilmoqda";
                  let statusClass = "draft";
                  if (c.status === "approved") { statusText = "Tasdiqlangan"; statusClass = "published"; }
                  if (c.status === "rejected") { statusText = "Rad etilgan"; statusClass = "gray"; }

                  return (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong><br/><small style={{color:"var(--muted)"}}>{new Date(c.createdAt).toLocaleDateString()}</small></td>
                      <td style={{maxWidth: "250px"}}>{c.text}</td>
                      <td><small>{c.storyId}</small></td>
                      <td>
                        <span className={`adm-status ${statusClass}`}>{statusText}</span>
                      </td>
                      <td>
                        {c.status !== "approved" && (
                          <button className="adm-btn primary" onClick={() => approveComment(c)} style={{padding: "4px 8px", marginRight: "4px", fontSize: "12px"}}>✓ Ruxsat</button>
                        )}
                        {c.status !== "rejected" && (
                          <button className="adm-btn ghost" onClick={() => rejectComment(c)} style={{padding: "4px 8px", marginRight: "4px", fontSize: "12px"}}>✕ Rad etish</button>
                        )}
                        <button className="adm-btn danger" onClick={() => deleteComment(c.id)} style={{padding: "4px 8px", fontSize: "12px"}}>O'chirish</button>
                      </td>
                    </tr>
                  );
                })}
                {comments.length === 0 && (
                  <tr><td colSpan="5" style={{textAlign:"center", color:"var(--muted)", padding:"20px"}}>Hozircha izohlar yo'q</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 🏷️ TAB: TAGS --- */}
        {activeTab === "tags" && (
          <div className="adm-dash-section">
            <h3>Tehlar boshqaruvi</h3>
            <p style={{color: "var(--muted)", fontSize: 13, marginBottom: 15}}>
              Tizimdagi barcha maqolalarga tegishli teglar hamda ulardan foydalanilgan maqolalar soni.
            </p>
            {(() => {
              const tagCounts = {};
              stories.forEach(s => {
                const tagsList = (s.tags || "").split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
                tagsList.forEach(t => {
                  tagCounts[t] = (tagCounts[t] || 0) + 1;
                });
              });
              const tagsArray = Object.keys(tagCounts).sort((a,b) => tagCounts[b] - tagCounts[a]);

              return (
                <div style={{display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "15px"}}>
                  {tagsArray.map(t => (
                    <span key={t} className="chip" style={{fontSize: "14px", padding: "6px 12px", background: "var(--surface)", border: "1px solid var(--line)"}}>
                      🏷️ {t} <strong style={{marginLeft: "5px", color: "var(--brand)"}}>{tagCounts[t]}</strong>
                    </span>
                  ))}
                  {tagsArray.length === 0 && (
                    <p style={{color: "var(--muted)"}}>Hozircha teglar mavjud emas. Maqola yozishda teglar kiriting.</p>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* --- 📄 TAB: PAGES --- */}
        {activeTab === "pages" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 2fr"}}>
            <div className="adm-dash-section">
              <h3>{editingPageId ? "Sahifani tahrirlash" : "Yangi statik sahifa"}</h3>
              <form onSubmit={savePage} className="adm-form">
                <label>
                  Sahifa nomi (Title)
                  <input value={pageForm.title} onChange={e => setPageForm({...pageForm, title: e.target.value})} placeholder="Masalan: Tahririyat haqida" required />
                </label>
                <label>
                  Slug (URL)
                  <input value={pageForm.slug} onChange={e => setPageForm({...pageForm, slug: e.target.value})} placeholder="tahririyat-haqida" required />
                </label>
                <label>
                  Sahifa matni (HTML / Plain text)
                  <textarea rows="8" value={pageForm.body} onChange={e => setPageForm({...pageForm, body: e.target.value})} placeholder="Sahifa kontenti..." required />
                </label>
                <label>
                  Holat
                  <select value={pageForm.status} onChange={e => setPageForm({...pageForm, status: e.target.value})}>
                    <option value="published">Chop etilgan</option>
                    <option value="draft">Qoralama</option>
                  </select>
                </label>
                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  <button className="adm-btn primary" type="submit">{editingPageId ? "Saqlash" : "Yaratish"}</button>
                  {editingPageId && (
                    <button className="adm-btn ghost" type="button" onClick={() => { setEditingPageId(null); setPageForm(EMPTY_PAGE); }}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Tizimdagi statik sahifalar ({pagesList.length} ta)</h3>
              <table className="adm-table" style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Sarlavha</th>
                    <th>URL</th>
                    <th>Holat</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {pagesList.map(pg => (
                    <tr key={pg.id}>
                      <td><strong>{pg.title}</strong></td>
                      <td><code>/pages/{pg.slug}</code></td>
                      <td>
                        <span className={`adm-status ${pg.status === 'published' ? 'published' : 'draft'}`}>
                          {pg.status === 'published' ? "Chop etilgan" : "Qoralama"}
                        </span>
                      </td>
                      <td>
                        <button className="adm-btn ghost" onClick={() => { setEditingPageId(pg.id); setPageForm(pg); }} style={{padding: "4px 8px", marginRight: "4px"}}>✏️</button>
                        <button className="adm-btn danger" onClick={() => deletePage(pg.id)} style={{padding: "4px 8px"}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {pagesList.length === 0 && (
                    <tr><td colSpan="4" style={{textAlign:"center", color:"var(--muted)"}}>Hozircha statik sahifalar yaratilmagan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 🖼️ TAB: MEDIA --- */}
        {activeTab === "media" && (
          <div className="adm-media">
            <div className="adm-media-filters" style={{marginBottom: "15px", display: "flex", gap: "10px"}}>
              <button className={`chip ${mediaFilter === 'all' ? 'active' : ''}`} onClick={() => setMediaFilter('all')}>Hammasi</button>
              <button className={`chip ${mediaFilter === 'image' ? 'active' : ''}`} onClick={() => setMediaFilter('image')}>Rasmlar</button>
              <button className={`chip ${mediaFilter === 'video' ? 'active' : ''}`} onClick={() => setMediaFilter('video')}>Videolar</button>
            </div>
            
            <div className="adm-media-grid" style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "15px"}}>
              {mediaFiles
                .filter(f => mediaFilter === 'all' || f.type === mediaFilter)
                .map(file => (
                  <div key={file.name} style={{border: "1px solid var(--line)", borderRadius: "8px", overflow: "hidden", background: "var(--surface)", position: "relative"}}>
                    {file.type === "image" ? (
                      <img src={file.url} alt="" style={{width: "100%", height: "100px", objectFit: "cover"}} />
                    ) : (
                      <div style={{height: "100px", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", color: "#fff", fontSize: "24px"}}>🎥</div>
                    )}
                    <div style={{padding: "8px", fontSize: "11px"}}>
                      <div style={{fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{file.name}</div>
                      <div style={{color: "var(--muted)", margin: "4px 0"}}>{(file.size / 1024).toFixed(1)} KB</div>
                      <div style={{display: "flex", gap: "5px", marginTop: "5px"}}>
                        <button className="adm-btn ghost" onClick={() => copyUrl(file.url)} style={{flex: 1, padding: "2px", fontSize: "10px"}}>
                          {copiedUrl === file.url ? "✓ Nusxalandi" : "🔗 Link"}
                        </button>
                        <button className="adm-btn danger" onClick={() => deleteMedia(file.name)} style={{padding: "2px 6px", fontSize: "10px"}}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* --- 🎥 TAB: VIDEOS --- */}
        {activeTab === "videos" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 2fr"}}>
            <div className="adm-dash-section">
              <h3>{editingVideoId ? "Videoni tahrirlash" : "Yangi video qo'shish"}</h3>
              <form onSubmit={saveVideo} className="adm-form">
                <label>
                  Sarlavha
                  <input value={videoForm.title} onChange={e => setVideoForm({...videoForm, title: e.target.value})} placeholder="Masalan: Dunyoda nechta AES bor..." required />
                </label>
                <label>
                  Til
                  <select value={videoForm.lang} onChange={e => setVideoForm({...videoForm, lang: e.target.value})} required>
                    <option value="uz">O'zbekcha (Lotin)</option>
                    <option value="uzk">Ўзбекча (Кирилл)</option>
                    <option value="ru">Русский</option>
                  </select>
                </label>
                <label>
                  Rukn / Kategoriya va Vaqt (Meta)
                  <input value={videoForm.meta} onChange={e => setVideoForm({...videoForm, meta: e.target.value})} placeholder="Masalan: Jahon | 09:38" required />
                </label>
                <label>
                  Muqova rasm URL manzili
                  <div style={{display: "flex", gap: "10px"}}>
                    <input style={{flex: 1}} value={videoForm.image} onChange={e => setVideoForm({...videoForm, image: e.target.value})} placeholder="https://..." required />
                    <button className="adm-btn primary" type="button" onClick={() => { loadMedia(); setActiveMediaSelector({ target: 'video' }); }}>🖼️ Tanlash</button>
                    <button className="adm-btn primary" type="button" onClick={() => videoThumbnailRef.current?.click()}>📁 Yuklash</button>
                    <input type="file" accept="image/*" ref={videoThumbnailRef} style={{display: "none"}} onChange={e => { if (e.target.files?.[0]) uploadVideoThumbnail(e.target.files[0]) }} />
                  </div>
                </label>
                <label>
                  Video manzili (YouTube yoki Fayl)
                  <input value={videoForm.url} onChange={e => setVideoForm({...videoForm, url: e.target.value})} placeholder="Masalan: https://www.youtube.com/watch?v=..." required />
                </label>
                <label>
                  Tavsif / Qisqa matn (Summary)
                  <textarea value={videoForm.summary || ""} onChange={e => setVideoForm({...videoForm, summary: e.target.value})} placeholder="Maqola sarlavhasi ostidagi qisqa matn..." style={{width:"100%", height:"60px", padding:"8px", borderRadius:"4px", border:"1px solid var(--line)", background:"var(--surface)", color:"var(--ink)"}} />
                </label>
                <div className="adm-rich-label" data-field="body" style={{marginBottom: "16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,width:"100%"}}>
                    <span style={{fontSize: "14px", fontWeight: "500", color: "var(--ink)"}}>Maqola batafsil matni (Body Text)</span>
                    <div className="translit-btn-group" style={{display:"flex",gap:4}}>
                      <button type="button" className="translit-btn" onClick={() => setVideoForm({...videoForm, body: convertText(videoForm.body || "", true)})}>🔄 Kirill</button>
                      <button type="button" className="translit-btn" onClick={() => setVideoForm({...videoForm, body: convertText(videoForm.body || "", false)})}>🔄 Lotin</button>
                    </div>
                  </div>
                  <RichEditor
                    key={editingVideoId || "new"}
                    value={videoForm.body || ""}
                    onChange={(html) => setVideoForm({...videoForm, body: html})}
                  />
                </div>
                <label>
                  Muallif (Author)
                  <input value={videoForm.author || ""} onChange={e => setVideoForm({...videoForm, author: e.target.value})} placeholder="Masalan: Ishonch.uz tahririyati" />
                </label>

                <div className="adm-seo-section" style={{marginTop: "16px", marginBottom: "16px"}}>
                  <div className="adm-seo-head">
                    <span>🔍 SEO sozlamalari</span>
                  </div>
                  {renderAiSeoAssistantWidget('video')}
                  <label>
                    Teglar
                    <input value={videoForm.tags || ""} onChange={e => setVideoForm({...videoForm, tags: e.target.value})} placeholder="siyosat, iqtisod, yangilik (vergul bilan)" />
                  </label>
                  <label>
                    Meta sarlavha
                    <input value={videoForm.metaTitle || ""} onChange={e => setVideoForm({...videoForm, metaTitle: e.target.value})} placeholder={videoForm.title} />
                  </label>
                  <label>
                    Meta tavsif
                    <textarea rows="2" value={videoForm.metaDesc || ""} onChange={e => setVideoForm({...videoForm, metaDesc: e.target.value})} placeholder={videoForm.summary} />
                  </label>
                  {renderLiveSeoWidget(videoForm, 'video')}
                </div>

                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  <button className="adm-btn primary" type="submit">{editingVideoId ? "Saqlash" : "Qo'shish"}</button>
                  {editingVideoId && (
                    <button className="adm-btn ghost" type="button" onClick={() => { setEditingVideoId(null); setVideoForm(EMPTY_VIDEO); }}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Yuklangan videolar ({videosAdminList.length} ta)</h3>
              <table className="adm-table" style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Rasm</th>
                    <th>Sarlavha</th>
                    <th>Til</th>
                    <th>Meta</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {videosAdminList.map(v => (
                    <tr key={v.id}>
                      <td>
                        {v.image ? (
                          <img src={v.image} alt="" style={{width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px"}} />
                        ) : (
                          <span>🎥</span>
                        )}
                      </td>
                      <td>
                        <strong>{v.title}</strong>
                        <div style={{fontSize: "11px", color: "var(--muted)"}}>
                          <a href={v.url} target="_blank" rel="noopener noreferrer">Videoni ko'rish</a>
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{textTransform: "uppercase"}}>{v.lang}</span>
                      </td>
                      <td>{v.meta}</td>
                      <td>
                        <button className="adm-btn ghost" onClick={() => {
                          setEditingVideoId(v.id);
                          setVideoForm({
                            ...EMPTY_VIDEO,
                            ...v,
                            summary: v.summary || "",
                            body: v.body || "",
                            author: v.author || "Ishonch.uz tahririyati"
                          });
                        }} style={{padding: "4px 8px", marginRight: "4px"}}>✏️</button>
                        <button className="adm-btn danger" onClick={() => deleteVideo(v.id)} style={{padding: "4px 8px"}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {videosAdminList.length === 0 && (
                    <tr><td colSpan="5" style={{textAlign:"center", color:"var(--muted)"}}>Hozircha videolar yuklanmagan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 📸 TAB: PHOTOS --- */}
        {activeTab === "photos" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 2fr"}}>
            <div className="adm-dash-section">
              <h3>{editingPhotoId ? "Foto maqolani tahrirlash" : "Yangi foto maqola qo'shish"}</h3>
              <form onSubmit={savePhoto} className="adm-form">
                <label>
                  Sarlavha
                  <input value={photoForm.title} onChange={e => setPhotoForm({...photoForm, title: e.target.value})} placeholder="Masalan: Samarqandda xalqaro festival..." required />
                </label>
                <label>
                  Til
                  <select value={photoForm.lang} onChange={e => setPhotoForm({...photoForm, lang: e.target.value})} required>
                    <option value="uz">O'zbekcha (Lotin)</option>
                    <option value="uzk">Ўзбекча (Кирилл)</option>
                    <option value="ru">Русский</option>
                  </select>
                </label>
                <label>
                  Rukn / Kategoriya va Vaqt (Meta)
                  <input value={photoForm.meta} onChange={e => setPhotoForm({...photoForm, meta: e.target.value})} placeholder="Masalan: Madaniyat | 13:20" required />
                </label>
                <label>
                  Muqova rasm URL manzili
                  <div style={{display: "flex", gap: "10px"}}>
                    <input style={{flex: 1}} value={photoForm.image} onChange={e => setPhotoForm({...photoForm, image: e.target.value})} placeholder="https://..." required />
                    <button className="adm-btn primary" type="button" onClick={() => { loadMedia(); setActiveMediaSelector({ target: 'photo' }); }}>🖼️ Tanlash</button>
                    <button className="adm-btn primary" type="button" onClick={() => photoCoverRef.current?.click()}>📁 Yuklash</button>
                    <input type="file" accept="image/*" ref={photoCoverRef} style={{display: "none"}} onChange={e => { if (e.target.files?.[0]) uploadPhotoCover(e.target.files[0]) }} />
                  </div>
                </label>
                <label>
                  Tavsif / Qisqa matn (Summary)
                  <textarea value={photoForm.summary || ""} onChange={e => setPhotoForm({...photoForm, summary: e.target.value})} placeholder="Maqola sarlavhasi ostidagi qisqa matn..." style={{width:"100%", height:"60px", padding:"8px", borderRadius:"4px", border:"1px solid var(--line)", background:"var(--surface)", color:"var(--ink)"}} />
                </label>
                <div className="adm-rich-label" data-field="body" style={{marginBottom: "16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,width:"100%"}}>
                    <span style={{fontSize: "14px", fontWeight: "500", color: "var(--ink)"}}>Maqola batafsil matni (Body Text)</span>
                    <div className="translit-btn-group" style={{display:"flex",gap:4}}>
                      <button type="button" className="translit-btn" onClick={() => setPhotoForm({...photoForm, body: convertText(photoForm.body || "", true)})}>🔄 Kirill</button>
                      <button type="button" className="translit-btn" onClick={() => setPhotoForm({...photoForm, body: convertText(photoForm.body || "", false)})}>🔄 Lotin</button>
                    </div>
                  </div>
                  <RichEditor
                    key={editingPhotoId || "new"}
                    value={photoForm.body || ""}
                    onChange={(html) => setPhotoForm({...photoForm, body: html})}
                  />
                </div>
                <label>
                  Muallif (Author)
                  <input value={photoForm.author || ""} onChange={e => setPhotoForm({...photoForm, author: e.target.value})} placeholder="Masalan: Ishonch.uz tahririyati" />
                </label>

                <div className="adm-seo-section" style={{marginTop: "16px", marginBottom: "16px"}}>
                  <div className="adm-seo-head">
                    <span>🔍 SEO sozlamalari</span>
                  </div>
                  {renderAiSeoAssistantWidget('photo')}
                  <label>
                    Teglar
                    <input value={photoForm.tags || ""} onChange={e => setPhotoForm({...photoForm, tags: e.target.value})} placeholder="siyosat, iqtisod, yangilik (vergul bilan)" />
                  </label>
                  <label>
                    Meta sarlavha
                    <input value={photoForm.metaTitle || ""} onChange={e => setPhotoForm({...photoForm, metaTitle: e.target.value})} placeholder={photoForm.title} />
                  </label>
                  <label>
                    Meta tavsif
                    <textarea rows="2" value={photoForm.metaDesc || ""} onChange={e => setPhotoForm({...photoForm, metaDesc: e.target.value})} placeholder={photoForm.summary} />
                  </label>
                  {renderLiveSeoWidget(photoForm, 'photo')}
                </div>

                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  <button className="adm-btn primary" type="submit">{editingPhotoId ? "Saqlash" : "Qo'shish"}</button>
                  {editingPhotoId && (
                    <button className="adm-btn ghost" type="button" onClick={() => { setEditingPhotoId(null); setPhotoForm(EMPTY_PHOTO); }}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Yuklangan foto maqolalar ({photosAdminList.length} ta)</h3>
              <table className="adm-table" style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Rasm</th>
                    <th>Sarlavha</th>
                    <th>Til</th>
                    <th>Meta</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {photosAdminList.map(ph => (
                    <tr key={ph.id}>
                      <td>
                        {ph.image ? (
                          <img src={ph.image} alt="" style={{width: "60px", height: "40px", objectFit: "cover", borderRadius: "4px"}} />
                        ) : (
                          <span>📸</span>
                        )}
                      </td>
                      <td>
                        <strong>{ph.title}</strong>
                      </td>
                      <td>
                        <span className="badge" style={{textTransform: "uppercase"}}>{ph.lang}</span>
                      </td>
                      <td>{ph.meta}</td>
                      <td>
                        <button className="adm-btn ghost" onClick={() => {
                          setEditingPhotoId(ph.id);
                          setPhotoForm({
                            ...EMPTY_PHOTO,
                            ...ph,
                            summary: ph.summary || "",
                            body: ph.body || "",
                            author: ph.author || "Ishonch.uz tahririyati"
                          });
                        }} style={{padding: "4px 8px", marginRight: "4px"}}>✏️</button>
                        <button className="adm-btn danger" onClick={() => deletePhoto(ph.id)} style={{padding: "4px 8px"}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {photosAdminList.length === 0 && (
                    <tr><td colSpan="5" style={{textAlign:"center", color:"var(--muted)"}}>Hozircha foto maqolalar yuklanmagan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ✍️ TAB: AUTHORS --- */}
        {activeTab === "authors" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 2fr"}}>
            <div className="adm-dash-section">
              <h3>{editingAuthorId ? "Muallif ma'lumotini tahrirlash" : "Yangi muallif qo'shish"}</h3>
              <form onSubmit={saveAuthor} className="adm-form">
                <label>
                  Ism Familiya
                  <input value={authorForm.name} onChange={e => setAuthorForm({...authorForm, name: e.target.value})} placeholder="Masalan: Dilnoza Karimova" required />
                </label>
                <label>
                  Lavozimi / Roli
                  <input value={authorForm.role} onChange={e => setAuthorForm({...authorForm, role: e.target.value})} placeholder="Masalan: Tahririyat muharriri" required />
                </label>
                <label>
                  Avatar rasmi URL manzili
                  <input value={authorForm.avatar} onChange={e => setAuthorForm({...authorForm, avatar: e.target.value})} placeholder="https://..." />
                </label>
                <label>
                  Qisqacha bio (Ma'lumot)
                  <textarea rows="3" value={authorForm.bio} onChange={e => setAuthorForm({...authorForm, bio: e.target.value})} placeholder="Muallif haqida qisqacha ma'lumot..." />
                </label>
                <label>
                  Holati
                  <select value={authorForm.status} onChange={e => setAuthorForm({...authorForm, status: e.target.value})}>
                    <option value="active">Faol</option>
                    <option value="inactive">Nofaol</option>
                  </select>
                </label>
                <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
                  <button className="adm-btn primary" type="submit">{editingAuthorId ? "Saqlash" : "Qo'shish"}</button>
                  {editingAuthorId && (
                    <button className="adm-btn ghost" type="button" onClick={() => { setEditingAuthorId(null); setAuthorForm(EMPTY_AUTHOR); }}>Bekor qilish</button>
                  )}
                </div>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Jamoa a'zolari (Mualliflar) ({authors.length} ta)</h3>
              <table className="adm-table" style={{width: "100%"}}>
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Ism</th>
                    <th>Roli</th>
                    <th>Holat</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {authors.map(a => (
                    <tr key={a.id}>
                      <td>
                        <img src={a.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} alt="" style={{width: "36px", height: "36px", borderRadius: "50%", objectFit:"cover"}} />
                      </td>
                      <td><strong>{a.name}</strong></td>
                      <td>{a.role}</td>
                      <td>
                        <span className={`adm-status ${a.status === 'active' ? 'published' : 'draft'}`}>
                          {a.status === 'active' ? "Faol" : "Nofaol"}
                        </span>
                      </td>
                      <td>
                        <button className="adm-btn ghost" onClick={() => { setEditingAuthorId(a.id); setAuthorForm(a); }} style={{padding: "4px 8px", marginRight: "4px"}}>✏️</button>
                        <button className="adm-btn danger" onClick={() => deleteAuthor(a.id)} style={{padding: "4px 8px"}}>✕</button>
                      </td>
                    </tr>
                  ))}
                  {authors.length === 0 && (
                    <tr><td colSpan="5" style={{textAlign:"center", color:"var(--muted)"}}>Hozircha mualliflar ro'yxati shakllantirilmagan</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- 👥 TAB: SUBSCRIBERS --- */}
        {activeTab === "subscribers" && (
          <div className="adm-dash-section">
            <h3>Newsletter yangiliklariga obuna bo'lganlar ({subscribers.length} ta email)</h3>
            <table className="adm-table" style={{width: "100%", marginTop: "15px"}}>
              <thead>
                <tr>
                  <th>Email manzil</th>
                  <th>Holati</th>
                  <th>Obuna sanasi</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map(sub => (
                  <tr key={sub.id}>
                    <td><strong>{sub.email}</strong></td>
                    <td>
                      <span className="adm-status published">{sub.status}</span>
                    </td>
                    <td>{new Date(sub.createdAt).toLocaleString("uz-UZ")}</td>
                    <td>
                      <button className="adm-btn danger" onClick={() => deleteSubscriber(sub.id)}>✕ O'chirish</button>
                    </td>
                  </tr>
                ))}
                {subscribers.length === 0 && (
                  <tr><td colSpan="4" style={{textAlign:"center", color:"var(--muted)", padding:"20px"}}>Obunachilar mavjud emas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- 📧 TAB: NEWSLETTER --- */}
        {activeTab === "newsletter" && (
          <div className="adm-dash-grid" style={{gridTemplateColumns: "1fr 1fr"}}>
            <div className="adm-dash-section">
              <h3>Obunachilarga ommaviy xat yo'llash</h3>
              <p style={{color: "var(--muted)", fontSize: 13, marginBottom: 15}}>
                Ushbu oyna orqali xat yo'llasangiz, u tizimda ro'yxatdan o'tgan barcha <strong>{subscribers.filter(s => s.status === "subscribed").length} ta faol obunachiga</strong> simulated ravishda jo'natiladi.
              </p>
              <form onSubmit={sendNewsletter} className="adm-form">
                <label>
                  Xat mavzusi (Subject)
                  <input value={newsletterForm.subject} onChange={e => setNewsletterForm({...newsletterForm, subject: e.target.value})} placeholder="Masalan: Ishonch.uz haftalik muhim yangiliklari" required />
                </label>
                <label>
                  Xat matni (Body)
                  <textarea rows="8" value={newsletterForm.body} onChange={e => setNewsletterForm({...newsletterForm, body: e.target.value})} placeholder="Xat mazmuni..." required />
                </label>
                <button className="adm-btn primary" type="submit" style={{marginTop: 10}}>Send Newsletter ✉️</button>
              </form>
            </div>

            <div className="adm-dash-section">
              <h3>Yuborilgan xabarlar tarixi ({newsletterHistory.length} ta)</h3>
              <div style={{display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px"}}>
                {newsletterHistory.map(nl => (
                  <div key={nl.id} style={{padding: "12px", border: "1px solid var(--line)", borderRadius: "6px", background: "var(--surface)"}}>
                    <div style={{fontWeight: 700, fontSize: "14px"}}>{nl.subject}</div>
                    <div style={{fontSize: "11px", color: "var(--muted)", marginTop: "4px"}}>
                      Sana: {new Date(nl.createdAt).toLocaleString("uz-UZ")} | Qabul qiluvchilar: <strong>{nl.sentCount} ta</strong>
                    </div>
                    <p style={{margin: "8px 0 0", fontSize: "12.5px", color: "var(--ink)", background: "var(--bg)", padding: "6px", borderRadius: "3px"}}>
                      {nl.body.slice(0, 150)}...
                    </p>
                  </div>
                ))}
                {newsletterHistory.length === 0 && (
                  <p style={{color: "var(--muted)", textAlign:"center", padding:"20px"}}>Yuborilgan xatlar tarixi bo'sh</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- 💳 TAB: PAYMENTS --- */}
        {activeTab === "payments" && (
          <div className="adm-dash-section">
            <h3>Xayriyalar va qo'llab-quvvatlashlar reyestri</h3>
            <div style={{display: "flex", gap: "20px", marginBottom: "20px"}}>
              <div style={{padding: "15px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--surface)", flex: 1}}>
                <div style={{fontSize: "12px", color: "var(--muted)"}}>Jami Xayriya miqdori</div>
                <h2 style={{color: "var(--brand)", margin: "5px 0 0"}}>
                  {payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} UZS
                </h2>
              </div>
              <div style={{padding: "15px", border: "1px solid var(--line)", borderRadius: "8px", background: "var(--surface)", flex: 1}}>
                <div style={{fontSize: "12px", color: "var(--muted)"}}>Tranzaksiyalar soni</div>
                <h2 style={{color: "var(--blue)", margin: "5px 0 0"}}>{payments.length} ta</h2>
              </div>
            </div>

            <table className="adm-table" style={{width: "100%"}}>
              <thead>
                <tr>
                  <th>Kimdan</th>
                  <th>Miqdori</th>
                  <th>Tavsif (Loyiha)</th>
                  <th>Sana</th>
                  <th>Holat</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong><br/><small style={{color:"var(--muted)"}}>{p.email}</small></td>
                    <td style={{fontWeight: 700}}>{p.amount.toLocaleString()} {p.currency}</td>
                    <td>{p.description}</td>
                    <td>{new Date(p.createdAt).toLocaleString("uz-UZ")}</td>
                    <td>
                      <span className="adm-status published">✓ Muvaffaqiyatli</span>
                    </td>
                    <td>
                      <button className="adm-btn danger" onClick={() => deletePayment(p.id)} style={{padding: "4px 8px"}}>✕</button>
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr><td colSpan="6" style={{textAlign:"center", color:"var(--muted)", padding:"20px"}}>Hozircha to'lovlar reyestri bo'sh</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* --- ⚡ TAB: NEWS --- */}
        {activeTab === "news" && (
          <div className="adm-dash-section" style={{maxWidth: "600px"}}>
            <h3>Tezkor xabarlar (Breaking News Banner) sozlamalari</h3>
            <p style={{color: "var(--muted)", fontSize: 13, marginBottom: 15}}>
              Ushbu bo'limda yozilgan e'lon yoki tezkor xabar sayt bosh sahifasining eng yuqori qismida yuguruvchi satr shaklida ko'rinadi.
            </p>
            <form onSubmit={saveHomeConfig} className="adm-form">
              <div style={{display: "flex", gap: "10px", margin: "10px 0"}}>
                <input type="checkbox" id="newsBannerCheck" checked={homeConfig.bannerActive} onChange={e => setHomeConfig({...homeConfig, bannerActive: e.target.checked})} style={{width:"20px", height:"20px"}} />
                <label htmlFor="newsBannerCheck" style={{marginBottom:0, cursor:"pointer"}}>Tezkor xabar satrini yoqish</label>
              </div>
              {homeConfig.bannerActive && (
                <label>
                  Tezkor xabar matni
                  <input value={homeConfig.bannerText} onChange={e => setHomeConfig({...homeConfig, bannerText: e.target.value})} placeholder="Tezkor xabar matnini kiriting..." required />
                </label>
              )}
              <button className="adm-btn primary" type="submit" style={{marginTop: 10}}>Tezkor xabarni saqlash</button>
            </form>
          </div>
        )}

        {/* --- 📋 TAB: LIST --- */}
        {activeTab === "list" && (
          <div className="adm-list">
            <div className="adm-filters">
              <div className="adm-search-wrap">
                <span>🔍</span>
                <input
                  type="search"
                  placeholder="Sarlavha, mazmun bo'yicha qidirish..."
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                />
              </div>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
                <option value="all">Barcha kategoriyalar</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">Barcha holat</option>
                <option value="published">Chop etilgan</option>
                <option value="draft">Qoralama</option>
              </select>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="newest">Eng yangi</option>
                <option value="oldest">Eng eski</option>
              </select>
              <span className="adm-filter-count">{filteredStories.length} ta</span>
              <div className="adm-export-btns">
                <button className="adm-btn ghost" title="JSON yuklab olish" onClick={() => exportStories("json")}>⬇ JSON</button>
                <button className="adm-btn ghost" title="CSV yuklab olish" onClick={() => exportStories("csv")}>⬇ CSV</button>
              </div>
            </div>

            {selectedIds.size > 0 && (
              <div className="adm-bulk-bar active">
                <div className="adm-bulk-bar-inner">
                  <span className="adm-bulk-count">📱 {selectedIds.size} ta tanlandi</span>
                  <div className="adm-bulk-buttons">
                    <button className="adm-btn primary" onClick={async () => {
                      notify("Chop etilmoqda...", "info");
                      for (const id of selectedIds) {
                        const story = stories.find(s => s.id === id);
                        if (story) await changeStatus(story, "published");
                      }
                      setSelectedIds(new Set());
                    }}>✓ Chop etish</button>
                    <button className="adm-btn ghost" onClick={async () => {
                      notify("Qoralama qilinmoqda...", "info");
                      for (const id of selectedIds) {
                        const story = stories.find(s => s.id === id);
                        if (story) await changeStatus(story, "draft");
                      }
                      setSelectedIds(new Set());
                    }}>◌ Draftga</button>
                    <button className="adm-btn danger" onClick={async () => {
                      if (confirm(`✕ Haqiqatan ham ${selectedIds.size} ta maqolani o'chirmoqchisiz?`)) {
                        notify("O'chirilmoqda...", "info");
                        for (const id of selectedIds) {
                          await deleteStory(id);
                        }
                        setSelectedIds(new Set());
                      }
                    }}>✕ O'chirish</button>
                  </div>
                  <button className="adm-bulk-close" onClick={() => setSelectedIds(new Set())}>✕</button>
                </div>
              </div>
            )}

            {filteredStories.length === 0 && (
              <div className="adm-empty">
                {searchQ || filterCat !== "all" || filterStatus !== "all"
                  ? "Filter bo'yicha maqola topilmadi."
                  : "Hozircha maqola yo'q. Yangi maqola qo'shing."}
              </div>
            )}
            {filteredStories.map((story) => {
              const storyReactions = JSON.parse(localStorage.getItem("yk-reactions") || "{}" )[story.id] || {};
              const {_mine, ...emojiCounts} = storyReactions;
              const reactionTotal = Object.values(emojiCounts).reduce((a,b) => a+(Number(b)||0), 0);
              return (
              <article className="adm-item" key={story.id} style={{position:"relative"}}>
                <label style={{position:"absolute",top:8,left:8,zIndex:10,cursor:"pointer",padding:4,background:"rgba(255,255,255,0.9)",borderRadius:4}}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.has(story.id)}
                    onChange={(e) => {
                      const newSet = new Set(selectedIds);
                      if (e.target.checked) newSet.add(story.id);
                      else newSet.delete(story.id);
                      setSelectedIds(newSet);
                    }}
                    style={{width:18,height:18,cursor:"pointer"}}
                  />
                </label>
                <div className="adm-item-preview">
                  <img src={story.image} alt="" />
                  <div className="adm-item-preview-body">
                    <span className="kicker">{story.category}</span>
                    <p>{story.summary || "Mazmun yo'q"}</p>
                    <div style={{display:"flex",gap:10,fontSize:12,color:"var(--muted)",marginTop:6}}>
                      {story.views > 0 && <span>👁 {story.views}</span>}
                      {reactionTotal > 0 && <span>👍 {reactionTotal}</span>}
                    </div>
                  </div>
                </div>
                <img src={story.image} alt="" style={{marginLeft:32}} />
                <div className="adm-item-body">
                  <div className="adm-item-meta">
                    <span className={`adm-status ${story.status}`}>
                      {story.status === "published" ? (story.publishAt && story.publishAt > new Date().toISOString() ? "⏰ Rejalashtirilgan" : "✓ Chop etilgan") : "◌ Qoralama"}
                    </span>
                    <span className="adm-item-cat">{story.category}{story.subcategory ? ` › ${story.subcategory}` : ""}</span>
                    {reactionTotal > 0 && <span className="adm-reaction-badge">👍 {reactionTotal}</span>}
                    {(story.views||0) > 0 && <span className="adm-views-badge">👁 {story.views}</span>}
                  </div>
                  <h3>{story.title || "Sarlavhasiz"}</h3>
                  <p>{story.summary}</p>
                </div>
                <div className="adm-item-actions">
                  <button className="adm-btn ghost" onClick={() => editStory(story)}>✏ Tahrirlash</button>
                  <button className="adm-btn ghost" title="Nusxalash" onClick={() => duplicateStory(story)}>⧉</button>
                  <button
                    className={`adm-btn ${story.status === "published" ? "ghost" : "primary"}`}
                    onClick={() => changeStatus(story, story.status === "published" ? "draft" : "published")}
                  >
                    {story.status === "published" ? "⊙ Draft" : "✓ Chop et"}
                  </button>
                  <button className="adm-btn danger" onClick={() => deleteStory(story.id)}>✕</button>
                </div>
              </article>
              );
            })}
          </div>
        )}

        {/* --- ✏️ TAB: EDITOR --- */}
        {activeTab === "editor" && (
          <div className="adm-editor-wrap">
            <form id="story-form" className="adm-form" onSubmit={saveStory}>
              <div className="adm-form-grid">
                <div className="adm-form-left">
                  <div className="adm-form-row">
                    <label>
                      Kategoriya
                      <select
                        value={lang === "uzk" ? (() => {
                          const uzCats = siteConfig.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"];
                          const uzkCats = siteConfig.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"];
                          const idx = uzCats.indexOf(form.category);
                          return idx > -1 && uzkCats[idx] ? uzkCats[idx] : form.category;
                        })() : form.category}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (lang === "uzk") {
                            const uzCats = siteConfig.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"];
                            const uzkCats = siteConfig.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"];
                            const idx = uzkCats.indexOf(val);
                            if (idx > -1 && uzCats[idx]) val = uzCats[idx];
                          }
                          updateField("category", val);
                          updateField("subcategory", "");
                        }}
                      >
                        {form.category && !(() => {
                          const displayed = lang === "uzk" ? (() => {
                            const uzCats = siteConfig.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"];
                            const uzkCats = siteConfig.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"];
                            const idx = uzCats.indexOf(form.category);
                            return idx > -1 && uzkCats[idx] ? uzkCats[idx] : form.category;
                          })() : form.category;
                          return categories.includes(displayed);
                        })() && (
                          <option value={form.category}>{form.category} (Eski)</option>
                        )}
                        {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </label>

                    {(() => {
                      const displayCategory = lang === "uzk"
                        ? (() => {
                            const uzCats = siteConfig.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"];
                            const uzkCats = siteConfig.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"];
                            const idx = uzCats.indexOf(form.category);
                            return idx > -1 && uzkCats[idx] ? uzkCats[idx] : form.category;
                          })()
                        : form.category;
                      const subs = itemSubcategories[displayCategory] || [];
                      if (subs.length === 0) return null;
                      
                      let selectVal = form.subcategory || "";
                      if (lang === "uzk" && form.subcategory) {
                        const uzSubs = siteConfig.subcategoriesUz?.[form.category] || [];
                        const idx = uzSubs.indexOf(form.subcategory);
                        if (idx > -1 && subs[idx]) {
                          selectVal = subs[idx];
                        }
                      }
                      
                      return (
                        <label>
                          Rukn osti (Subcategory)
                          <select
                            value={selectVal}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (lang === "uzk" && val) {
                                const uzSubs = siteConfig.subcategoriesUz?.[form.category] || [];
                                const idx = subs.indexOf(val);
                                if (idx > -1 && uzSubs[idx]) {
                                  val = uzSubs[idx];
                                }
                              }
                              updateField("subcategory", val);
                            }}
                          >
                            <option value="">Rukn osti tanlanmagan</option>
                            {subs.map((sub, i) => (
                              <option key={sub + "_" + i} value={sub}>
                                {sub}
                              </option>
                            ))}
                          </select>
                        </label>
                      );
                    })()}

                    <label>
                      Holat
                      <select value={form.status} onChange={(e) => updateField("status", e.target.value)}>
                        <option value="published">Chop etilgan</option>
                        <option value="draft">Qoralama</option>
                      </select>
                    </label>
                  </div>
                  <label data-field="title">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span>Sarlavha <span className="req">*</span></span>
                      <div className="translit-btn-group" style={{display:"flex",gap:4}}>
                        <button type="button" className="translit-btn" onClick={() => updateField('title', convertText(form.title, true))}>🔄 Kirill</button>
                        <button type="button" className="translit-btn" onClick={() => updateField('title', convertText(form.title, false))}>🔄 Lotin</button>
                      </div>
                    </div>
                    <input
                      value={form.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      placeholder="Maqola sarlavhasi..."
                      className={formErrors.title ? "field-error" : ""}
                    />
                    <div className="field-footer">
                      {formErrors.title ? <span className="field-err-msg">⚠ {formErrors.title}</span> : <span/>}
                      <span className={`char-count ${form.title.length > 120 ? "over" : ""}`}>{form.title.length}/120</span>
                    </div>
                  </label>
                  <label data-field="slug">
                    URL slug (avtomatik yaratiladi)
                    <input
                      value={form.slug || ''}
                      onChange={(e) => updateField("slug", e.target.value)}
                      placeholder="news-sarlavha"
                    />
                  </label>
                  <label data-field="summary">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span>Qisqa mazmun <span className="req">*</span></span>
                      <div className="translit-btn-group" style={{display:"flex",gap:4}}>
                        <button type="button" className="translit-btn" onClick={() => updateField('summary', convertText(form.summary, true))}>🔄 Kirill</button>
                        <button type="button" className="translit-btn" onClick={() => updateField('summary', convertText(form.summary, false))}>🔄 Lotin</button>
                      </div>
                    </div>
                    <textarea rows="3" value={form.summary} onChange={(e) => updateField("summary", e.target.value)} placeholder="Qisqa tavsif..." className={formErrors.summary ? "field-error" : ""} />
                    <div className="field-footer">
                      {formErrors.summary ? <span className="field-err-msg">⚠ {formErrors.summary}</span> : <span/>}
                      <span className={`char-count ${form.summary.length > 200 ? "over" : ""}`}>{form.summary.length}/200</span>
                    </div>
                  </label>
                  <div className="adm-form-row">
                    <label>
                      Muallif
                      <select value={form.author} onChange={(e) => updateField("author", e.target.value)} style={{width: "100%"}}>
                        <option value="Ishonch.uz tahririyati">Ishonch.uz tahririyati (Tizim)</option>
                        {authors.filter(a => a.status === "active").map(a => (
                          <option key={a.id} value={a.name}>{a.name} ({a.role})</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      O'qish vaqti
                      <input value={form.read} onChange={(e) => updateField("read", e.target.value)} placeholder="3 daqiqa" />
                    </label>
                  </div>
                  <div className="adm-rich-label" data-field="body">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,width:"100%"}}>
                      <span>Maqola matni <span className="req">*</span>{formErrors.body && <span className="field-err-msg" style={{marginLeft:8}}>⚠ {formErrors.body}</span>}</span>
                      <div className="translit-btn-group" style={{display:"flex",gap:4}}>
                        <button type="button" className="translit-btn" onClick={() => updateField('body', convertText(form.body, true))}>🔄 Kirill</button>
                        <button type="button" className="translit-btn" onClick={() => updateField('body', convertText(form.body, false))}>🔄 Lotin</button>
                      </div>
                    </div>
                    <RichEditor
                      value={form.body}
                      onChange={(html) => updateField("body", html)}
                    />
                  </div>

                  <div className="adm-seo-section">
                    <div className="adm-seo-head">
                      <span>🔍 SEO sozlamalari</span>
                    </div>
                    {renderAiSeoAssistantWidget('story')}
                    <label>
                      Teglar
                      <input value={form.tags} onChange={e => updateField("tags", e.target.value)} placeholder="siyosat, iqtisod, yangilik (vergul bilan)" />
                    </label>
                    <label>
                      Meta sarlavha
                      <input value={form.metaTitle} onChange={e => updateField("metaTitle", e.target.value)} placeholder={form.title} />
                    </label>
                    <label>
                      Meta tavsif
                      <textarea rows="2" value={form.metaDesc} onChange={e => updateField("metaDesc", e.target.value)} placeholder={form.summary} />
                    </label>
                    {renderLiveSeoWidget(form, 'story')}
                  </div>
                </div>

                <div className="adm-form-right">
                  <div className="adm-preview-box">
                    <h4>Ko'rinish</h4>
                    {form.image ? (
                      <img src={form.image} alt="" className="adm-preview-img" />
                    ) : (
                      <div className="adm-preview-placeholder">Rasm tanlanmagan</div>
                    )}
                    <span className={`adm-status ${form.status}`}>{form.status}</span>
                    <strong className="adm-preview-title">{form.title || "Sarlavha..."}</strong>
                    <p className="adm-preview-summary">{form.summary || "Qisqa mazmun..."}</p>
                  </div>
                  <label>
                    Rasm URL
                    <div style={{display: "flex", gap: "10px"}}>
                      <input style={{flex: 1}} value={form.image} onChange={(e) => updateField("image", e.target.value)} placeholder="https://..." />
                      <button className="adm-btn primary" type="button" onClick={() => { loadMedia(); setActiveMediaSelector({ target: 'story' }); }}>🖼️ Kutubxonadan tanlash</button>
                    </div>
                  </label>
                  <label className="adm-file-label">
                    <span>📎 Kompyuterdan yuklash</span>
                    <input type="file" accept="image/*" onChange={handleImageFile} />
                  </label>
                  <div className="adm-form-toggles">
                    <div className="adm-toggle-row">
                      <span>Asosiy maqola</span>
                      <label className="adm-toggle-switch">
                        <input type="checkbox" checked={!!form.isHero} onChange={e=>{
                          updateField("isHero", e.target.checked);
                          if (e.target.checked) setPinnedHeroId("");
                        }} />
                        <span className="adm-toggle-slider" />
                      </label>
                    </div>
                    <div className="adm-toggle-row" style={{background: form.sendToTelegram ? "rgba(0,136,204,0.08)" : undefined, borderRadius: "8px", padding: "8px 0"}}>
                      <span style={{display: "flex", alignItems: "center", gap: "6px"}}>
                        <span style={{fontSize: "18px"}}>📤</span>
                        <span>Telegramga yuborish</span>
                      </span>
                      <label className="adm-toggle-switch">
                        <input type="checkbox" checked={!!form.sendToTelegram} onChange={e => updateField("sendToTelegram", e.target.checked)} />
                        <span className="adm-toggle-slider" />
                      </label>
                    </div>
                    {form.sendToTelegram && (
                      <div style={{padding: "6px 12px", background: "rgba(0,136,204,0.06)", borderRadius: "8px", fontSize: "12px", color: "var(--muted)", lineHeight: 1.5}}>
                        {form.status === "published" 
                          ? <span style={{color: "#0088cc"}}>✅ Maqola chop etilganda Telegram kanalingizga avtomatik yuboriladi</span>
                          : <span style={{color: "#e67e22"}}>⚠️ Faqat "Chop etilgan" holat bo'lganda Telegramga yuboriladi</span>
                        }
                        {(!siteConfig.telegramBotToken || !siteConfig.telegramChatId) && (
                          <div style={{marginTop: "4px", color: "#e74c3c"}}>❌ Telegram Bot Token yoki Chat ID sozlanmagan. Sozlamalar → Telegram bo'limida to'ldiring.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* --- ⚙️ TAB: SETTINGS --- */}
        {activeTab === "settings" && (
          <div className="adm-settings" style={{maxWidth: "900px", margin: "0 auto"}}>
            <div className="adm-settings-header" style={{marginBottom: "24px"}}>
              <h2 style={{margin: 0, fontSize: "28px", color: "var(--ink)", fontWeight: "600"}}>Созламалар</h2>
              <p style={{margin: "4px 0 0 0", color: "var(--muted)", fontSize: "14px"}}>Сайтнинг глобал параметрлари ва хавфсизлик</p>
            </div>

            {/* Sub Tabs Navigation */}
            <div className="adm-settings-tabs" style={{
              display: "flex", 
              gap: "8px", 
              borderBottom: "1px solid var(--line)", 
              marginBottom: "24px",
              paddingBottom: "12px",
              overflowX: "auto"
            }}>
              <button 
                type="button" 
                className={`adm-btn ${settingsSubTab === "general" ? "primary" : "ghost"}`} 
                onClick={() => setSettingsSubTab("general")}
                style={{whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px"}}
              >
                ⚙️ Умумий ва Дизайн
              </button>
              <button 
                type="button" 
                className={`adm-btn ${settingsSubTab === "integration" ? "primary" : "ghost"}`} 
                onClick={() => setSettingsSubTab("integration")}
                style={{whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px"}}
              >
                🤖 Интеграция
              </button>
              <button 
                type="button" 
                className={`adm-btn ${settingsSubTab === "seo" ? "primary" : "ghost"}`} 
                onClick={() => setSettingsSubTab("seo")}
                style={{whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px"}}
              >
                🔍 SEO & Медиа
              </button>
              <button 
                type="button" 
                className={`adm-btn ${settingsSubTab === "system" ? "primary" : "ghost"}`} 
                onClick={() => setSettingsSubTab("system")}
                style={{whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px"}}
              >
                🛡️ Хавфсизлик & Тизим
              </button>
            </div>

            {/* Sub Tab Content */}
            <form onSubmit={saveHomeConfig} className="adm-form">
              {settingsSubTab === "general" && (
                <div style={{display: "flex", flexDirection: "column", gap: "24px"}}>
                  {/* Brand Color Picker Card */}
                  <div style={{
                    padding: "20px", 
                    background: "var(--surface)", 
                    border: "1px solid var(--line)", 
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px"
                  }}>
                    <div style={{
                      width: "48px", 
                      height: "48px", 
                      borderRadius: "6px", 
                      background: homeConfig.brandColor || "#c31932",
                      border: "2px solid #fff",
                      boxShadow: "0 0 10px rgba(0,0,0,0.15)",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      <input 
                        type="color" 
                        value={homeConfig.brandColor || "#c31932"} 
                        onChange={e => setHomeConfig({...homeConfig, brandColor: e.target.value})}
                        style={{
                          position: "absolute",
                          top: "-5px",
                          left: "-5px",
                          width: "60px",
                          height: "60px",
                          border: "none",
                          padding: 0,
                          cursor: "pointer"
                        }}
                      />
                    </div>
                    <div>
                      <strong style={{color: "var(--ink)", display: "block", fontSize: "16px"}}>Дизайн (Ранглар палитраси)</strong>
                      <span style={{color: "var(--muted)", fontSize: "13px"}}>Асосий ранг. Сайтнинг менюлари ва асосий тугмалари учун қўлланилади.</span>
                    </div>
                  </div>

                  {/* Faol tillar sozlamalari */}
                  <div style={{
                    padding: "20px", 
                    background: "var(--surface)", 
                    border: "1px solid var(--line)", 
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}>
                    <strong style={{color: "var(--ink)", display: "block", fontSize: "16px"}}>🌐 Фаол тиллар (Active Languages)</strong>
                    <span style={{color: "var(--muted)", fontSize: "13px"}}>Сайтда фойдаланиладиган тилларни танланг. Рус тилини фаолсизлантириш орқали сайтning ruscha versiyasi va til tanlagichdan olib tashlanadi.</span>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "8px"}}>
                      <label style={{display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", margin: 0}}>
                        <input 
                          type="checkbox" 
                          checked={homeConfig.langUzActive !== false} 
                          onChange={e => setHomeConfig({...homeConfig, langUzActive: e.target.checked})}
                          style={{width: "18px", height: "18px", cursor: "pointer"}}
                        />
                        <span style={{color: "var(--ink)", fontSize: "14px"}}>O'zbekcha (Lotin)</span>
                      </label>
                      <label style={{display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", margin: 0}}>
                        <input 
                          type="checkbox" 
                          checked={homeConfig.langUzkActive !== false} 
                          onChange={e => setHomeConfig({...homeConfig, langUzkActive: e.target.checked})}
                          style={{width: "18px", height: "18px", cursor: "pointer"}}
                        />
                        <span style={{color: "var(--ink)", fontSize: "14px"}}>Ўзбекча (Кирилл)</span>
                      </label>
                      <label style={{display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", margin: 0}}>
                        <input 
                          type="checkbox" 
                          checked={homeConfig.langRuActive !== false} 
                          onChange={e => setHomeConfig({...homeConfig, langRuActive: e.target.checked})}
                          style={{width: "18px", height: "18px", cursor: "pointer"}}
                        />
                        <span style={{color: "var(--ink)", fontSize: "14px", fontWeight: "600"}}>Русский (Рус тили)</span>
                      </label>
                    </div>
                  </div>

                  <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                    <label>
                      Сайт номи
                      <input 
                        value={homeConfig.siteName} 
                        onChange={e => setHomeConfig({...homeConfig, siteName: e.target.value})} 
                        placeholder="Masalan: VATAN"
                      />
                    </label>
                    <label>
                      Шиори (Tagline)
                      <input 
                        value={homeConfig.tagline} 
                        onChange={e => setHomeConfig({...homeConfig, tagline: e.target.value})} 
                        placeholder="Masalan: Ilmiy-ommabop jurnal"
                      />
                    </label>
                  </div>

                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Алоқа маълумотлари</h4>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                      <label>
                        Телефон
                        <input 
                          value={homeConfig.phone} 
                          onChange={e => setHomeConfig({...homeConfig, phone: e.target.value})} 
                          placeholder="+998 90 123-45-67"
                        />
                      </label>
                      <label>
                        Email
                        <input 
                          type="email"
                          value={homeConfig.email} 
                          onChange={e => setHomeConfig({...homeConfig, email: e.target.value})} 
                          placeholder="info@site.uz"
                        />
                      </label>
                    </div>
                    <label style={{marginTop: "16px"}}>
                      Манзил
                      <input 
                        value={homeConfig.address} 
                        onChange={e => setHomeConfig({...homeConfig, address: e.target.value})} 
                        placeholder="Toshkent sh., Buxoro ko'chasi, 24-uy"
                      />
                    </label>
                  </div>

                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Ижтимоий тармоқлар</h4>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                      <label>
                        Telegram
                        <input 
                          value={homeConfig.telegram} 
                          onChange={e => setHomeConfig({...homeConfig, telegram: e.target.value})} 
                          placeholder="https://t.me/username"
                        />
                      </label>
                      <label>
                        Facebook
                        <input 
                          value={homeConfig.facebook} 
                          onChange={e => setHomeConfig({...homeConfig, facebook: e.target.value})} 
                          placeholder="https://facebook.com/page"
                        />
                      </label>
                      <label>
                        Instagram
                        <input 
                          value={homeConfig.instagram} 
                          onChange={e => setHomeConfig({...homeConfig, instagram: e.target.value})} 
                          placeholder="https://instagram.com/profile"
                        />
                      </label>
                      <label>
                        Youtube
                        <input 
                          value={homeConfig.youtube} 
                          onChange={e => setHomeConfig({...homeConfig, youtube: e.target.value})} 
                          placeholder="https://youtube.com/channel"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Brand & Footer Settings in General Tab */}
                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px", marginTop: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Бренд ва Фотер sozlamalari</h4>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px"}}>
                      <div>
                        <div style={{fontWeight: 700, fontSize: "13px", color: "var(--ink)", marginBottom: "6px"}}>Сайт логотипи URL</div>
                        <div style={{display: "flex", gap: "8px"}}>
                          <input 
                            value={homeConfig.logoUrl} 
                            onChange={e => setHomeConfig({...homeConfig, logoUrl: e.target.value})} 
                            placeholder="/uploads/logo.svg"
                            style={{flex: 1}}
                          />
                          <button 
                            type="button" 
                            className="adm-btn primary" 
                            onClick={() => { loadMedia(); setActiveMediaSelector({ target: 'logo' }); }}
                            style={{flexShrink: 0, padding: "8px 12px"}}
                          >
                            🖼️ Tanlash
                          </button>
                          <button 
                            type="button" 
                            className="adm-btn ghost" 
                            onClick={() => mainLogoInputRef.current?.click()}
                            style={{flexShrink: 0, padding: "8px 12px"}}
                          >
                            📁 Yuklash
                          </button>
                        </div>
                        <input 
                          ref={mainLogoInputRef} 
                          type="file" 
                          accept="image/*" 
                          style={{display: "none"}} 
                          onChange={e => { if (e.target.files?.[0]) uploadLogo(e.target.files[0], 'logo'); e.target.value = ''; }} 
                        />
                      </div>
                      <div style={{display: "flex", gap: "10px", alignItems: "center", marginTop: "24px"}}>
                        {homeConfig.logoUrl && (
                          <div style={{padding: "8px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "44px"}}>
                            <img src={homeConfig.logoUrl} alt="Logo preview" style={{maxHeight: "30px"}} onError={e => e.target.style.display='none'} />
                          </div>
                        )}
                        <span style={{fontSize: "13px", color: "var(--muted)"}}>Tavsiya etiladigan format: SVG yoki shaffof PNG</span>
                      </div>
                    </div>

                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px"}}>
                      <div>
                        <div style={{fontWeight: 700, fontSize: "13px", color: "var(--ink)", marginBottom: "6px"}}>Пастки логотип URL (Footer Logo)</div>
                        <div style={{display: "flex", gap: "8px"}}>
                          <input 
                            value={homeConfig.footerLogoUrl || ""} 
                            onChange={e => setHomeConfig({...homeConfig, footerLogoUrl: e.target.value})} 
                            placeholder="Masalan: /uploads/logo-white.svg"
                            style={{flex: 1}}
                          />
                          <button 
                            type="button" 
                            className="adm-btn primary" 
                            onClick={() => { loadMedia(); setActiveMediaSelector({ target: 'footer' }); }}
                            style={{flexShrink: 0, padding: "8px 12px"}}
                          >
                            🖼️ Tanlash
                          </button>
                          <button 
                            type="button" 
                            className="adm-btn ghost" 
                            onClick={() => footerLogoInputRef.current?.click()}
                            style={{flexShrink: 0, padding: "8px 12px"}}
                          >
                            📁 Yuklash
                          </button>
                        </div>
                        <input 
                          ref={footerLogoInputRef} 
                          type="file" 
                          accept="image/*" 
                          style={{display: "none"}} 
                          onChange={e => { if (e.target.files?.[0]) uploadLogo(e.target.files[0], 'footer'); e.target.value = ''; }} 
                        />
                      </div>
                      <div style={{display: "flex", gap: "10px", alignItems: "center", marginTop: "24px"}}>
                        {homeConfig.footerLogoUrl && (
                          <div style={{padding: "8px", background: "#101725", border: "1px solid var(--line)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "44px"}}>
                            <img src={homeConfig.footerLogoUrl} alt="Footer Logo preview" style={{maxHeight: "30px"}} onError={e => e.target.style.display='none'} />
                          </div>
                        )}
                        <span style={{fontSize: "13px", color: "var(--muted)"}}>Фотер учун махсус логотип (қора рангли футерга мос бўлиши лозим)</span>
                      </div>
                    </div>

                    <div style={{display: "flex", flexDirection: "column", gap: "12px"}}>
                      <label>
                        Сайт тавсифи (UZ - Lotincha)
                        <textarea 
                          rows="2" 
                          value={homeConfig.descriptionUz} 
                          onChange={e => setHomeConfig({...homeConfig, descriptionUz: e.target.value})} 
                          placeholder="Sayt haqida o'zbek tilidagi qisqacha ma'lumot (metatag)..."
                        />
                      </label>
                      <label>
                        Сайт тавсифи (ЎЗ - Кириллча)
                        <textarea 
                          rows="2" 
                          value={homeConfig.descriptionUzk} 
                          onChange={e => setHomeConfig({...homeConfig, descriptionUzk: e.target.value})} 
                          placeholder="Сайт ҳақида ўзбек тилида қисқача маълумот..."
                        />
                      </label>
                      <label>
                        Сайт тавсифи (RU - Ruscha)
                        <textarea 
                          rows="2" 
                          value={homeConfig.descriptionRu} 
                          onChange={e => setHomeConfig({...homeConfig, descriptionRu: e.target.value})} 
                          placeholder="Краткое описание сайта на русском языке..."
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {settingsSubTab === "integration" && (
                <div style={{display: "flex", flexDirection: "column", gap: "24px"}}>
                  <div>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Ташқи аналитика ва тизимлар</h4>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                      <label>
                        Google Analytics Tracking ID
                        <input 
                          value={homeConfig.googleAnalyticsId} 
                          onChange={e => setHomeConfig({...homeConfig, googleAnalyticsId: e.target.value})} 
                          placeholder="G-XXXXXXXXXX"
                        />
                      </label>
                      <label>
                        Yandex Metrika Counter ID
                        <input 
                          value={homeConfig.yandexMetrikaId} 
                          onChange={e => setHomeConfig({...homeConfig, yandexMetrikaId: e.target.value})} 
                          placeholder="XXXXXXXX"
                        />
                      </label>
                    </div>
                  </div>

                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px"}}>
                    <h4 style={{margin: "0 0 8px 0", color: "var(--ink)"}}>Телеграм Бот хабарномаси</h4>
                    <p style={{margin: "0 0 16px 0", color: "var(--muted)", fontSize: "13px"}}>Yangi izohlar va foydalanuvchilar xatlarini Telegram bot orqali guruhga yuborish.</p>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
                      <label>
                        Telegram Bot Token
                        <input 
                          value={homeConfig.telegramBotToken} 
                          onChange={e => setHomeConfig({...homeConfig, telegramBotToken: e.target.value})} 
                          placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                        />
                      </label>
                      <label>
                        Telegram Chat ID
                        <input 
                          value={homeConfig.telegramChatId} 
                          onChange={e => setHomeConfig({...homeConfig, telegramChatId: e.target.value})} 
                          placeholder="-100XXXXXXXXXX"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {settingsSubTab === "seo" && (
                <div style={{display: "flex", flexDirection: "column", gap: "24px"}}>
                  <div>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Қидирув тизимларини оптималлаштириш (SEO)</h4>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "flex-end"}}>
                      <div style={{marginBottom: 0}}>
                        <div style={{fontWeight: 700, fontSize: "13px", color: "var(--ink)", marginBottom: "6px"}}>Сайт логотипи URL</div>
                        <div style={{display: "flex", gap: "8px"}}>
                          <input 
                            value={homeConfig.logoUrl} 
                            onChange={e => setHomeConfig({...homeConfig, logoUrl: e.target.value})} 
                            placeholder="/uploads/logo.svg"
                            style={{flex: 1}}
                          />
                          <button 
                            type="button" 
                            className="adm-btn primary" 
                            onClick={() => { loadMedia(); setActiveMediaSelector({ target: 'logo' }); }}
                            style={{flexShrink: 0, padding: "8px 12px"}}
                          >
                            🖼️ Tanlash
                          </button>
                          <button 
                            type="button" 
                            className="adm-btn ghost" 
                            onClick={() => mainLogoInputRef.current?.click()}
                            style={{flexShrink: 0, padding: "8px 12px"}}
                          >
                            📁 Yuklash
                          </button>
                        </div>
                      </div>
                      <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                        {homeConfig.logoUrl && (
                          <div style={{padding: "8px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "44px"}}>
                            <img src={homeConfig.logoUrl} alt="Logo preview" style={{maxHeight: "30px"}} onError={e => e.target.style.display='none'} />
                          </div>
                        )}
                        <span style={{fontSize: "13px", color: "var(--muted)"}}>Tavsiya etiladigan format: SVG yoki shaffof PNG</span>
                      </div>
                    </div>

                    <label style={{marginTop: "16px"}}>
                      Калит сўзлар (SEO Keywords)
                      <input 
                        value={homeConfig.keywords} 
                        onChange={e => setHomeConfig({...homeConfig, keywords: e.target.value})} 
                        placeholder="vatan, ilm-fan, jurnallar, yangiliklar"
                      />
                    </label>

                    <label style={{marginTop: "16px"}}>
                      Сайт тавсифи (UZ - Lotincha)
                      <textarea 
                        rows="2" 
                        value={homeConfig.descriptionUz} 
                        onChange={e => setHomeConfig({...homeConfig, descriptionUz: e.target.value})} 
                        placeholder="Sayt haqida o'zbek tilidagi qisqacha ma'lumot (metatag)..."
                      />
                    </label>

                    <label style={{marginTop: "16px"}}>
                      Сайт тавсифи (ЎЗ - Кириллча)
                      <textarea 
                        rows="2" 
                        value={homeConfig.descriptionUzk} 
                        onChange={e => setHomeConfig({...homeConfig, descriptionUzk: e.target.value})} 
                        placeholder="Сайт ҳақида ўзбек тилида қисқача маълумот..."
                      />
                    </label>

                    <label style={{marginTop: "16px"}}>
                      Сайт тавсифи (RU - Ruscha)
                      <textarea 
                        rows="2" 
                        value={homeConfig.descriptionRu} 
                        onChange={e => setHomeConfig({...homeConfig, descriptionRu: e.target.value})} 
                        placeholder="Краткое описание сайта на русском языке..."
                      />
                    </label>
                  </div>
                </div>
              )}

              {settingsSubTab === "system" && (
                <div style={{display: "flex", flexDirection: "column", gap: "24px"}}>
                  {/* Актив Сессиялар ва Ҳолат Card */}
                  <div style={{
                    padding: "20px", 
                    background: "var(--surface)", 
                    border: "1px solid var(--line)", 
                    borderRadius: "8px",
                  }}>
                    <strong style={{color: "var(--ink)", display: "flex", alignItems: "center", gap: "8px", fontSize: "16px", marginBottom: "16px"}}>
                      💻 Актив Сессиялар ва Ҳолат
                    </strong>
                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px"}}>
                      <div>
                        <div style={{color: "var(--muted)", fontSize: "13px", marginBottom: "4px"}}>Охирги марта кирилган вақт:</div>
                        <strong style={{color: "var(--ink)", fontSize: "14px"}}>
                          {loginHistory.length > 0 
                            ? `${new Date(loginHistory[0].timestamp).toLocaleString('uz-UZ')} (${loginHistory[0].ip})`
                            : "Юкланмоқда..."
                          }
                        </strong>
                      </div>
                      <div>
                        <div style={{color: "var(--muted)", fontSize: "13px", marginBottom: "4px"}}>Аккаунт яратилган вақт:</div>
                        <strong style={{color: "var(--ink)", fontSize: "14px"}}>
                          {accountCreatedAt 
                            ? new Date(accountCreatedAt).toLocaleDateString('uz-UZ') 
                            : "Юкланмоқда..."
                          }
                        </strong>
                      </div>
                    </div>
                    
                    {/* Active IP entries details */}
                    {loginHistory.length > 0 && (
                      <div style={{marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed var(--line)"}}>
                        <div style={{fontSize: "12px", color: "var(--muted)", marginBottom: "8px", fontWeight: "600"}}>ОХИРГИ КИРИШЛАР ТАРИХИ:</div>
                        <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                          {loginHistory.slice(0, 3).map((session, i) => (
                            <div key={i} style={{display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--muted)"}}>
                              <span>🌐 IP: <strong style={{color: "var(--ink)"}}>{session.ip}</strong> - {session.device}</span>
                              <span>{new Date(session.timestamp).toLocaleString('uz-UZ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p style={{margin: "12px 0 0 0", color: "#ff4d4d", fontSize: "12px", lineHeight: "1.4"}}>
                      ⚠️ Агар аккаунтингизга бегоналар кирганиdan гумон қилсангиз, зудлик билан пастроқдаги форма орқали паролингизни ўзгартиринг!
                    </p>
                  </div>

                  {/* Паролни Ўзгартириш */}
                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Паролни ўзгартириш</h4>
                    <form onSubmit={updatePassword} className="adm-form" style={{maxWidth: "500px"}}>
                      <label>
                        Жорий парол
                        <input 
                          type="password" 
                          value={currentPassword} 
                          onChange={e => setCurrentPassword(e.target.value)} 
                          placeholder="Joriy parolni kiriting..."
                          required
                        />
                      </label>
                      <label style={{marginTop: "12px"}}>
                        Янги парол
                        <input 
                          type="password" 
                          value={newPassword} 
                          onChange={e => setNewPassword(e.target.value)} 
                          placeholder="Yangi parol (kamida 6 ta belgi)..."
                          required
                        />
                      </label>
                      <label style={{marginTop: "12px"}}>
                        Янги паролни тасдиқланг
                        <input 
                          type="password" 
                          value={confirmPassword} 
                          onChange={e => setConfirmPassword(e.target.value)} 
                          placeholder="Yangi parolni tasdiqlang..."
                          required
                        />
                      </label>
                      <button type="submit" className="adm-btn primary" style={{marginTop: "16px"}}>Паролни янгилаш</button>
                    </form>
                  </div>

                  {/* 2-босқичли ПИН-код */}
                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>2-босқичли ПИН-кодни ўзгартириш</h4>
                    <form onSubmit={updatePin} className="adm-form" style={{maxWidth: "500px"}}>
                      <label>
                        Жорий ПИН-код
                        <input 
                          type="password" 
                          value={currentPin} 
                          onChange={e => setCurrentPin(e.target.value)} 
                          placeholder="Joriy 4 xonali PIN-kod..."
                          maxLength="4"
                          required
                        />
                      </label>
                      <label style={{marginTop: "12px"}}>
                        Янги 4 хонали ПИН-код
                        <input 
                          type="password" 
                          value={newPin} 
                          onChange={e => setNewPin(e.target.value)} 
                          placeholder="Yangi 4 xonali PIN-kod..."
                          maxLength="4"
                          required
                        />
                      </label>
                      <button type="submit" className="adm-btn primary" style={{marginTop: "16px"}}>ПИН-кодни янгилаш</button>
                    </form>
                  </div>

                  {/* E'lonlar banneri */}
                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>E'lonlar banneri</h4>
                    <div style={{display: "flex", alignItems: "center", gap: "10px", margin: "8px 0 16px"}}>
                      <input 
                        type="checkbox" 
                        id="bannerActiveCheckSettings" 
                        checked={homeConfig.bannerActive} 
                        onChange={e => setHomeConfig({...homeConfig, bannerActive: e.target.checked})} 
                        style={{width: "20px", height: "20px", cursor: "pointer"}} 
                      />
                      <label htmlFor="bannerActiveCheckSettings" style={{margin: 0, cursor: "pointer", color: "var(--ink)"}}>
                        Yuqoridagi e'lonlar bannerini yoqish
                      </label>
                    </div>
                    {homeConfig.bannerActive && (
                      <label>
                        E'lon matni
                        <input 
                          value={homeConfig.bannerText} 
                          onChange={e => setHomeConfig({...homeConfig, bannerText: e.target.value})} 
                          placeholder="Tezkor xabar yoki e'lon..." 
                        />
                      </label>
                    )}
                  </div>

                  {/* Statistika Tizimi */}
                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px", marginBottom: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Статистика тизими</h4>
                    <div style={{
                      padding: "20px", 
                      background: "var(--surface)", 
                      border: "1px solid var(--line)", 
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px"
                    }}>
                      <div>
                        <strong style={{color: "var(--brand)", display: "block", fontSize: "15px", marginBottom: "4px"}}>Фойдаланувчилар статистикаси (Visitor Stats)</strong>
                        <span style={{color: "var(--muted)", fontSize: "13px"}}>Сайтнинг энг пастки қисмида онлайн фойдаланувчилар ва кунлик ташрифлар панели кўрсатилади.</span>
                      </div>
                      <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <button 
                          type="button"
                          className={`adm-btn ${homeConfig.visitorStatsActive !== false ? "primary" : "ghost"}`}
                          onClick={() => setHomeConfig({...homeConfig, visitorStatsActive: homeConfig.visitorStatsActive === false})}
                          style={{
                            minWidth: "120px",
                          }}
                        >
                          {homeConfig.visitorStatsActive !== false ? "● Ёқилган" : "○ Ўчирилган"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance Mode Card (Yellow Warning Style) */}
                  <div style={{
                    borderTop: "1px solid var(--line)", 
                    paddingTop: "16px",
                  }}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Тизим ҳолати</h4>
                    <div style={{
                      padding: "20px", 
                      background: "rgba(245, 158, 11, 0.1)", 
                      border: "1px solid rgba(245, 158, 11, 0.3)", 
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px"
                    }}>
                      <div>
                        <strong style={{color: "#f59e0b", display: "block", fontSize: "15px", marginBottom: "4px"}}>Таъмирлаш режими (Maintenance Mode)</strong>
                        <span style={{color: "var(--muted)", fontSize: "13px"}}>Ёқилган ҳолатда фақат админлар сайтга кира олади.</span>
                      </div>
                      <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <button 
                          type="button"
                          className={`adm-btn ${homeConfig.maintenanceMode ? "primary" : "ghost"}`}
                          onClick={() => toggleMaintenanceMode(!homeConfig.maintenanceMode)}
                          style={{
                            minWidth: "120px", 
                            borderColor: homeConfig.maintenanceMode ? "var(--brand)" : "rgba(245, 158, 11, 0.3)",
                            color: homeConfig.maintenanceMode ? "#fff" : "#f59e0b"
                          }}
                        >
                          {homeConfig.maintenanceMode ? "● Ёқилган" : "○ Ўчирилган"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Backup database card */}
                  <div style={{
                    borderTop: "1px solid var(--line)", 
                    paddingTop: "16px",
                  }}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Маълумотлар базасидан нусха олиш (Backup)</h4>
                    <div style={{
                      padding: "20px", 
                      background: "var(--surface)", 
                      border: "1px solid var(--line)", 
                      borderRadius: "8px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px"
                    }}>
                      <div>
                        <span style={{color: "var(--muted)", fontSize: "13px"}}>Барча мақолалар, рукнлар ва муаллифларни JSON форматида юклаб олиш.</span>
                      </div>
                      <div style={{display: "flex", gap: "10px"}}>
                        <button 
                          type="button" 
                          className="adm-btn primary" 
                          onClick={() => {
                            const data = { exportedAt: new Date().toISOString(), stories: allStories };
                            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a'); a.href = url;
                            a.download = `ishonch_uz-backup-${new Date().toISOString().split('T')[0]}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                            notify("📥 Eksport yuklandi", "success");
                          }}
                        >
                          📥 JSON шаклида кўчириб олиш
                        </button>
                        
                        <button 
                          type="button" 
                          className="adm-btn ghost" 
                          onClick={() => importFileRef.current?.click()}
                        >
                          Импорт қилиш
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* CMS system info */}
                  <div style={{borderTop: "1px solid var(--line)", paddingTop: "16px"}}>
                    <h4 style={{margin: "0 0 16px 0", color: "var(--ink)"}}>Tizim ma'lumotlari</h4>
                    <div style={{fontSize: "13px", lineHeight: "2", color: "var(--muted)", background: "var(--surface)", border: "1px solid var(--line)", padding: "12px", borderRadius: "6px", maxWidth: "400px"}}>
                      <div>CMS Versiya: <strong style={{color: "var(--ink)"}}>v2.0.0 (Upgraded)</strong></div>
                      <div>Ishlash tartibi: <strong style={{color: "var(--ink)"}}>Node JS Backend + JSON DB</strong></div>
                      <div>Tillar: <strong style={{color: "var(--ink)"}}>UZ (Lotin), ЎЗ (Кирилл), RU (Русский)</strong></div>
                      <div>Sessiya vaqti: <strong style={{color: "var(--ink)"}}>12 soat</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons at the bottom right */}
              <div style={{
                display: "flex", 
                justifyContent: "flex-end", 
                gap: "12px", 
                marginTop: "30px", 
                borderTop: "1px solid var(--line)", 
                paddingTop: "20px"
              }}>
                <button 
                  type="submit" 
                  className="adm-btn primary" 
                  style={{minWidth: "120px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px"}}
                >
                  💾 Сақлаш
                </button>
              </div>
            </form>


          </div>
        )}

        {/* --- 🔍 TAB: SEO HEALTH --- */}
        {activeTab === "seo" && (
          <div className="adm-seo-dashboard" style={{color: "var(--ink)"}}>
            {/* Header */}
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px"}}>
              <div>
                <h2 style={{margin: 0, fontSize: "28px", fontWeight: "600"}}>SEO Назоратчи (SEO Health Score)</h2>
                <p style={{margin: "4px 0 0 0", color: "var(--muted)", fontSize: "14px"}}>
                  Тизимдаги глобал созламалар ва барча мақолаларнинг қидирув тизимларига мослигини назорат қилиш ва аудит қилиш бўлими.
                </p>
              </div>
              <button
                type="button"
                className="adm-btn primary"
                disabled={generatingSeoFiles}
                onClick={generateStaticSeoFiles}
                style={{display: "flex", alignItems: "center", gap: "8px"}}
              >
                {generatingSeoFiles ? "⏳ Yaratilmoqda..." : "⚡ Static Sitemap & Robots Yaratish"}
              </button>
            </div>

            {/* Stats Cards Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "20px",
              marginBottom: "24px"
            }}>
              {/* Score Card */}
              <div className="adm-dash-section" style={{
                display: "flex", 
                alignItems: "center", 
                gap: "20px", 
                padding: "20px",
                justifyContent: "space-around"
              }}>
                <div style={{position: "relative", width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center"}}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--line)" strokeWidth="8" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      fill="none" 
                      stroke={seoAudit.globalScore >= 80 ? "var(--brand)" : seoAudit.globalScore >= 50 ? "var(--gold)" : "var(--red)"} 
                      strokeWidth="8" 
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - seoAudit.globalScore / 100)}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <strong style={{
                    position: "absolute", 
                    fontSize: "22px", 
                    fontWeight: "700",
                    color: "var(--ink)"
                  }}>{seoAudit.globalScore}%</strong>
                </div>
                <div>
                  <h4 style={{margin: "0 0 4px 0", color: "var(--muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px"}}>Умумий SEO Ҳолат</h4>
                  <strong style={{
                    fontSize: "18px",
                    color: seoAudit.globalScore >= 80 ? "var(--brand)" : seoAudit.globalScore >= 50 ? "var(--gold)" : "var(--red)"
                  }}>
                    {seoAudit.globalScore >= 80 ? "Аъло" : seoAudit.globalScore >= 50 ? "Қониқарли" : "Критик ҳолат"}
                  </strong>
                  <p style={{margin: "4px 0 0 0", fontSize: "11px", color: "var(--muted)"}}>Барча мақола ва созламалар асосида ҳисобланди</p>
                </div>
              </div>

              {/* Scanned Items Count Card */}
              <div className="adm-dash-section" style={{padding: "20px"}}>
                <h4 style={{margin: "0 0 12px 0", color: "var(--muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px"}}>Мақолалар Таҳлили</h4>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
                  <div>
                    <span style={{fontSize: "28px", fontWeight: "700", color: "var(--ink)"}}>{seoAudit.counts.total}</span>
                    <span style={{fontSize: "13px", color: "var(--muted)", marginLeft: "4px"}}>ta jami</span>
                  </div>
                  <div style={{fontSize: "12px", display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-end"}}>
                    <span style={{color: "var(--brand)"}}>● Yaхshi: {seoAudit.counts.good}</span>
                    <span style={{color: "var(--gold)"}}>▲ Ogohlanish: {seoAudit.counts.warnings}</span>
                    <span style={{color: "var(--red)"}}>■ Kritik: {seoAudit.counts.critical}</span>
                  </div>
                </div>
              </div>

              {/* Performance & Coverage Card */}
              <div className="adm-dash-section" style={{padding: "20px"}}>
                <h4 style={{margin: "0 0 12px 0", color: "var(--muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px"}}>Техник Аудит</h4>
                <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                  <div>
                    <div style={{display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px"}}>
                      <span>WebP format qamrovi</span>
                      <strong>{seoAudit.webpCoverage}%</strong>
                    </div>
                    <div style={{height: "6px", background: "var(--line)", borderRadius: "3px", overflow: "hidden"}}>
                      <div style={{height: "100%", width: `${seoAudit.webpCoverage}%`, background: "var(--brand)", borderRadius: "3px"}} />
                    </div>
                  </div>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", marginTop: "4px"}}>
                    <span>Static Sitemap:</span>
                    <span style={{color: "var(--brand)", fontWeight: 600}}>Faol</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Settings Check Card */}
            <div className="adm-dash-section" style={{padding: "20px", marginBottom: "24px"}}>
              <h3 style={{margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px"}}>
                ⚙️ Глобал тизим созламалари аудити
              </h3>
              {seoAudit.globalIssues.length === 0 ? (
                <div style={{
                  padding: "12px 16px",
                  background: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  borderRadius: "6px",
                  color: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "14px"
                }}>
                  <span>✓</span> Глобал SEO созламалари ва мета-тавсифлар тўлиқ ва тўғри созланган!
                </div>
              ) : (
                <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                  {seoAudit.globalIssues.map((issue, idx) => (
                    <div key={idx} style={{
                      padding: "10px 14px",
                      background: issue.severity === 'high' ? "rgba(239, 68, 68, 0.08)" : "rgba(245, 158, 11, 0.08)",
                      border: `1px solid ${issue.severity === 'high' ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
                      borderRadius: "6px",
                      color: issue.severity === 'high' ? "var(--red)" : "var(--gold)",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    }}>
                      <span>{issue.severity === 'high' ? "❌" : "⚠️"}</span>
                      {issue.text}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Database Content Audit list */}
            <div className="adm-dash-section" style={{padding: "20px", marginBottom: "24px"}}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
                marginBottom: "20px"
              }}>
                <h3 style={{margin: 0, fontSize: "18px", fontWeight: "600"}}>📚 Мақолалар қидирув тизимлари аудити</h3>
                
                {/* Filters */}
                <div style={{display: "flex", gap: "10px", alignItems: "center"}}>
                  <div className="adm-search-wrap" style={{width: "250px", marginBottom: 0}}>
                    <span>🔍</span>
                    <input
                      type="search"
                      placeholder="Sarlavha bo'yicha qidirish..."
                      value={seoSearch}
                      onChange={e => setSeoSearch(e.target.value)}
                      style={{background: "var(--background)", border: "1px solid var(--line)"}}
                    />
                  </div>
                  
                  <select 
                    value={seoFilter} 
                    onChange={e => setSeoFilter(e.target.value)}
                    style={{
                      padding: "8px 12px", 
                      borderRadius: "6px", 
                      background: "var(--surface)", 
                      border: "1px solid var(--line)", 
                      color: "var(--ink)",
                      fontSize: "13px"
                    }}
                  >
                    <option value="all">Barcha holatlar</option>
                    <option value="critical">Критик (Score &lt; 50)</option>
                    <option value="warning">Огоҳлантириш (50-79)</option>
                    <option value="good">Оптималлаштирилган (80+)</option>
                  </select>
                </div>
              </div>

              {/* Audit Table */}
              <div style={{overflowX: "auto"}}>
                <table className="adm-table" style={{width: "100%", borderCollapse: "collapse"}}>
                  <thead>
                    <tr>
                      <th style={{width: "60px"}}>Rasm</th>
                      <th>Мақола сарлавҳаси</th>
                      <th style={{width: "120px"}}>Бўлим / Тип</th>
                      <th style={{width: "80px"}}>Тил</th>
                      <th style={{width: "90px"}}>SEO Баҳо</th>
                      <th style={{width: "80px"}}>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const filtered = seoAudit.auditedItems.filter(item => {
                        const matchQ = !seoSearch || item.title.toLowerCase().includes(seoSearch.toLowerCase());
                        const matchFilter = seoFilter === "all" ||
                          (seoFilter === "critical" && item.seoScore < 50) ||
                          (seoFilter === "warning" && item.seoScore >= 50 && item.seoScore < 80) ||
                          (seoFilter === "good" && item.seoScore >= 80);
                        return matchQ && matchFilter;
                      });

                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan="6" style={{textAlign: "center", padding: "30px", color: "var(--muted)"}}>
                              Бундай филтрлар бўйича ҳеч қандай мақола топилмади.
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map(item => (
                        <tr key={item.id}>
                          <td>
                            {item.image ? (
                              <img src={item.image} alt="" style={{width: "50px", height: "35px", objectFit: "cover", borderRadius: "4px"}} />
                            ) : (
                              <span style={{fontSize: "20px"}}>🖼️</span>
                            )}
                          </td>
                          <td>
                            <div style={{fontWeight: 600, fontSize: "14px"}}>{item.title}</div>
                            {item.seoIssues.length > 0 ? (
                              <div style={{display: "flex", flexDirection: "column", gap: "3px", marginTop: "6px"}}>
                                {item.seoIssues.slice(0, 3).map((issue, idx) => (
                                  <span key={idx} style={{
                                    fontSize: "11px", 
                                    color: issue.severity === 'high' ? "var(--red)" : issue.severity === 'medium' ? "var(--gold)" : "var(--muted)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px"
                                  }}>
                                    <span>{issue.severity === 'high' ? "●" : "▲"}</span> {issue.text}
                                  </span>
                                ))}
                                {item.seoIssues.length > 3 && (
                                  <span style={{fontSize: "11px", color: "var(--muted)", fontStyle: "italic", marginLeft: "10px"}}>
                                    va yana {item.seoIssues.length - 3} ta muammo...
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span style={{color: "#10b981", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px"}}>
                                <span>✓</span> Мақола SEO жиҳатдан тўлиқ оптималлаштирилган
                              </span>
                            )}
                          </td>
                          <td>
                            <span className="badge" style={{
                              background: item.type === "video" ? "rgba(239, 68, 68, 0.15)" : item.type === "photo" ? "rgba(16, 185, 129, 0.15)" : "rgba(59, 130, 246, 0.15)",
                              color: item.type === "video" ? "var(--red)" : item.type === "photo" ? "var(--brand)" : "#3b82f6",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "11px",
                              textTransform: "uppercase"
                            }}>
                              {item.type === "story" ? "Maqola" : item.type === "video" ? "Video" : "Foto"}
                            </span>
                          </td>
                          <td>
                            <span className="badge" style={{textTransform: "uppercase", fontSize: "11px"}}>{item.lang}</span>
                          </td>
                          <td>
                            <span style={{
                              fontWeight: "700",
                              fontSize: "14px",
                              color: item.seoScore >= 80 ? "#10b981" : item.seoScore >= 50 ? "var(--gold)" : "var(--red)",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              background: item.seoScore >= 80 ? "rgba(16, 185, 129, 0.1)" : item.seoScore >= 50 ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)",
                              display: "inline-block",
                              minWidth: "45px",
                              textAlign: "center"
                            }}>{item.seoScore}%</span>
                          </td>
                          <td>
                            <button 
                              className="adm-btn ghost" 
                              onClick={() => {
                                if (item.type === 'story') {
                                  setEditingId(item.id);
                                  setForm({ ...emptyStory, ...item });
                                  setActiveTab('editor');
                                } else if (item.type === 'video') {
                                  setEditingVideoId(item.id);
                                  setVideoForm({ ...EMPTY_VIDEO, ...item });
                                  setActiveTab('videos');
                                } else if (item.type === 'photo') {
                                  setEditingPhotoId(item.id);
                                  setPhotoForm({ ...EMPTY_PHOTO, ...item });
                                  setActiveTab('photos');
                                }
                              }} 
                              style={{padding: "6px 10px", fontSize: "12px"}}
                              title="Tahrirlash"
                            >
                              ✏️ Tahrirlash
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Static Sitemap & Robots Previews */}
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px"}}>
              <div className="adm-dash-section" style={{padding: "20px"}}>
                <h3 style={{margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600"}}>xml Sitemap Preview</h3>
                <pre style={{
                  margin: 0,
                  padding: "12px",
                  background: "var(--background)",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  maxHeight: "220px",
                  overflowY: "auto",
                  color: "var(--muted)"
                }}>
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${window.location.protocol}//${window.location.host}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${seoAudit.auditedItems.slice(0, 8).map(item => `  <url>
    <loc>${window.location.protocol}//${window.location.host}/news/${item.slug || item.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")}
  <!-- ... jami ${seoAudit.counts.total} ta havola ... -->
</urlset>`}
                </pre>
              </div>

              <div className="adm-dash-section" style={{padding: "20px"}}>
                <h3 style={{margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600"}}>robots.txt Preview</h3>
                <pre style={{
                  margin: 0,
                  padding: "12px",
                  background: "var(--background)",
                  border: "1px solid var(--line)",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  maxHeight: "220px",
                  overflowY: "auto",
                  color: "var(--muted)"
                }}>
{`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${window.location.protocol}//${window.location.host}/sitemap.xml`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --- CROPPER MODAL --- */}
      {cropSrc && (
        <div className="adm-crop-modal">
          <div className="adm-crop-content">
            <h3>Rasm o'lchamini moslashtirish (16:9)</h3>
            <div className="adm-crop-canvas-wrap">
              <canvas ref={cropCanvasRef} width="640" height="360" />
            </div>
            <div className="adm-crop-sliders">
              <div className="slider-row">
                <span>Scale:</span>
                <input type="range" min="50" max="250" value={cropSliders.scale} onChange={e => setCropSliders(p => ({ ...p, scale: Number(e.target.value) }))} />
                <span className="val">{cropSliders.scale}%</span>
              </div>
              <div className="slider-row">
                <span>Horizontal (X):</span>
                <input type="range" min="-50" max="50" value={cropSliders.x} onChange={e => setCropSliders(p => ({ ...p, x: Number(e.target.value) }))} />
                <span className="val">{cropSliders.x}</span>
              </div>
              <div className="slider-row">
                <span>Vertical (Y):</span>
                <input type="range" min="-50" max="50" value={cropSliders.y} onChange={e => setCropSliders(p => ({ ...p, y: Number(e.target.value) }))} />
                <span className="val">{cropSliders.y}</span>
              </div>
            </div>
            <div className="adm-crop-actions">
              <button type="button" className="adm-btn ghost" onClick={() => setCropSrc(null)}>✕ Bekor qilish</button>
              <button type="button" className="adm-btn primary" onClick={handleCropUpload}>✂️ Qirqish va Yuklash</button>
            </div>
          </div>
        </div>
      )}

      {activeMediaSelector && (
        <div className="adm-modal-overlay" style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "20px"
        }}>
          <div className="adm-modal-card" style={{
            background: "var(--surface)",
            border: "1px solid var(--line)",
            borderRadius: "12px",
            width: "100%",
            maxWidth: "800px",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            overflow: "hidden"
          }}>
            <div className="adm-modal-header" style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{margin: 0, color: "var(--ink)"}}>🖼️ Медиа кутубхонадан танлаш</h3>
              <button 
                type="button" 
                onClick={() => setActiveMediaSelector(null)}
                style={{
                  background: "none",
                  border: 0,
                  color: "var(--muted)",
                  fontSize: "20px",
                  cursor: "pointer",
                  padding: "4px"
                }}
              >✕</button>
            </div>
            
            <div className="adm-modal-body" style={{
              padding: "20px",
              overflowY: "auto",
              flex: 1
            }}>
              <div style={{marginBottom: "15px", display: "flex", gap: "10px"}}>
                <span style={{color: "var(--muted)", fontSize: "13px"}}>Файлни танлаш учун унинг устига босинг:</span>
              </div>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                gap: "12px"
              }}>
                {mediaFiles.map(file => (
                  <div 
                    key={file.name} 
                    onClick={() => selectMediaFile(file.url)}
                    style={{
                      border: "1px solid var(--line)",
                      borderRadius: "8px",
                      overflow: "hidden",
                      background: "var(--background)",
                      cursor: "pointer",
                      transition: "transform 0.15s, border-color 0.15s",
                      position: "relative"
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = "var(--brand)";
                      e.currentTarget.style.transform = "scale(1.02)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = "var(--line)";
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    {file.type === "image" ? (
                      <img src={file.url} alt="" style={{width: "100%", height: "80px", objectFit: "cover"}} />
                    ) : (
                      <div style={{height: "80px", display: "flex", alignItems: "center", justifyContent: "center", background: "#000", color: "#fff", fontSize: "20px"}}>🎥</div>
                    )}
                    <div style={{padding: "6px", fontSize: "10px", color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center"}}>
                      {file.name}
                    </div>
                  </div>
                ))}
                
                {mediaFiles.length === 0 && (
                  <div style={{gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--muted)"}}>
                    Кутубхона бўш. Аввал медиа кутубхона бўлимига кириб расм юкланг.
                  </div>
                )}
              </div>
            </div>
            
            <div className="adm-modal-footer" style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--line)",
              display: "flex",
              justifyContent: "flex-end",
              background: "var(--background)"
            }}>
              <button 
                type="button" 
                className="adm-btn ghost" 
                onClick={() => setActiveMediaSelector(null)}
              >Ёпиш</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function AdBanner({ ads, position }) {
  const active = (ads || []).filter(a => a.active && a.position === position);
  if (!active.length) return null;
  const ad = active[Math.floor(Date.now() / 30000) % active.length];
  if (!ad) return null;

  useEffect(() => {
    if (ad && ad.id) {
      fetch((import.meta.env.VITE_API_URL || "") + `/api/ads/impression/${ad.id}`, { method: "POST" }).catch(() => null);
    }
  }, [ad.id]);

  const handleAdClick = () => {
    if (ad && ad.id) {
      fetch((import.meta.env.VITE_API_URL || "") + `/api/ads/click/${ad.id}`, { method: "POST" }).catch(() => null);
    }
  };

  const sizes = {
    top:     { height: 90, label: "728×90 Leaderboard" },
    bottom:  { height: 90, label: "728×90 Leaderboard" },
    sidebar: { height: 250, label: "300×250 Rectangle" },
    inline:  { height: 100, label: "468×100 Banner" },
  };
  const sz = sizes[position] || sizes.inline;

  return (
    <div className={`ad-banner ad-banner-${position}`}>
      <span className="ad-label">Reklama</span>
      {ad.link ? (
        <a href={ad.link} target="_blank" rel="noopener noreferrer" className="ad-inner" onClick={handleAdClick} style={{minHeight: sz.height}}>
          {ad.image ? (
            <img src={ad.image} alt={ad.title || "Reklama"} />
          ) : (
            <div className="ad-text-banner">
              {ad.title && <strong>{ad.title}</strong>}
              {ad.subtitle && <span>{ad.subtitle}</span>}
            </div>
          )}
        </a>
      ) : (
        <div className="ad-inner" style={{minHeight: sz.height}}>
          {ad.image ? (
            <img src={ad.image} alt={ad.title || "Reklama"} />
          ) : (
            <div className="ad-text-banner">
              {ad.title && <strong>{ad.title}</strong>}
              {ad.subtitle && <span>{ad.subtitle}</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Footer({ t, pages, setPage, openAdmin, siteConfig, lang }) {
  const year = new Date().getFullYear();
  if (!siteConfig) return null;
  
  let description = siteConfig.descriptionUz || "Ishonch.uz. O'zbekiston yangiliklari portali. Tezkor, ishonchli, mustaqil.";
  if (lang === "ru") {
    description = siteConfig.descriptionRu || "Ishonch.uz. Портал новостей Узбекистана. Быстро, надежно, независимо.";
  } else if (lang === "uzk") {
    description = siteConfig.descriptionUzk || siteConfig.descriptionUz || "Ишонч.уз. Ўзбекистон янгиликлари портали. Тезкор, ишончли, мустақил.";
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#fff" }}>
            <Logo height={42} logoUrl={siteConfig.footerLogoUrl || siteConfig.logoUrl} siteName={siteConfig.siteName} textColor="#ffffff" forceSvg={!siteConfig.footerLogoUrl} />
          </div>
          <p>{description}</p>
          <div className="footer-socials">
            {siteConfig.telegram && <a href={siteConfig.telegram} target="_blank" rel="noopener" title="Telegram">✈</a>}
            {siteConfig.instagram && <a href={siteConfig.instagram} target="_blank" rel="noopener" title="Instagram">📷</a>}
            {siteConfig.youtube && <a href={siteConfig.youtube} target="_blank" rel="noopener" title="YouTube">▶</a>}
            {siteConfig.facebook && <a href={siteConfig.facebook} target="_blank" rel="noopener" title="Facebook">f</a>}
          </div>
        </div>
        <div className="footer-nav">
          <div className="footer-links">
            {(lang === "ru" ? [
              { label: "О сайте", page: pages[pages.length - 1] },
              { label: "Реклама", page: pages[pages.length - 1] },
              { label: "Команда Ishonch", page: pages[pages.length - 1] }
            ] : lang === "uzk" ? [
              { label: "Сайт ҳақида", page: pages[pages.length - 1] },
              { label: "Реклама", page: pages[pages.length - 1] },
              { label: "Ishonch жамоаси", page: pages[pages.length - 1] }
            ] : [
              { label: "Sayt haqida", page: pages[pages.length - 1] },
              { label: "Reklama", page: pages[pages.length - 1] },
              { label: "Ishonch jamoasi", page: pages[pages.length - 1] }
            ]).map((item) => (
              <button key={item.label} onClick={() => setPage(item.page)}>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="footer-copy">
          <span>© {year} {siteConfig.siteName}. Barcha huquqlar himoyalangan.</span>
          {siteConfig.email && <span>{siteConfig.email}</span>}
        </div>
      </div>
    </footer>
  );
}


function VideoPage({ lang, items = [], onOpen }) {
  const isUz = lang !== "ru";
  const videoItems = items.filter(([type]) => type === "video");
  const featured = videoItems[0];
  const rest = videoItems.slice(1);

  if (!videoItems.length) {
    return (
      <main className="section">
        <div className="section-inner" style={{textAlign: "center", padding: "80px 20px"}}>
          <span>🎥</span>
          <h2 style={{marginTop: "16px"}}>{isUz ? "Hozircha videolar yo'q" : "Видео пока отсутствуют"}</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="section-inner">
        <div className="category-masthead">
          <span>{isUz ? "Yangiliklar portali" : "Портал новостей"}</span>
          <h1>{isUz ? "Video gallereyasi" : "Видеогалерея"}</h1>
          <p>{isUz ? "Kunning eng muhim videolari va sharhlari" : "Самые важные видео дня и видеообзоры"}</p>
        </div>

        <div style={{display: "flex", flexDirection: "column", gap: "32px", marginTop: "32px"}}>
          {/* Main featured video */}
          <article className="media-featured" style={{cursor: "pointer", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", overflow: "hidden", display: "grid", gridTemplateColumns: "3fr 2fr"}} onClick={() => {
            if (onOpen) {
              onOpen({
                id: featured[9] || featured[1],
                type: "video",
                title: featured[1],
                time: featured[2] ? (featured[2].split("|")[1] || "").trim() : "",
                category: featured[2] ? (featured[2].split("|")[0] || "").trim() : (isUz ? "Video" : "Видео"),
                image: featured[3],
                url: featured[4],
                summary: featured[5] || "",
                body: featured[6] || "",
                author: featured[7] || "Ishonch.uz tahririyati",
                views: featured[8] || 0
              });
            }
          }}>
            <div className="media-featured-thumb" style={{position: "relative", paddingTop: "56.25%", height: 0, overflow: "hidden"}}>
              <img src={featured[3]} alt="" style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover"}} />
              <div className="media-featured-overlay" style={{position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)"}} />
              <span className="media-featured-icon video" style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "64px", height: "64px", background: "var(--brand)", color: "#fff", display: "grid", placeItems: "center", borderRadius: "50%", fontSize: "24px", fontWeight: "bold"}}>▶</span>
              <div className="media-featured-meta" style={{position: "absolute", bottom: "16px", left: "16px", display: "flex", gap: "10px", alignItems: "center"}}>
                <span className="media-type-badge video" style={{background: "#ff3b30", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: 700}}>{isUz ? "Video" : "Видео"}</span>
                <span style={{color: "#fff", fontSize: "13px"}}>{featured[2]}</span>
              </div>
            </div>
            <div className="media-featured-body" style={{padding: "24px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
              <strong style={{fontSize: "22px", lineHeight: "1.4", color: "var(--ink)", display: "block"}}>{featured[1]}</strong>
              <button className="media-play-btn" style={{alignSelf: "flex-start", background: "var(--brand)", color: "#fff", border: 0, padding: "10px 20px", borderRadius: "8px", fontWeight: 700, cursor: "pointer"}} type="button">{isUz ? "Tomosha qilish →" : "Смотреть →"}</button>
            </div>
          </article>

          {/* Rest of the videos grid */}
          <div className="media-v2-grid" style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px"}}>
            {rest.map(([t, itemTitle, meta, image, url, summary, body, author, views, id]) => (
              <article className="media-list-item" key={itemTitle} style={{background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer"}} onClick={() => {
                if (onOpen) {
                  onOpen({
                    id: id || itemTitle,
                    type: "video",
                    title: itemTitle,
                    time: meta ? (meta.split("|")[1] || "").trim() : "",
                    category: meta ? (meta.split("|")[0] || "").trim() : (isUz ? "Video" : "Видео"),
                    image: image,
                    url: url,
                    summary: summary || "",
                    body: body || "",
                    author: author || "Ishonch.uz tahririyati",
                    views: views || 0
                  });
                }
              }}>
                <div style={{position: "relative", paddingTop: "56.25%", overflow: "hidden"}}>
                  <img src={image} alt="" style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover"}} />
                  <span style={{position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "44px", height: "44px", background: "var(--brand)", color: "#fff", display: "grid", placeItems: "center", borderRadius: "50%", fontSize: "16px"}}>▶</span>
                </div>
                <div style={{padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                  <strong style={{fontSize: "15px", lineHeight: "1.4", color: "var(--ink)", display: "block", marginBottom: "8px", fontWeight: 700}}>{itemTitle}</strong>
                  <small style={{fontSize: "12px", color: "var(--muted)"}}>{meta}</small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
