const http = require("http");
require('dotenv').config();
const { Storage } = require('@google-cloud/storage');
const fs = require("fs");
let gcsBucket = null;
try {
  if (process.env.GCS_BUCKET_NAME) {
    console.log("GCS BUCKET PRESENT");
    if (!process.env.GCS_CLIENT_EMAIL) console.log("GCS_CLIENT_EMAIL IS MISSING!");
    if (!process.env.GCS_PRIVATE_KEY) console.log("GCS_PRIVATE_KEY IS MISSING!");
    
    const opts = {};
    if (process.env.GCS_CLIENT_EMAIL && process.env.GCS_PRIVATE_KEY) {
      console.log("BOTH CREDENTIALS PRESENT");
      let pKey = process.env.GCS_PRIVATE_KEY || '';
      if (pKey.startsWith('"') && pKey.endsWith('"')) pKey = pKey.slice(1, -1);
      pKey = pKey.replace(/\\n/g, '\n');
      const match = pKey.match(/-----BEGIN PRIVATE KEY-----([\\s\\S]+)-----END PRIVATE KEY-----/);
      if (match) {
        const b64 = match[1].replace(/\\s+/g, '');
        const chunks = b64.match(/.{1,64}/g) || [];
        pKey = "-----BEGIN PRIVATE KEY-----\\n" + chunks.join('\\n') + "\\n-----END PRIVATE KEY-----\\n";
      }
      opts.projectId = process.env.GCS_PROJECT_ID;
      opts.credentials = {
        client_email: process.env.GCS_CLIENT_EMAIL,
        private_key: pKey
      };
    } else {
      console.log("WARNING: Proceeding without opts.credentials");
    }
    const storage = new Storage(opts);
    gcsBucket = storage.bucket(process.env.GCS_BUCKET_NAME);
  }
} catch(e) { console.error("GCS init error:", e.message); }

let isGcsUploading = false;
let pendingGcsUpload = false;
async function processGcsUpload() {
  if (!gcsBucket) return;
  if (isGcsUploading) {
    pendingGcsUpload = true;
    return;
  }
  isGcsUploading = true;
  pendingGcsUpload = false;
  try {
    await gcsBucket.upload(dbPath, { destination: "db.json", contentType: "application/json" });
  } catch(e) {
    console.error("GCS upload db.json error:", e.message);
  } finally {
    isGcsUploading = false;
    if (pendingGcsUpload) processGcsUpload();
  }
}

const path = require("path");
const crypto = require("crypto");

const preferredPort = Number(process.env.PORT || 5173);
const root = __dirname;
const dataDir = path.join(root, "data");
const uploadDir = path.join(root, "uploads");
const dbPath = path.join(dataDir, "db.json");
const sessionTtlMs = 1000 * 60 * 60 * 12;
const sessions = new Map();
const activeVisitors = new Map();


const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jsx": "text/jsx; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mov": "video/quicktime",
};

const IMAGE_EXTS = new Set([".png",".jpg",".jpeg",".webp",".gif"]);
const VIDEO_EXTS = new Set([".mp4",".webm",".ogg",".mov"]);

const seedStories = {
  uz: [
    story("Siyosat", "Hududlarda ochiq budjet muhokamalari yangi tartibda o'tkaziladi", "Mahalliy kengashlar fuqarolar takliflarini ko'rib chiqish uchun raqamli jadval e'lon qiladi.", "Dilnoza Karimova", "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80"),
    story("Iqtisod", "Kichik biznes uchun eksport maslahat markazlari ishga tushmoqda", "Yangi xizmat mahsulot sertifikati, logistika va xorijiy bozor talablari bo'yicha yordam beradi.", "Akmal Saidov", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"),
    story("Texnologiya", "Universitet laboratoriyasida mahalliy AI yordamchisi sinovdan o'tkazildi", "Loyiha o'zbek tilidagi savol-javob, hujjat tahlili va ta'lim jarayoniga moslashishga qaratilgan.", "Shahlo Nazarova", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"),
    story("Sport", "Milliy chempionatning bahorgi bosqichi kutilmagan natijalar bilan boshlandi", "Yosh futbolchilar asosiy tarkibda ko'proq maydonga tushmoqda, murabbiylar rotatsiyani oshirdi.", "Jasur Tursunov", "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80"),
    story("Madaniyat", "Shahar teatrlarida yosh rejissyorlar haftaligi ochildi", "Dasturda eksperimental sahna asarlari, ochiq suhbatlar va mahorat darslari bor.", "Malika Qodirova", "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80"),
    story("Tahlil", "Shahar transportida raqamli to'lovlar nega tez ommalashmoqda?", "Mutaxassislar qulaylik, monitoring va tarif siyosati o'rtasidagi bog'liqlikni izohlaydi.", "Zafar Jo'rayev", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80"),
  ],
  ru: [
    story("Политика", "Обсуждения открытого бюджета в регионах пройдут по обновленным правилам", "Местные советы будут публиковать цифровой график рассмотрения предложений граждан.", "Дильноза Каримова", "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80"),
    story("Экономика", "Для малого бизнеса запускают консультационные центры по экспорту", "Сервис поможет с сертификатами, логистикой и требованиями зарубежных рынков.", "Акмаль Саидов", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"),
    story("Технологии", "В университетской лаборатории протестировали локального AI-помощника", "Проект ориентирован на вопросы на узбекском языке, анализ документов и образовательные сценарии.", "Шахло Назарова", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"),
    story("Спорт", "Весенний этап национального чемпионата начался с неожиданных результатов", "Молодые игроки чаще выходят в основном составе, тренеры активнее используют ротацию.", "Жасур Турсунов", "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80"),
    story("Культура", "В городских театрах открылась неделя молодых режиссеров", "В программе экспериментальные постановки, открытые дискуссии и мастер-классы.", "Малика Кадырова", "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80"),
    story("Аналитика", "Почему цифровая оплата быстро распространяется в городском транспорте?", "Эксперты объясняют связь между удобством, мониторингом и тарифной политикой.", "Зафар Джураев", "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80"),
  ],
};

function story(category, title, summary, author, image) {
  return {
    id: crypto.randomUUID(),
    category,
    title,
    summary,
    image,
    author,
    time: "Bugun",
    read: "4 daqiqa",
    body: `${summary} Tahririyat ushbu mavzuni kuzatishda davom etadi va yangi tafsilotlar paydo bo'lishi bilan materialni yangilaydi.`,
    status: "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, saved) {
  if (!saved.includes(":")) return password === saved;
  const [salt, hash] = saved.split(":");
  const testHash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(testHash, "hex"));
}

function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function ensureDb() {
  fs.mkdirSync(dataDir, { recursive: true });
  fs.mkdirSync(uploadDir, { recursive: true });
  if (!fs.existsSync(dbPath)) {
    let initialStories = seedStories;
    const storiesJsonPath = path.join(__dirname, "stories.json");
    if (fs.existsSync(storiesJsonPath)) {
      try {
        const storiesData = JSON.parse(fs.readFileSync(storiesJsonPath, "utf8"));
        if (storiesData && storiesData.stories) {
          initialStories = storiesData.stories;
        }
      } catch (e) {
        console.error("Error reading stories.json for seeding:", e);
      }
    }
    writeDb({
      admin: { passwordHash: hashPassword("admin2026") },
      stories: initialStories,
      quotes: [],
      journals: [],
      messages: [],
      comments: [],
      tags: [],
      pages: [],
      authors: [],
      subscribers: [],
      payments: [],
      sentNewsletters: [],
      visitorStats: {
        date: new Date().toISOString().split("T")[0],
        visits: 0,
        actions: 0,
        totalTimeSpent: 0,
        visitors: {}
      }
    });
  }
}

function readDb() {
  ensureDb();
  const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
  let modified = false;

  if (!db.admin) {
    db.admin = {};
    modified = true;
  }
  if (!db.admin.passwordHash) {
    db.admin.passwordHash = hashPassword("admin2026");
    modified = true;
  }
  if (!db.admin.createdAt) {
    db.admin.createdAt = "2026-06-01T10:00:00.000Z";
    modified = true;
  }
  if (!db.admin.pin) {
    db.admin.pin = hashPassword("1234");
    modified = true;
  }
  if (!db.loginHistory) {
    db.loginHistory = [];
    modified = true;
  }

  const collections = ["quotes", "journals", "messages", "comments", "tags", "pages", "authors", "subscribers", "payments", "sentNewsletters", "videos"];
  collections.forEach(col => {
    if (!db[col]) {
      db[col] = [];
      modified = true;
    }
  });

  // Ensure visitor stats are active and reset daily
  const today = new Date().toISOString().split("T")[0];
  if (!db.visitorStats || db.visitorStats.date !== today) {
    db.visitorStats = {
      date: today,
      visits: 0,
      actions: 0,
      totalTimeSpent: 0,
      visitors: {}
    };
    modified = true;
  }


  // Seeding default videos if empty
  if (!db.videos || db.videos.length === 0) {
    db.videos = [
      { id: "v-1", type: "video", title: "Dunyoda nechta AES bor va ularning birinchisi qayerda qurilgan?", meta: "Jahon | 09:38", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-2", type: "video", title: "Marg'ilonda yangi turizm majmuasi va 7 millionga yaqinlashgan o'rtacha ish haqi", meta: "O'zbekiston | 19:50", image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-3", type: "video", title: "Aksiyadorlardan qarzdorlik, kompensatsiya masalasi sudlashyaptimi?", meta: "O'zbekiston | 19:00", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-4", type: "video", title: "LIVE: Vashingtondagi otishma va Moskvaga borgan Aroqcchi", meta: "Jahon | 15:07", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-5", type: "video", title: "Putin-Aroqcchi uchrashuvi, Eron taklifi va kun dayjesti", meta: "Jahon | 14:48", image: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-6", type: "video", title: "Tramp suiqasddan omon chiqdi, yana!", meta: "Jahon | 22:19", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uz" },
      { id: "v-7", type: "video", title: "Дунёда нечта АЕС бор ва уларнинг биринчиси қаерда қурилган?", meta: "Дунё | 09:38", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-8", type: "video", title: "Марғилонда янги туризм мажмуаси ва ўртача иш ҳақи", meta: "Ўзбекистон | 19:50", image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-9", type: "video", title: "Акциядорлардан қарздорлик ва компенсация", meta: "Ўзбекистон | 19:00", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-10", type: "video", title: "LIVE: Вашингтондаги отишма ва Москвага борган Ароқччи", meta: "Дунё | 15:07", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-11", type: "video", title: "Путин-Ароқччи учрашуви, Эрон таклифи ва кун дайжести", meta: "Дунё | 14:48", image: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-12", type: "video", title: "Трамп суиқасддан омон чиқди", meta: "Дунё | 22:19", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "uzk" },
      { id: "v-13", type: "video", title: "Сколько в мире АЭС и где построили первую?", meta: "Мир | 09:38", image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" },
      { id: "v-14", type: "video", title: "Новый туристический комплекс и рынок труда", meta: "Узбекистан | 19:50", image: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" },
      { id: "v-15", type: "video", title: "Долги перед акционерами и компенсации", meta: "Узбекистан | 19:00", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" },
      { id: "v-16", type: "video", title: "LIVE: стрельба в Вашингтоне и переговоры в Москве", meta: "Мир | 15:07", image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" },
      { id: "v-17", type: "video", title: "Встреча Путина, предложение Ирана и дайджест", meta: "Мир | 14:48", image: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" },
      { id: "v-18", type: "video", title: "Трамп пережил покушение", meta: "Мир | 22:19", image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", lang: "ru" }
    ];
    modified = true;
  }

  // Seeding default photos if empty
  if (!db.photos || db.photos.length === 0) {
    db.photos = [
      // UZ (Latin)
      {
        id: "ph-1",
        type: "photo",
        title: "Egnidagi formasiga ishonib qolibman: YHXB inspektori odamlarni chuv tushirdi",
        meta: "O'zbekiston | 17:00",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
        lang: "uz",
        summary: "YHXB formasidan foydalangan soxta inspektor bir qancha fuqarolarning ishonchiga kirib, ularni firibgarlik yo'li bilan chuv tushirgan.",
        body: "<p>Egnidagi YHXB formasidan foydalanib, o'zini inspektor sifatida tanishtirgan shaxs aniqlandi. U fuqarolar ishonchiga kirib, ularni firibgarlik yo'li bilan chuv tushirgan.</p><p>Hozirda mazkur holat yuzasidan surishtiruv ishlari olib borilmoqda. Tahririyatimiz barchani hushyorlikka chaqiradi.</p>",
        author: "Ishonch.uz tahririyati",
        views: 245
      },
      {
        id: "ph-2",
        type: "photo",
        title: "Imperiyalar qabristoni: nega yirik davlatlar Afg'onistonni bo'ysundira olmagan?",
        meta: "Jahon | 11:34",
        image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80",
        lang: "uz",
        summary: "Tarix davomida Buyuk Britaniya, SSSR va AQSh kabi imperiyalar Afg'onistonda qanday qiyinchiliklarga duch kelgani va nega uni nazorat qila olmagani tahlili.",
        body: "<p>Afg'oniston hududi azaldan imperiyalar to'qnashuvi nuqtasi bo'lib kelgan. Geografik murakkabliklar va mahalliy xalqlarning jangovarligi tufayli hech bir yirik imperiya bu erni uzoq muddat o'ziga bo'ysundira olmagan.</p><p>Tarixiy manbalar va ekspertlar fikriga ko'ra, Afg'onistonning strategik ahamiyati yuqori bo'lsa-da, uni boshqarish juda katta xarajat va talofatlarga olib kelgan.</p>",
        author: "Tahlilchi Shokir Alimov",
        views: 189
      },
      {
        id: "ph-3",
        type: "photo",
        title: "Samarqandda xalqaro madaniyat festivali: yorqin lahzalar",
        meta: "Madaniyat | 13:20",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
        lang: "uz",
        summary: "Samarqand shahrida o'tkazilgan xalqaro madaniy festival doirasidagi eng yorqin va unutilmas fotolar to'plami.",
        body: "<p>Samarqanddagi festivalda dunyoning 50 dan ortiq davlatidan kelgan san'atkorlar va sayyohlar ishtirok etdilar. Rang-barang milliy liboslar, musiqiy chiqishlar va hunarmandchilik namunalari festivalga o'zgacha shukuh bag'ishladi.</p><p>Ushbu fotoreportajimiz orqali tadbirning eng go'zal daqiqalarini his eting.</p>",
        author: "Fotojurnalist Kamoliddin Yoqubov",
        views: 412
      },
      {
        id: "ph-4",
        type: "photo",
        title: "Toshkentning yangi ko'rinishi: shahar qurilishlari fotoreportaj",
        meta: "O'zbekiston | 10:45",
        image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
        lang: "uz",
        summary: "Poytaxtimiz Toshkent shahrida amalga oshirilayotgan yirik shaharsozlik va qurilish loyihalarining foto-sharhi.",
        body: "<p>Toshkent shahrida so'nggi yillarda qurilish ko'lami keskin oshdi. Zamonaviy ko'p qavatli binolar, yangi yo'llar va istirohat bog'lari shahar qiyofasini butunlay o'zgartirmoqda.</p><p>Qurilish jarayonlari va yangilangan hududlar suratlarini taqdim etamiz.</p>",
        author: "Ishonch.uz tahririyati",
        views: 310
      },
      {
        id: "ph-5",
        type: "photo",
        title: "Tog' va tabiat: O'zbekiston manzaralari",
        meta: "Tabiat | 08:30",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80",
        lang: "uz",
        summary: "O'zbekistonning so'lim go'shalari, betakror tog' cho'qqilari va toza tabiat manzaralari aks etgan suratlar.",
        body: "<p>Mamlakatimiz tog'li hududlari yilning barcha fasllarida o'zgacha chiroy ochadi. Chorvoq tog'lari, Chimyon cho'qqilari va Zominning archazorlari sayyohlar uchun ayni muddaodir.</p><p>Tabiatimiz go'zalligidan bahramand bo'ling.</p>",
        author: "Sohibjon Qodirov",
        views: 521
      },
      {
        id: "ph-6",
        type: "photo",
        title: "Yoshlar forumi: ishtirokchilar va g'oyalar",
        meta: "Jamiyat | 16:00",
        image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
        lang: "uz",
        summary: "Toshkentda yoshlarning innovatsion g'oyalari va startap loyihalari taqdimoti bo'lib o'tdi.",
        body: "<p>Respublika miqyosida o'tkazilgan yoshlar forumida 1000 dan ortiq iqtidorli yigit-qizlar o'z g'oyalari va startaplari bilan qatnashdilar. Forum doirasida eng yaxshi loyihalar moliyalashtirildi.</p>",
        author: "Maftuna Zokirova",
        views: 290
      },
      {
        id: "ph-7",
        type: "photo",
        title: "Xayriya aksiyasi: minglab oilalarga yordam yetkazildi",
        meta: "Jamiyat | 11:00",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
        lang: "uz",
        summary: "Mamlakatimiz bo'ylab o'tkazilgan xayriya tadbirida minglab ehtiyojmand oilalarga oziq-ovqat va kiyim-kechaklar tarqatildi.",
        body: "<p>Saxovatpesha tadbirkorlar va ko'ngillilar ko'magida muhtoj oilalar holidan xabar olindi. Bu kabi xayriya tadbirlari jamiyatimizda birdamlikni kuchaytiradi.</p>",
        author: "Ishonch.uz tahririyati",
        views: 198
      },
      {
        id: "ph-8",
        type: "photo",
        title: "Milliy kiyim kuni: an'anaviy liboslar namoyishi",
        meta: "Madaniyat | 09:15",
        image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=900&q=80",
        lang: "uz",
        summary: "O'zbek atlas va adraslaridan tikilgan milliy kiyimlar ko'rgazmasi va urf-odatlar namoyishi.",
        body: "<p>Milliy kiyimlarimiz xalqimiz tarixi va madaniyatini aks ettiradi. Ko'rgazmada qadimiy andozalar asosida yaratilgan liboslar yig'ilganlarda katta qiziqish uyg'otdi.</p>",
        author: "Nilufar Yo'ldosheva",
        views: 387
      },

      // UZK (Cyrillic)
      {
        id: "ph-9",
        type: "photo",
        title: "Инспектор формасидан фойдаланиб одамларни алдади",
        meta: "Ўзбекистон | 17:00",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
        lang: "uzk",
        summary: "ЙҲХБ формасидан фойдаланган сохта инспектор аниқланди.",
        body: "<p>Эгнидаги ЙҲХБ формасидан фойдаланиб, ўзини инспектор сифатида таништирган шахс аниқланди.</p>",
        author: "Ishonch.uz таҳририяти",
        views: 112
      },
      {
        id: "ph-10",
        type: "photo",
        title: "Империялар қабристони: нега Афғонистон бўйсундирилмади?",
        meta: "Дунё | 11:34",
        image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80",
        lang: "uzk",
        summary: "Нега йирик давлатлар Афғонистонни бўйсундира олмаганлиги таҳлили.",
        body: "<p>Тарих давомида ҳеч бир йирик империя бу ерни узоқ муддат ўзига бўйсундира олмаган.</p>",
        author: "Таҳлилчи Шокир Алимов",
        views: 95
      },
      {
        id: "ph-11",
        type: "photo",
        title: "Самарқандда халқаро маданият фестивали",
        meta: "Маданият | 13:20",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
        lang: "uzk",
        summary: "Самарқандда ўтказилган халқаро маданий фестивалдан фоторепортаж.",
        body: "<p>Фестивалда дунёнинг 50 дан ортиқ давлатидан келган санъаткорлар иштирок этдилар.</p>",
        author: "Фотожурналист Камолиддин Ёқубов",
        views: 204
      },
      {
        id: "ph-12",
        type: "photo",
        title: "Тошкентнинг янги кўриниши: фоторепортаж",
        meta: "Ўзбекистон | 10:45",
        image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
        lang: "uzk",
        summary: "Пойтахтимизда амалга оширилаётган йирик қурилиш лойиҳалари.",
        body: "<p>Тошкент шаҳрида сўнгги йилларда қурилиш кўлами кескин ошди.</p>",
        author: "Ishonch.uz таҳририяти",
        views: 153
      },
      {
        id: "ph-13",
        type: "photo",
        title: "Тоғ ва табиат: Ўзбекистон манзаралари",
        meta: "Табиат | 08:30",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80",
        lang: "uzk",
        summary: "Ўзбекистоннинг бетакрор тоғ чўққилари ва табиати.",
        body: "<p>Мамлакатимиз тоғли ҳудудлари йилнинг барча фаслларида ўзгача чирой очади.</p>",
        author: "Соҳибжон Қодиров",
        views: 216
      },
      {
        id: "ph-14",
        type: "photo",
        title: "Ёшlar форуми: иштирокчилар ва ғоялар",
        meta: "Жамият | 16:00",
        image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
        lang: "uzk",
        summary: "Тошкентда ёшларнинг инновацион ғоялари тақдимоти бўлиб ўтди.",
        body: "<p>Республика миқёсида ўтказилган ёшлар форумидан лавҳалар.</p>",
        author: "Мафтуна Зокирова",
        views: 142
      },
      {
        id: "ph-15",
        type: "photo",
        title: "Хайрия акцияси: оилаларга ёрдам кўрсатилди",
        meta: "Жамият | 11:00",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
        lang: "uzk",
        summary: "Хайрия тадбирида минглаб оилаларга озиқ-овқатлар тарқатилди.",
        body: "<p>Саховатпеша тадбиркорлар ва кўнгиллилар кўмагида муҳтож оилалар ҳолидан хабар олинди.</p>",
        author: "Ishonch.uz таҳририяти",
        views: 99
      },
      {
        id: "ph-16",
        type: "photo",
        title: "Миллий кийим куни: либослар намойиши",
        meta: "Маданият | 09:15",
        image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=900&q=80",
        lang: "uzk",
        summary: "Ўзбек атлас ва адраслариdan тикилган миллий кийимлар кўргазмаси.",
        body: "<p>Миллий кийимларимиз халқимиз тарихи ва маданиятини акс эттиради.</p>",
        author: "Нилуфар Йўлдошева",
        views: 178
      },

      // RU (Russian)
      {
        id: "ph-17",
        type: "photo",
        title: "Инспектор использовал форму для обмана людей",
        meta: "Узбекистан | 17:00",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
        lang: "ru",
        summary: "Выявлен лжеинспектор, который использовал форму ГСБДД для мошенничества.",
        body: "<p>Мужчина, одетый в форму сотрудника дорожно-патрульной службы, входил в доверие к гражданам и обманывал их.</p><p>В настоящее время по данному факту проводится расследование.</p>",
        author: "Редакция Ishonch.uz",
        views: 120
      },
      {
        id: "ph-18",
        type: "photo",
        title: "Кладбище империй: почему Афганистан не покорился?",
        meta: "Мир | 11:34",
        image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=80",
        lang: "ru",
        summary: "Анализ того, как великие державы сталкивались с непреодолимыми трудностями в Афганистане.",
        body: "<p>Исторически ни одной крупной империи не удавалось удерживать контроль над Афганистаном долгое время благодаря горному рельефу и стойкости местных жителей.</p>",
        author: "Аналитик Шакир Алимов",
        views: 145
      },
      {
        id: "ph-19",
        type: "photo",
        title: "Международный культурный фестиваль в Самарканде",
        meta: "Культура | 13:20",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
        lang: "ru",
        summary: "Яркие моменты и фоторепортаж с международного фестиваля искусств в Самарканде.",
        body: "<p>В фестивале приняли участие артисты из более чем 50 стран мира, представив уникальные народные наряды и музыку.</p>",
        author: "Фотожурналист Камолиддин Якубов",
        views: 280
      },
      {
        id: "ph-20",
        type: "photo",
        title: "Новый облик Ташкента: фоторепортаж",
        meta: "Узбекистан | 10:45",
        image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=900&q=80",
        lang: "ru",
        summary: "Фотообзор масштабных строительных проектов в столице Узбекистана.",
        body: "<p>Масштабы строительства в Ташкенте за последние годы значительно выросли, меняя облик мегаполиса.</p>",
        author: "Редакция Ishonch.uz",
        views: 202
      },
      {
        id: "ph-21",
        type: "photo",
        title: "Горы и природа: пейзажи Узбекистана",
        meta: "Природа | 08:30",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=900&q=80",
        lang: "ru",
        summary: "Потрясающие фотографии горных вершин и нетронутой природы Узбекистана.",
        body: "<p>Горные районы страны прекрасны в любое время года, привлекая туристов со всего мира.</p>",
        author: "Сохибжон Кадыров",
        views: 277
      },
      {
        id: "ph-22",
        type: "photo",
        title: "Молодёжный форум: участники и идеи",
        meta: "Общество | 16:00",
        image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
        lang: "ru",
        summary: "В Ташкенте прошла презентация стартап-проектов и инновационных идей молодёжи.",
        body: "<p>В форуме приняли участие более 1000 талантливых молодых людей со всей республики.</p>",
        author: "Мафтуна Закирова",
        views: 180
      },
      {
        id: "ph-23",
        type: "photo",
        title: "Благотворительная акция: помощь семьям",
        meta: "Общество | 11:00",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
        lang: "ru",
        summary: "В ходе благотворительной акции тысячи нуждающихся семей получили продукты питания.",
        body: "<p>Благотворители и волонтеры посетили семьи, оказав им посильную материальную помощь.</p>",
        author: "Редакция Ishonch.uz",
        views: 130
      },
      {
        id: "ph-24",
        type: "photo",
        title: "День национального костюма: показ нарядов",
        meta: "Культура | 09:15",
        image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=900&q=80",
        lang: "ru",
        summary: "Выставка традиционных узбекских костюмов из атласа и адраса.",
        body: "<p>Национальные костюмы отражают глубокую историю и культурные ценности нашего народа.</p>",
        author: "Нилуфар Юлдашева",
        views: 245
      }
    ];
    modified = true;
  }

  if (modified) {
    writeDb(db);
  }
  return db;
}

function writeDb(db) {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 12 * 1024 * 1024) {
        reject(new Error("Payload too large"));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function getCookies(request) {
  return Object.fromEntries(
    (request.headers.cookie || "")
      .split(";")
      .filter(Boolean)
      .map((part) => {
        const [key, ...value] = part.trim().split("=");
        return [key, decodeURIComponent(value.join("="))];
      })
  );
}

function getSession(request) {
  const token = getCookies(request).yk_session;
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

function requireAdmin(request, response) {
  if (getSession(request)) return true;
  sendJson(response, 401, { error: "Unauthorized" });
  return false;
}

function publicStories(db) {
  return {
    uz: (db.stories.uz || []).filter((item) => item.status === "published"),
    ru: (db.stories.ru || []).filter((item) => item.status === "published"),
    uzk: (db.stories.uzk || []).filter((item) => item.status === "published"),
  };
}

function generateSitemapAndRobots(request) {
  const db = readDb();
  const baseUrl = `${request.headers["x-forwarded-proto"] || "http"}://${request.headers.host || "localhost"}`;
  
  let urls = [];
  urls.push({ loc: baseUrl, changefreq: "daily", priority: "1.0" });
  
  const activeLangs = ["uz", "ru", "uzk"].filter(l => {
    if (l === "uz" && db.config?.langUzActive === false) return false;
    if (l === "ru" && db.config?.langRuActive === false) return false;
    if (l === "uzk" && db.config?.langUzkActive === false) return false;
    return true;
  });

  for (const l of activeLangs) {
    const list = db.stories[l] || [];
    for (const s of list) {
      if (s.status === "published") {
        const slugOrId = s.slug || s.id;
        urls.push({
          loc: `${baseUrl}/news/${slugOrId}`,
          lastmod: new Date(s.updatedAt || s.createdAt || Date.now()).toISOString().split("T")[0],
          changefreq: "weekly",
          priority: "0.8"
        });
      }
    }
  }

  const videosList = db.videos || [];
  for (const v of videosList) {
    if (activeLangs.includes(v.lang)) {
      urls.push({
        loc: `${baseUrl}/news/${v.id}`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "weekly",
        priority: "0.7"
      });
    }
  }

  const photosList = db.photos || [];
  for (const p of photosList) {
    if (activeLangs.includes(p.lang)) {
      urls.push({
        loc: `${baseUrl}/news/${p.id}`,
        lastmod: new Date().toISOString().split("T")[0],
        changefreq: "weekly",
        priority: "0.7"
      });
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin/

Sitemap: ${baseUrl}/sitemap.xml`;

  return { sitemapXml, robotsTxt };
}

async function handleApi(request, response, pathname) {
  const db = readDb();

  // Maintenance Mode Check
  const isMaintenance = db.config?.maintenanceMode;
  const isAdmin = Boolean(getSession(request));
  if (isMaintenance && !isAdmin) {
    if (pathname !== "/api/config" && pathname !== "/api/admin/session" && pathname !== "/api/admin/login") {
      sendJson(response, 503, { error: "Saytda texnik ishlar olib borilmoqda. Tez orada qaytamiz!" });
      return;
    }
  }

  if (request.method === "GET" && pathname === "/api/stories") {
    sendJson(response, 200, { stories: publicStories(db) });
    return;
  }

  if (request.method === "GET" && pathname === "/api/config") {
    const defaultConfig = {
      siteName: "VATAN",
      tagline: "Ilmiy-ommabop jurnal",
      logoUrl: "/uploads/logo.svg",
      phone: "+998 935241107",
      email: "vatan2024@yandex.ru",
      address: "Toshkent shahri, Buxoro ko'chasi, 24-uy",
      telegram: "https://t.me/vatanjournal",
      instagram: "https://instagram.com/vatanjournal",
      youtube: "https://youtube.com/vatanjournal",
      facebook: "https://facebook.com/vatanjournal",
      descriptionUz: "Ishonch.uz. O'zbekiston yangiliklari portali. Tezkor, ishonchli, mustaqil.",
      descriptionRu: "Ishonch.uz. Портал новостей Узбекистана. Быстро, надежно, независимо.",
      bannerText: "",
      bannerActive: false,
      brandColor: "#c31932",
      googleAnalyticsId: "",
      yandexMetrikaId: "",
      telegramBotToken: "",
      telegramChatId: "",
      keywords: "vatan, ilm-fan, yangiliklar",
      categoriesUz: ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"],
      categoriesRu: ["Политика", "Экономика", "Технологии", "Спорт", "Культура", "Аналитика"],
      categoriesUzk: ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"],
      subcategoriesUz: {},
      subcategoriesRu: {},
      subcategoriesUzk: {},
      langUzActive: true,
      langUzkActive: true,
      langRuActive: true,
      pinnedHeroId: "",
      pinnedSideIds: [],
      ads: [],
      visitorStatsActive: true,
      contactUz: [
        { title: "Tahririyat", value: "Yangilik, press-reliz yoki foto material yuborish uchun: news@ishonch.uz" },
        { title: "Reklama", value: "Brend loyihalari, bannerlar va maxsus sahifalar: ads@ishonch.uz" },
        { title: "Manzil", value: "Toshkent shahri, matbuot markazi, 4-qavat. Dushanba-juma 09:00-18:00." }
      ],
      contactRu: [
        { title: "Редакция", value: "Новости, пресс-релизы и фотоматериалы: news@ishonch.uz" },
        { title: "Реклама", value: "Бреnd-проекты, баннеры и специальные страницы: ads@ishonch.uz" },
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
      }
    };
    sendJson(response, 200, { config: { ...defaultConfig, ...(db.config || {}) } });
    return;
  }

  if (request.method === "GET" && pathname === "/sitemap.xml") {
    const { sitemapXml } = generateSitemapAndRobots(request);
    response.writeHead(200, { "Content-Type": "application/xml; charset=utf-8" });
    response.end(sitemapXml);
    return;
  }

  if (request.method === "GET" && pathname === "/robots.txt") {
    const { robotsTxt } = generateSitemapAndRobots(request);
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(robotsTxt);
    return;
  }

  if (request.method === "GET" && (pathname === "/rss.xml" || pathname === "/rss-ru.xml")) {
    const isRu = pathname === "/rss-ru.xml";
    if (isRu && db.config?.langRuActive === false) {
      sendJson(response, 404, { error: "Not found" });
      return;
    }
    const lang = isRu ? "ru" : "uz";
    const baseUrl = `${request.headers["x-forwarded-proto"] || "http"}://${request.headers.host || `localhost:${preferredPort}`}`;
    const items = (db.stories[lang] || []).filter(s => s.status === "published").slice(0, 20);
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ishonch.uz${isRu ? " (RU)" : ""}</title>
    <link>${baseUrl}</link>
    <description>${isRu ? "Новости на русском языке" : "O'zbekcha yangiliklar"}</description>
    <language>${isRu ? "ru" : "uz"}</language>
    <atom:link href="${baseUrl}${pathname}" rel="self" type="application/rss+xml"/>
    ${items.map(s => `<item>
      <title><![CDATA[${s.title}]]></title>
      <description><![CDATA[${s.summary}]]></description>
      <link>${baseUrl}/#story-${s.id}</link>
      <guid>${baseUrl}/#story-${s.id}</guid>
      <pubDate>${new Date(s.createdAt || Date.now()).toUTCString()}</pubDate>
      <category>${escapeHtml(s.category)}</category>
      ${s.image ? `<enclosure url="${escapeHtml(s.image)}" type="image/jpeg" length="0"/>` : ""}
    </item>`).join("\n    ")}
  </channel>
</rss>`;
    response.writeHead(200, { "Content-Type": "application/rss+xml; charset=utf-8" });
    response.end(xml);
    return;
  }

  if (request.method === "GET" && pathname === "/api/admin/stories") {
    if (!requireAdmin(request, response)) return;
    sendJson(response, 200, { stories: db.stories });
    return;
  }

  if (request.method === "GET" && pathname === "/api/admin/session") {
    sendJson(response, 200, { authenticated: Boolean(getSession(request)) });
    return;
  }

  if (request.method === "POST" && pathname === "/api/admin/login") {
    const body = await readJson(request);
    const ip = request.headers["x-forwarded-for"] || request.socket.remoteAddress || "127.0.0.1";
    global.loginAttempts = global.loginAttempts || new Map();
    const currentAttempt = global.loginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
    if (Date.now() < currentAttempt.lockedUntil) {
      sendJson(response, 429, { error: "Ko'p urinishlar. Iltimos kuting." });
      return;
    }
    if (!body.password || !verifyPassword(body.password, db.admin.passwordHash)) {
      currentAttempt.count++;
      if (currentAttempt.count >= 5) currentAttempt.lockedUntil = Date.now() + 5 * 60 * 1000;
      global.loginAttempts.set(ip, currentAttempt);
      sendJson(response, 401, { error: "Parol noto'g'ri" });
      return;
    }
    global.loginAttempts.delete(ip);
    
    db.loginHistory = db.loginHistory || [];
    const clientIp = request.headers["x-forwarded-for"] || request.socket.remoteAddress || "127.0.0.1";
    const formattedIp = clientIp === "::1" ? "127.0.0.1" : clientIp.replace(/^::ffff:/, "");
    
    const userAgent = request.headers["user-agent"] || "Noma'lum";
    let device = "Noma'lum qurilma";
    if (userAgent.includes("Windows")) device = "Windows";
    else if (userAgent.includes("Macintosh")) device = "macOS";
    else if (userAgent.includes("Android")) device = "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) device = "iOS";
    else if (userAgent.includes("Linux")) device = "Linux";
    
    let browser = "Noma'lum brauzer";
    if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";
    
    db.loginHistory.unshift({
      ip: formattedIp,
      device: `${device} (${browser})`,
      timestamp: new Date().toISOString()
    });
    if (db.loginHistory.length > 10) {
      db.loginHistory = db.loginHistory.slice(0, 10);
    }
    writeDb(db);

    const token = crypto.randomBytes(32).toString("hex");
    sessions.set(token, { expiresAt: Date.now() + sessionTtlMs });
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": `yk_session=${token}; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=${sessionTtlMs / 1000}`,
    });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  if (request.method === "POST" && pathname === "/api/admin/logout") {
    const token = getCookies(request).yk_session;
    if (token) sessions.delete(token);
    response.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8",
      "Set-Cookie": "yk_session=; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=0",
    });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  if (request.method === "POST" && pathname.startsWith("/api/ads/impression/")) {
    const id = pathname.replace("/api/ads/impression/", "");
    if (id) {
      if (!db.adStats) db.adStats = {};
      if (!db.adStats[id]) db.adStats[id] = { impressions: 0, clicks: 0 };
      db.adStats[id].impressions = (db.adStats[id].impressions || 0) + 1;
      writeDb(db);
    }
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && pathname.startsWith("/api/ads/click/")) {
    const id = pathname.replace("/api/ads/click/", "");
    if (id) {
      if (!db.adStats) db.adStats = {};
      if (!db.adStats[id]) db.adStats[id] = { impressions: 0, clicks: 0 };
      db.adStats[id].clicks = (db.adStats[id].clicks || 0) + 1;
      writeDb(db);
    }
    sendJson(response, 200, { ok: true });
    return;
  }

  // --- PUBLIC APIs ---
  if (request.method === "POST" && pathname === "/api/messages") {
    const body = await readJson(request);
    const msg = {
      id: crypto.randomUUID(),
      name: String(body.name || "").trim(),
      email: String(body.email || "").trim(),
      subject: String(body.subject || "").trim(),
      message: String(body.message || "").trim(),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    if (!msg.name || !msg.message) {
      sendJson(response, 400, { error: "Ism va xabar kiritilishi shart" });
      return;
    }
    db.messages = db.messages || [];
    db.messages.unshift(msg);
    writeDb(db);
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && pathname === "/api/comments") {
    const body = await readJson(request);
    const comment = {
      id: crypto.randomUUID(),
      storyId: String(body.storyId || "").trim(),
      name: String(body.name || "Anonim").trim(),
      text: String(body.text || "").trim(),
      status: "pending", // Moderator tasdiqlashi kerak
      createdAt: new Date().toISOString()
    };
    if (!comment.storyId || !comment.text) {
      sendJson(response, 400, { error: "Maqola ID va izoh matni shart" });
      return;
    }
    db.comments = db.comments || [];
    db.comments.unshift(comment);
    writeDb(db);
    sendJson(response, 200, { ok: true, comment });
    return;
  }

  if (request.method === "GET" && pathname === "/api/public/comments") {
    const queryUrl = new URL(request.url, "http://localhost");
    const storyId = queryUrl.searchParams.get("storyId");
    db.comments = db.comments || [];
    const filtered = db.comments.filter(c => c.status === "approved" && (!storyId || c.storyId === storyId));
    sendJson(response, 200, { comments: filtered });
    return;
  }

  if (request.method === "POST" && pathname === "/api/subscribers") {
    const body = await readJson(request);
    const email = String(body.email || "").trim();
    if (!email || !email.includes("@")) {
      sendJson(response, 400, { error: "Noto'g'ri email manzili" });
      return;
    }
    db.subscribers = db.subscribers || [];
    if (db.subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
      sendJson(response, 200, { ok: true, message: "Siz allaqachon a'zo bo'lgansiz" });
      return;
    }
    const sub = {
      id: crypto.randomUUID(),
      email,
      status: "subscribed",
      createdAt: new Date().toISOString()
    };
    db.subscribers.unshift(sub);
    writeDb(db);
    sendJson(response, 200, { ok: true, message: "Obuna muvaffaqiyatli yakunlandi" });
    return;
  }

  if (request.method === "POST" && pathname === "/api/payments") {
    const body = await readJson(request);
    const pay = {
      id: crypto.randomUUID(),
      name: String(body.name || "Anonim").trim(),
      email: String(body.email || "").trim(),
      amount: Number(body.amount) || 0,
      currency: String(body.currency || "UZS").toUpperCase(),
      description: String(body.description || "Xayriya").trim(),
      status: "success",
      createdAt: new Date().toISOString()
    };
    if (pay.amount <= 0) {
      sendJson(response, 400, { error: "Miqdor noldan katta bo'lishi kerak" });
      return;
    }
    db.payments = db.payments || [];
    db.payments.unshift(pay);
    writeDb(db);
    sendJson(response, 200, { ok: true, payment: pay });
    return;
  }

  if (request.method === "GET" && pathname === "/api/public/journals") {
    db.journals = db.journals || [];
    sendJson(response, 200, { journals: db.journals });
    return;
  }

  if (request.method === "GET" && pathname === "/api/public/quotes") {
    db.quotes = db.quotes || [];
    const activeQuotes = db.quotes.filter(q => q.status === "active");
    sendJson(response, 200, { quotes: activeQuotes });
    return;
  }
  if (request.method === "GET" && pathname === "/api/public/videos") {
    db.videos = db.videos || [];
    sendJson(response, 200, { videos: db.videos });
    return;
  }
  if (request.method === "GET" && pathname === "/api/public/photos") {
    db.photos = db.photos || [];
    sendJson(response, 200, { photos: db.photos });
    return;
  }

  if (request.method === "POST" && pathname === "/api/visitor/ping") {
    const body = await readJson(request);
    const { visitorId, action, sessionTime } = body;
    if (!visitorId) {
      sendJson(response, 400, { error: "visitorId is required" });
      return;
    }

    const db = readDb();
    const today = new Date().toISOString().split("T")[0];
    
    if (!db.visitorStats || db.visitorStats.date !== today) {
      db.visitorStats = {
        date: today,
        visits: 0,
        actions: 0,
        totalTimeSpent: 0,
        visitors: {}
      };
    }

    let visitor = db.visitorStats.visitors[visitorId];
    if (!visitor) {
      visitor = {
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        actions: 0,
        timeSpent: 0
      };
      db.visitorStats.visitors[visitorId] = visitor;
      db.visitorStats.visits += 1;
    }

    if (action) {
      db.visitorStats.actions += 1;
      visitor.actions += 1;
    }

    if (sessionTime !== undefined && typeof sessionTime === "number" && sessionTime > visitor.timeSpent) {
      const diff = sessionTime - visitor.timeSpent;
      visitor.timeSpent = sessionTime;
      db.visitorStats.totalTimeSpent += diff;
    }

    visitor.lastSeen = Date.now();
    writeDb(db);

    activeVisitors.set(visitorId, Date.now());

    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "GET" && pathname === "/api/visitor/stats") {
    const db = readDb();
    
    // Clean memory map of active visitors
    const now = Date.now();
    for (const [id, lastSeen] of activeVisitors.entries()) {
      if (now - lastSeen > 30000) {
        activeVisitors.delete(id);
      }
    }

    const stats = db.visitorStats || { visits: 0, actions: 0, totalTimeSpent: 0 };
    const visits = stats.visits || 0;
    const avgTime = visits > 0 ? Math.round(stats.totalTimeSpent / visits) : 0;

    sendJson(response, 200, {
      online: activeVisitors.size,
      visits: visits,
      actions: stats.actions || 0,
      averageTime: avgTime,
      enabled: db.config?.visitorStatsActive !== false
    });
    return;
  }

  if (!requireAdmin(request, response)) return;

  // --- ADMIN APIs ---
  // Generate static Sitemap & Robots.txt
  if (request.method === "POST" && pathname === "/api/admin/seo/generate") {
    const { sitemapXml, robotsTxt } = generateSitemapAndRobots(request);
    try {
      fs.writeFileSync(path.join(root, "sitemap.xml"), sitemapXml, "utf8");
      fs.writeFileSync(path.join(root, "robots.txt"), robotsTxt, "utf8");
      sendJson(response, 200, { success: true, sitemapPath: "/sitemap.xml", robotsPath: "/robots.txt" });
    } catch (err) {
      sendJson(response, 500, { error: "Fayllarni yozishda xatolik yuz berdi: " + err.message });
    }
    return;
  }

  // AI SEO Suggestion Assistant
  if (request.method === "POST" && pathname === "/api/admin/seo/ai-suggest") {
    let bodyData;
    try {
      bodyData = await readJson(request);
    } catch (e) {
      sendJson(response, 400, { error: "Muvaffaqiyatsiz JSON o'qish" });
      return;
    }

    const { title, body, type } = bodyData || {};
    const sanitizedTitle = (title || "").trim();
    const sanitizedBody = (body || "").replace(/<[^>]*>/g, "").trim(); // Clean HTML tags

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `Siz ishonch.uz yangiliklar portali uchun professional SEO kopirayterisiz.
Quyidagi yangilik materialini tahlil qiling:
Turi: ${type || 'story'}
Sarlavha: ${sanitizedTitle}
Matn: ${sanitizedBody.slice(0, 1500)}

Faqat JSON formatida javob bering, boshqa hech qanday izoh qo'shmang. JSON formati:
{
  "metaTitle": "SEO uchun optimallashtirilgan sarlavha (kamida 40 ta, ko'pi bilan 65 ta belgi)",
  "metaDesc": "SEO uchun optimallashtirilgan meta tavsif (kamida 120 ta, ko'pi bilan 170 ta belgi)",
  "tags": "vergul bilan ajratilgan 5-7 ta kalit so'zlar",
  "suggestions": ["1-tavsiya", "2-tavsiya"]
}`;

        const https = require("https");
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const postData = JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        });

        const req = https.request(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData)
          }
        }, (res) => {
          let data = "";
          res.on("data", (chunk) => data += chunk);
          res.on("end", () => {
            try {
              const result = JSON.parse(data);
              const textResult = result.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textResult) {
                const parsedResult = JSON.parse(textResult.trim());
                sendJson(response, 200, {
                  metaTitle: parsedResult.metaTitle || sanitizedTitle,
                  metaDesc: parsedResult.metaDesc || (sanitizedBody.slice(0, 150) + "..."),
                  tags: parsedResult.tags || "yangiliklar, ishonch",
                  suggestions: parsedResult.suggestions || [],
                  source: "gemini"
                });
              } else {
                throw new Error("Gemini response is empty");
              }
            } catch (err) {
              console.error("Failed to parse Gemini response:", err, data);
              sendJson(response, 200, getLocalSeoFallback(sanitizedTitle, sanitizedBody, type));
            }
          });
        });

        req.on("error", (err) => {
          console.error("Gemini request error:", err);
          sendJson(response, 200, getLocalSeoFallback(sanitizedTitle, sanitizedBody, type));
        });

        req.write(postData);
        req.end();
        return;
      } catch (err) {
        console.error("AI API Call error:", err);
        // Fallback to local heuristic
      }
    }

    sendJson(response, 200, getLocalSeoFallback(sanitizedTitle, sanitizedBody, type));
    return;
  }

  // Quotes
  if (request.method === "GET" && pathname === "/api/admin/quotes") {
    sendJson(response, 200, { quotes: db.quotes || [] });
    return;
  }
  if (request.method === "POST" && pathname === "/api/admin/quotes") {
    const body = await readJson(request);
    const item = {
      id: crypto.randomUUID(),
      text: String(body.text || "").trim(),
      author: String(body.author || "").trim(),
      status: body.status === "inactive" ? "inactive" : "active",
      createdAt: new Date().toISOString()
    };
    db.quotes = db.quotes || [];
    db.quotes.unshift(item);
    writeDb(db);
    sendJson(response, 200, { quotes: db.quotes });
    return;
  }
  const quoteMatch = pathname.match(/^\/api\/admin\/quotes\/([^/]+)$/);
  if (quoteMatch && request.method === "PUT") {
    const id = quoteMatch[1];
    const body = await readJson(request);
    db.quotes = db.quotes || [];
    const index = db.quotes.findIndex(q => q.id === id);
    if (index !== -1) {
      db.quotes[index] = {
        ...db.quotes[index],
        text: body.text !== undefined ? String(body.text).trim() : db.quotes[index].text,
        author: body.author !== undefined ? String(body.author).trim() : db.quotes[index].author,
        status: body.status !== undefined ? body.status : db.quotes[index].status,
        updatedAt: new Date().toISOString()
      };
      writeDb(db);
    }
    sendJson(response, 200, { quotes: db.quotes });
    return;
  }
  if (quoteMatch && request.method === "DELETE") {
    const id = quoteMatch[1];
    db.quotes = (db.quotes || []).filter(q => q.id !== id);
    writeDb(db);
    sendJson(response, 200, { quotes: db.quotes });
    return;
  }

  // Videos
  if (request.method === "GET" && pathname === "/api/admin/videos") {
    sendJson(response, 200, { videos: db.videos || [] });
    return;
  }
  if (request.method === "POST" && pathname === "/api/admin/videos") {
    const body = await readJson(request);
    const item = {
      id: crypto.randomUUID(),
      type: String(body.type || "video").trim(),
      title: String(body.title || "").trim(),
      meta: String(body.meta || "").trim(),
      image: String(body.image || "").trim(),
      url: String(body.url || "").trim(),
      lang: String(body.lang || "uz").trim(),
      summary: String(body.summary || "").trim(),
      body: String(body.body || "").trim(),
      author: String(body.author || "Ishonch.uz tahririyati").trim(),
      views: body.views !== undefined ? Number(body.views) : Math.floor(Math.random() * 500) + 100,
      createdAt: new Date().toISOString()
    };
    db.videos = db.videos || [];
    db.videos.unshift(item);
    writeDb(db);
    sendJson(response, 200, { videos: db.videos });
    return;
  }
  const videoMatch = pathname.match(/^\/api\/admin\/videos\/([^/]+)$/);
  if (videoMatch && request.method === "PUT") {
    const id = videoMatch[1];
    const body = await readJson(request);
    db.videos = db.videos || [];
    const index = db.videos.findIndex(v => v.id === id);
    if (index !== -1) {
      db.videos[index] = {
        ...db.videos[index],
        type: body.type !== undefined ? String(body.type).trim() : db.videos[index].type,
        title: body.title !== undefined ? String(body.title).trim() : db.videos[index].title,
        meta: body.meta !== undefined ? String(body.meta).trim() : db.videos[index].meta,
        image: body.image !== undefined ? String(body.image).trim() : db.videos[index].image,
        url: body.url !== undefined ? String(body.url).trim() : db.videos[index].url,
        lang: body.lang !== undefined ? String(body.lang).trim() : db.videos[index].lang,
        summary: body.summary !== undefined ? String(body.summary).trim() : db.videos[index].summary,
        body: body.body !== undefined ? String(body.body).trim() : db.videos[index].body,
        author: body.author !== undefined ? String(body.author).trim() : db.videos[index].author,
        views: body.views !== undefined ? Number(body.views) : db.videos[index].views,
        updatedAt: new Date().toISOString()
      };
      writeDb(db);
    }
    sendJson(response, 200, { videos: db.videos });
    return;
  }
  if (videoMatch && request.method === "DELETE") {
    const id = videoMatch[1];
    db.videos = (db.videos || []).filter(v => v.id !== id);
    writeDb(db);
    sendJson(response, 200, { videos: db.videos });
    return;
  }

  // Photos
  if (request.method === "GET" && pathname === "/api/admin/photos") {
    sendJson(response, 200, { photos: db.photos || [] });
    return;
  }
  if (request.method === "POST" && pathname === "/api/admin/photos") {
    const body = await readJson(request);
    const item = {
      id: crypto.randomUUID(),
      type: String(body.type || "photo").trim(),
      title: String(body.title || "").trim(),
      meta: String(body.meta || "").trim(),
      image: String(body.image || "").trim(),
      url: String(body.url || "").trim(),
      lang: String(body.lang || "uz").trim(),
      summary: String(body.summary || "").trim(),
      body: String(body.body || "").trim(),
      author: String(body.author || "Ishonch.uz tahririyati").trim(),
      views: body.views !== undefined ? Number(body.views) : Math.floor(Math.random() * 500) + 100,
      createdAt: new Date().toISOString()
    };
    db.photos = db.photos || [];
    db.photos.unshift(item);
    writeDb(db);
    sendJson(response, 200, { photos: db.photos });
    return;
  }
  const photoMatch = pathname.match(/^\/api\/admin\/photos\/([^/]+)$/);
  if (photoMatch && request.method === "PUT") {
    const id = photoMatch[1];
    const body = await readJson(request);
    db.photos = db.photos || [];
    const index = db.photos.findIndex(p => p.id === id);
    if (index !== -1) {
      db.photos[index] = {
        ...db.photos[index],
        type: body.type !== undefined ? String(body.type).trim() : db.photos[index].type,
        title: body.title !== undefined ? String(body.title).trim() : db.photos[index].title,
        meta: body.meta !== undefined ? String(body.meta).trim() : db.photos[index].meta,
        image: body.image !== undefined ? String(body.image).trim() : db.photos[index].image,
        url: body.url !== undefined ? String(body.url).trim() : db.photos[index].url,
        lang: body.lang !== undefined ? String(body.lang).trim() : db.photos[index].lang,
        summary: body.summary !== undefined ? String(body.summary).trim() : db.photos[index].summary,
        body: body.body !== undefined ? String(body.body).trim() : db.photos[index].body,
        author: body.author !== undefined ? String(body.author).trim() : db.photos[index].author,
        views: body.views !== undefined ? Number(body.views) : db.photos[index].views,
        updatedAt: new Date().toISOString()
      };
      writeDb(db);
    }
    sendJson(response, 200, { photos: db.photos });
    return;
  }
  if (photoMatch && request.method === "DELETE") {
    const id = photoMatch[1];
    db.photos = (db.photos || []).filter(p => p.id !== id);
    writeDb(db);
    sendJson(response, 200, { photos: db.photos });
    return;
  }

  // Journals
  if (request.method === "GET" && pathname === "/api/admin/journals") {
    sendJson(response, 200, { journals: db.journals || [] });
    return;
  }
  if (request.method === "POST" && pathname === "/api/admin/journals") {
    const body = await readJson(request);
    const item = {
      id: crypto.randomUUID(),
      title: String(body.title || "").trim(),
      coverUrl: String(body.coverUrl || "").trim(),
      pdfUrl: String(body.pdfUrl || "").trim(),
      publishDate: String(body.publishDate || new Date().toISOString().split("T")[0]),
      createdAt: new Date().toISOString()
    };
    db.journals = db.journals || [];
    db.journals.unshift(item);
    writeDb(db);
    sendJson(response, 200, { journals: db.journals });
    return;
  }
  const journalMatch = pathname.match(/^\/api\/admin\/journals\/([^/]+)$/);
  if (journalMatch && request.method === "PUT") {
    const id = journalMatch[1];
    const body = await readJson(request);
    db.journals = db.journals || [];
    const index = db.journals.findIndex(j => j.id === id);
    if (index !== -1) {
      db.journals[index] = {
        ...db.journals[index],
        title: body.title !== undefined ? String(body.title).trim() : db.journals[index].title,
        coverUrl: body.coverUrl !== undefined ? String(body.coverUrl).trim() : db.journals[index].coverUrl,
        pdfUrl: body.pdfUrl !== undefined ? String(body.pdfUrl).trim() : db.journals[index].pdfUrl,
        publishDate: body.publishDate !== undefined ? String(body.publishDate).trim() : db.journals[index].publishDate,
        updatedAt: new Date().toISOString()
      };
      writeDb(db);
    }
    sendJson(response, 200, { journals: db.journals });
    return;
  }
  if (journalMatch && request.method === "DELETE") {
    const id = journalMatch[1];
    db.journals = (db.journals || []).filter(j => j.id !== id);
    writeDb(db);
    sendJson(response, 200, { journals: db.journals });
    return;
  }

  // Messages
  if (request.method === "GET" && pathname === "/api/admin/messages") {
    sendJson(response, 200, { messages: db.messages || [] });
    return;
  }
  const messageMatch = pathname.match(/^\/api\/admin\/messages\/([^/]+)$/);
  if (messageMatch && request.method === "PUT") {
    const id = messageMatch[1];
    db.messages = db.messages || [];
    const index = db.messages.findIndex(m => m.id === id);
    if (index !== -1) {
      db.messages[index].isRead = true;
      writeDb(db);
    }
    sendJson(response, 200, { messages: db.messages });
    return;
  }
  if (messageMatch && request.method === "DELETE") {
    const id = messageMatch[1];
    db.messages = (db.messages || []).filter(m => m.id !== id);
    writeDb(db);
    sendJson(response, 200, { messages: db.messages });
    return;
  }

  // Comments
  if (request.method === "GET" && pathname === "/api/admin/comments") {
    sendJson(response, 200, { comments: db.comments || [] });
    return;
  }
  const commentMatch = pathname.match(/^\/api\/admin\/comments\/([^/]+)$/);
  if (commentMatch && request.method === "PUT") {
    const id = commentMatch[1];
    const body = await readJson(request);
    db.comments = db.comments || [];
    const index = db.comments.findIndex(c => c.id === id);
    if (index !== -1) {
      db.comments[index] = {
        ...db.comments[index],
        name: body.name !== undefined ? String(body.name).trim() : db.comments[index].name,
        text: body.text !== undefined ? String(body.text).trim() : db.comments[index].text,
        status: body.status !== undefined ? String(body.status) : db.comments[index].status,
        updatedAt: new Date().toISOString()
      };
      writeDb(db);
    }
    sendJson(response, 200, { comments: db.comments });
    return;
  }
  if (commentMatch && request.method === "DELETE") {
    const id = commentMatch[1];
    db.comments = (db.comments || []).filter(c => c.id !== id);
    writeDb(db);
    sendJson(response, 200, { comments: db.comments });
    return;
  }

  // Authors
  if (request.method === "GET" && pathname === "/api/admin/authors") {
    sendJson(response, 200, { authors: db.authors || [] });
    return;
  }
  if (request.method === "POST" && pathname === "/api/admin/authors") {
    const body = await readJson(request);
    const item = {
      id: crypto.randomUUID(),
      name: String(body.name || "").trim(),
      bio: String(body.bio || "").trim(),
      avatar: String(body.avatar || "").trim(),
      role: String(body.role || "").trim(),
      status: body.status === "inactive" ? "inactive" : "active",
      createdAt: new Date().toISOString()
    };
    db.authors = db.authors || [];
    db.authors.unshift(item);
    writeDb(db);
    sendJson(response, 200, { authors: db.authors });
    return;
  }
  const authorMatch = pathname.match(/^\/api\/admin\/authors\/([^/]+)$/);
  if (authorMatch && request.method === "PUT") {
    const id = authorMatch[1];
    const body = await readJson(request);
    db.authors = db.authors || [];
    const index = db.authors.findIndex(a => a.id === id);
    if (index !== -1) {
      db.authors[index] = {
        ...db.authors[index],
        name: body.name !== undefined ? String(body.name).trim() : db.authors[index].name,
        bio: body.bio !== undefined ? String(body.bio).trim() : db.authors[index].bio,
        avatar: body.avatar !== undefined ? String(body.avatar).trim() : db.authors[index].avatar,
        role: body.role !== undefined ? String(body.role).trim() : db.authors[index].role,
        status: body.status !== undefined ? body.status : db.authors[index].status,
        updatedAt: new Date().toISOString()
      };
      writeDb(db);
    }
    sendJson(response, 200, { authors: db.authors });
    return;
  }
  if (authorMatch && request.method === "DELETE") {
    const id = authorMatch[1];
    db.authors = (db.authors || []).filter(a => a.id !== id);
    writeDb(db);
    sendJson(response, 200, { authors: db.authors });
    return;
  }

  // Subscribers
  if (request.method === "GET" && pathname === "/api/admin/subscribers") {
    sendJson(response, 200, { subscribers: db.subscribers || [] });
    return;
  }
  const subscriberMatch = pathname.match(/^\/api\/admin\/subscribers\/([^/]+)$/);
  if (subscriberMatch && request.method === "DELETE") {
    const id = subscriberMatch[1];
    db.subscribers = (db.subscribers || []).filter(s => s.id !== id);
    writeDb(db);
    sendJson(response, 200, { subscribers: db.subscribers });
    return;
  }

  // Newsletter send (simulated)
  if (request.method === "POST" && pathname === "/api/admin/newsletter/send") {
    const body = await readJson(request);
    const subject = String(body.subject || "").trim();
    const emailBody = String(body.body || "").trim();
    if (!subject || !emailBody) {
      sendJson(response, 400, { error: "Mavzu va xat matni shart" });
      return;
    }
    db.subscribers = db.subscribers || [];
    const count = db.subscribers.filter(s => s.status === "subscribed").length;
    const sentItem = {
      id: crypto.randomUUID(),
      subject,
      body: emailBody,
      sentCount: count,
      createdAt: new Date().toISOString()
    };
    db.sentNewsletters = db.sentNewsletters || [];
    db.sentNewsletters.unshift(sentItem);
    writeDb(db);
    sendJson(response, 200, { ok: true, sentCount: count, sentNewsletters: db.sentNewsletters });
    return;
  }
  if (request.method === "GET" && pathname === "/api/admin/newsletter/history") {
    sendJson(response, 200, { sentNewsletters: db.sentNewsletters || [] });
    return;
  }

  // Payments
  if (request.method === "GET" && pathname === "/api/admin/payments") {
    sendJson(response, 200, { payments: db.payments || [] });
    return;
  }
  const paymentMatch = pathname.match(/^\/api\/admin\/payments\/([^/]+)$/);
  if (paymentMatch && request.method === "DELETE") {
    const id = paymentMatch[1];
    db.payments = (db.payments || []).filter(p => p.id !== id);
    writeDb(db);
    sendJson(response, 200, { payments: db.payments });
    return;
  }

  // Static Pages
  if (request.method === "GET" && pathname === "/api/admin/pages") {
    sendJson(response, 200, { pages: db.pages || [] });
    return;
  }
  if (request.method === "POST" && pathname === "/api/admin/pages") {
    const body = await readJson(request);
    const item = {
      id: crypto.randomUUID(),
      slug: String(body.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, ""),
      title: String(body.title || "").trim(),
      body: String(body.body || "").trim(),
      status: body.status === "draft" ? "draft" : "published",
      createdAt: new Date().toISOString()
    };
    db.pages = db.pages || [];
    db.pages.unshift(item);
    writeDb(db);
    sendJson(response, 200, { pages: db.pages });
    return;
  }
  const pageMatch = pathname.match(/^\/api\/admin\/pages\/([^/]+)$/);
  if (pageMatch && request.method === "PUT") {
    const id = pageMatch[1];
    const body = await readJson(request);
    db.pages = db.pages || [];
    const index = db.pages.findIndex(p => p.id === id);
    if (index !== -1) {
      db.pages[index] = {
        ...db.pages[index],
        slug: body.slug !== undefined ? String(body.slug).trim().toLowerCase().replace(/[^a-z0-9-]/g, "") : db.pages[index].slug,
        title: body.title !== undefined ? String(body.title).trim() : db.pages[index].title,
        body: body.body !== undefined ? String(body.body).trim() : db.pages[index].body,
        status: body.status !== undefined ? body.status : db.pages[index].status,
        updatedAt: new Date().toISOString()
      };
      writeDb(db);
    }
    sendJson(response, 200, { pages: db.pages });
    return;
  }
  if (pageMatch && request.method === "DELETE") {
    const id = pageMatch[1];
    db.pages = (db.pages || []).filter(p => p.id !== id);
    writeDb(db);
    sendJson(response, 200, { pages: db.pages });
    return;
  }

  if (request.method === "PUT" && pathname === "/api/admin/config") {
    const body = await readJson(request);
    
    // Extract new category lists from request body if present
    const newCategoriesUz = body.config?.categoriesUz;
    const newCategoriesRu = body.config?.categoriesRu;
    const newCategoriesUzk = body.config?.categoriesUzk;

    // Get current (old) category lists
    const oldCategoriesUz = db.config?.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"];
    const oldCategoriesRu = db.config?.categoriesRu || ["Политика", "Экономика", "Технологии", "Спорт", "Культура", "Аналитика"];
    const oldCategoriesUzk = db.config?.categoriesUzk || ["Сиёсат", "Иқтисод", "Технология", "Спорт", "Маданият", "Таҳлил"];

    const langs = [
      { code: "uz", oldCats: oldCategoriesUz, newCats: newCategoriesUz },
      { code: "ru", oldCats: oldCategoriesRu, newCats: newCategoriesRu },
      { code: "uzk", oldCats: oldCategoriesUzk, newCats: newCategoriesUzk }
    ];

    langs.forEach(({ code, oldCats, newCats }) => {
      // If categories for this language are not being updated, skip
      if (!newCats || !Array.isArray(newCats)) return;

      const removed = oldCats.filter(c => !newCats.includes(c));
      const added = newCats.filter(c => !oldCats.includes(c));
      const mapping = {};

      if (removed.length > 0 && added.length > 0) {
        // Try index-based mapping first (if the elements changed at the same indices)
        const minLen = Math.min(oldCats.length, newCats.length);
        for (let i = 0; i < minLen; i++) {
          const oldVal = oldCats[i];
          const newVal = newCats[i];
          if (oldVal !== newVal && removed.includes(oldVal) && added.includes(newVal)) {
            mapping[oldVal] = newVal;
            // Remove from removed/added sets to avoid double mapping
            const remIdx = removed.indexOf(oldVal);
            if (remIdx > -1) removed.splice(remIdx, 1);
            const addIdx = added.indexOf(newVal);
            if (addIdx > -1) added.splice(addIdx, 1);
          }
        }

        // If there's still exactly one removed and one added remaining, map them
        if (removed.length === 1 && added.length === 1) {
          mapping[removed[0]] = added[0];
        } else if (removed.length > 0 && removed.length === added.length) {
          // If equal number of removed and added remain, map them in order of appearance
          for (let i = 0; i < removed.length; i++) {
            mapping[removed[i]] = added[i];
          }
        }
      }

      // If we identified category renames, update the stories in db
      if (Object.keys(mapping).length > 0) {
        console.log(`[Category Rename] Mapping for lang ${code}:`, mapping);
        if (db.stories && db.stories[code]) {
          db.stories[code] = db.stories[code].map(story => {
            if (story.category && mapping[story.category]) {
              return { ...story, category: mapping[story.category] };
            }
            return story;
          });
        }
      }

      // Check subcategories updates for each category in the new config
      const subcategoriesKey = code === "uz" ? "subcategoriesUz" : (code === "ru" ? "subcategoriesRu" : "subcategoriesUzk");
      const oldSubMap = db.config?.[subcategoriesKey] || {};
      const newSubMap = body.config?.[subcategoriesKey] || {};

      newCats.forEach(catName => {
        // Find old name if this category was renamed
        const oldCatName = Object.keys(mapping).find(key => mapping[key] === catName) || catName;
        const oldSubs = oldSubMap[oldCatName] || [];
        const newSubs = newSubMap[catName] || [];

        if (!newSubs || !Array.isArray(newSubs)) return;

        const subRemoved = oldSubs.filter(s => !newSubs.includes(s));
        const subAdded = newSubs.filter(s => !oldSubs.includes(s));
        const subMapping = {};

        if (subRemoved.length > 0 && subAdded.length > 0) {
          // Try index-based subcategory mapping
          const minSubLen = Math.min(oldSubs.length, newSubs.length);
          for (let i = 0; i < minSubLen; i++) {
            const oldVal = oldSubs[i];
            const newVal = newSubs[i];
            if (oldVal !== newVal && subRemoved.includes(oldVal) && subAdded.includes(newVal)) {
              subMapping[oldVal] = newVal;
              const remIdx = subRemoved.indexOf(oldVal);
              if (remIdx > -1) subRemoved.splice(remIdx, 1);
              const addIdx = subAdded.indexOf(newVal);
              if (addIdx > -1) subAdded.splice(addIdx, 1);
            }
          }

          if (subRemoved.length === 1 && subAdded.length === 1) {
            subMapping[subRemoved[0]] = subAdded[0];
          } else if (subRemoved.length > 0 && subRemoved.length === subAdded.length) {
            for (let i = 0; i < subRemoved.length; i++) {
              subMapping[subRemoved[i]] = subAdded[i];
            }
          }
        }

        // If subcategory renames are identified, update the stories in db
        if (Object.keys(subMapping).length > 0) {
          console.log(`[Subcategory Rename] Mapping for lang ${code}, category ${catName}:`, subMapping);
          if (db.stories && db.stories[code]) {
            db.stories[code] = db.stories[code].map(story => {
              if (story.category === catName && story.subcategory && subMapping[story.subcategory]) {
                return { ...story, subcategory: subMapping[story.subcategory] };
              }
              return story;
            });
          }
        }
      });
    });

    db.config = { ...(db.config || {}), ...(body.config || {}) };
    writeDb(db);
    sendJson(response, 200, { ok: true, config: db.config });
    return;
  }

  if (request.method === "POST" && pathname === "/api/admin/password") {
    const body = await readJson(request);
    if (!body.currentPassword || !verifyPassword(body.currentPassword, db.admin.passwordHash)) {
      sendJson(response, 400, { error: "Жорий парол нотўғри!" });
      return;
    }
    if (!body.password || body.password.length < 6) {
      sendJson(response, 400, { error: "Янги parol камида 6 та белгидан иборат бўлсин!" });
      return;
    }
    db.admin.passwordHash = hashPassword(body.password);
    writeDb(db);
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && pathname === "/api/admin/pin") {
    const body = await readJson(request);
    const currentPin = db.admin.pin || "1234";
    if (body.currentPin !== currentPin) {
      sendJson(response, 400, { error: "Жорий ПИН-код нотўғри!" });
      return;
    }
    if (!body.newPin || body.newPin.length !== 4 || isNaN(body.newPin)) {
      sendJson(response, 400, { error: "Янги ПИН-код 4 хонали рақам бўлиши керак!" });
      return;
    }
    db.admin.pin = body.newPin;
    writeDb(db);
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "GET" && pathname === "/api/admin/login-history") {
    sendJson(response, 200, {
      history: db.loginHistory || [],
      createdAt: db.admin.createdAt || "2026-06-01T10:00:00.000Z"
    });
    return;
  }

  if (request.method === "GET" && pathname === "/api/admin/ads/stats") {
    sendJson(response, 200, { adStats: db.adStats || {} });
    return;
  }

  if (request.method === "POST" && pathname === "/api/admin/upload") {
    const body = await readJson(request);
    const match = String(body.dataUrl || "").match(/^data:((image|video)\/(png|jpeg|jpg|webp|gif|svg\+xml|mp4|webm|ogg|mov));base64,(.+)$/);
    if (!match) {
      sendJson(response, 400, { error: "Fayl turi qabul qilinmadi" });
      return;
    }
    const subtype = match[3];
    const ext = subtype === "jpeg" ? "jpg" : (subtype === "svg+xml" ? "svg" : subtype);
    const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;
    const buffer = Buffer.from(match[4], "base64");
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      if (gcsBucket) {
        try {
          await gcsBucket.file("uploads/" + filename).save(buffer, { contentType: match[1], resumable: false });
          const gcsUrl = "https://storage.googleapis.com/" + process.env.GCS_BUCKET + "/uploads/" + filename;
          sendJson(response, 200, { url: gcsUrl, type: match[2] });
          return;
        } catch(e) { console.error("GCS img upload error", e); }
      }
    sendJson(response, 200, { url: `/uploads/${filename}`, type: match[2] });
    return;
  }

  if (request.method === "GET" && pathname === "/api/admin/media") {
    if (!requireAdmin(request, response)) return;
    const files = fs.existsSync(uploadDir)
      ? fs.readdirSync(uploadDir).map(name => {
          const ext = path.extname(name).toLowerCase();
          const stat = fs.statSync(path.join(uploadDir, name));
          return {
            name,
            url: `/uploads/${name}`,
            type: IMAGE_EXTS.has(ext) ? "image" : VIDEO_EXTS.has(ext) ? "video" : "other",
            size: stat.size,
            createdAt: stat.birthtimeMs,
          };
        }).filter(f => f.type !== "other").sort((a,b) => b.createdAt - a.createdAt)
      : [];
    sendJson(response, 200, { media: files });
    return;
  }

  if (request.method === "DELETE" && pathname.startsWith("/api/admin/media/")) {
    if (!requireAdmin(request, response)) return;
    const filename = path.basename(pathname.replace("/api/admin/media/", ""));
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath) && filePath.startsWith(uploadDir)) {
      fs.unlinkSync(filePath);
    }
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && pathname === "/api/admin/stories") {
    const body = await readJson(request);
    const lang = ["ru", "uzk"].includes(body.lang) ? body.lang : "uz";
    const item = normalizeStory(body.story);
    if (!db.stories[lang]) db.stories[lang] = [];
    db.stories[lang].unshift(item);
    if (lang === "uz") {
      if (!db.stories.uzk) db.stories.uzk = [];
      db.stories.uzk.unshift({ ...item });
    }
    writeDb(db);

    if (body.sendToTelegram && item.status === "published") {
      const baseUrl = `${request.headers["x-forwarded-proto"] || "http"}://${request.headers.host || "localhost"}`;
      const storyUrl = `${baseUrl}/news/${item.slug || item.id}`;
      const msgText = `<b>${item.title}</b>\n\n${item.summary || ""}\n\n🔗 <a href="${storyUrl}">Batafsil saytda o'qing</a>`;
      sendTelegramMessage(msgText, item.image, request);
    }

    sendJson(response, 200, { story: item, stories: db.stories });
    return;
  }

  const storyMatch = pathname.match(/^\/api\/admin\/stories\/(uz|ru|uzk)\/([^/]+)$/);
  if (storyMatch && request.method === "PUT") {
    const [, lang, id] = storyMatch;
    const body = await readJson(request);
    const index = db.stories[lang].findIndex((item) => item.id === id);
    if (index === -1) {
      sendJson(response, 404, { error: "Maqola topilmadi" });
      return;
    }
    const existing = db.stories[lang][index];
    const revisions = existing.revisions || [];
    const revision = {
      title: existing.title || "",
      summary: existing.summary || "",
      body: existing.body || "",
      updatedAt: existing.updatedAt || existing.createdAt || new Date().toISOString()
    };
    const updatedRevisions = [revision, ...revisions].slice(0, 5);
    
    db.stories[lang][index] = normalizeStory({
      ...existing,
      ...body.story,
      id,
      revisions: updatedRevisions
    });
    if (lang === "uz") {
      if (!db.stories.uzk) db.stories.uzk = [];
      const uzkIdx = db.stories.uzk.findIndex((item) => item.id === id);
      if (uzkIdx > -1) {
        db.stories.uzk[uzkIdx] = {
          ...db.stories.uzk[uzkIdx],
          ...body.story,
          id,
          revisions: updatedRevisions
        };
      } else {
        db.stories.uzk.unshift({
          ...normalizeStory(body.story),
          id,
          revisions: updatedRevisions
        });
      }
    }
    writeDb(db);

    const updatedItem = db.stories[lang][index];
    if (body.sendToTelegram && updatedItem.status === "published") {
      const baseUrl = `${request.headers["x-forwarded-proto"] || "http"}://${request.headers.host || "localhost"}`;
      const storyUrl = `${baseUrl}/news/${updatedItem.slug || updatedItem.id}`;
      const msgText = `<b>${updatedItem.title}</b>\n\n${updatedItem.summary || ""}\n\n🔗 <a href="${storyUrl}">Batafsil saytda o'qing</a>`;
      sendTelegramMessage(msgText, updatedItem.image, request);
    }

    sendJson(response, 200, { story: db.stories[lang][index], stories: db.stories });
    return;
  }

  if (storyMatch && request.method === "DELETE") {
    const [, lang, id] = storyMatch;
    db.stories[lang] = db.stories[lang].filter((item) => item.id !== id);
    if (lang === "uz") {
      db.stories.uzk = (db.stories.uzk || []).filter((item) => item.id !== id);
    }
    writeDb(db);
    sendJson(response, 200, { stories: db.stories });
    return;
  }

  if (request.method === "POST" && pathname === "/api/admin/reset") {
    let initialStories = seedStories;
    const storiesJsonPath = path.join(__dirname, "stories.json");
    if (fs.existsSync(storiesJsonPath)) {
      try {
        const storiesData = JSON.parse(fs.readFileSync(storiesJsonPath, "utf8"));
        if (storiesData && storiesData.stories) {
          initialStories = storiesData.stories;
        }
      } catch (e) {
        console.error("Error reading stories.json for reset:", e);
      }
    }
    db.stories = initialStories;
    writeDb(db);
    sendJson(response, 200, { stories: db.stories });
    return;
  }

  sendJson(response, 404, { error: "API topilmadi" });
}

function normalizeStory(input) {
  const now = new Date().toISOString();
  return {
    id: input.id || crypto.randomUUID(),
    category: String(input.category || "Siyosat").trim(),
    title: String(input.title || "").trim(),
    summary: String(input.summary || "").trim(),
    image: String(input.image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80").trim(),
    author: String(input.author || "Ishonch.uz tahririyati").trim(),
    time: String(input.time || "Hozir").trim(),
    read: String(input.read || "3 daqiqa").trim(),
    body: String(input.body || "").trim(),
    status: input.status === "draft" ? "draft" : "published",
    createdAt: input.createdAt || now,
    updatedAt: now,
    script: input.script || "latin",
    subcategory: input.subcategory || "",
    tags: input.tags || "",
    metaTitle: input.metaTitle || "",
    metaDesc: input.metaDesc || "",
    publishAt: input.publishAt || null,
    revisions: input.revisions || [],
  };
}

function serveStatic(request, response, pathname) {
  const requestPath = decodeURIComponent(pathname);
  let safePath = requestPath === "/" || requestPath === "/admin" || requestPath === "/admin/" ? "index.html" : requestPath;
  safePath = safePath.replace(/^[/\\]+/, "");
  
  let basePath = path.resolve(root);
  if (!safePath.startsWith("uploads") && !safePath.startsWith("data")) {
    const distPath = path.join(basePath, "dist");
    if (fs.existsSync(distPath)) {
      basePath = distPath;
    }
  }
  const filePath = path.resolve(basePath, safePath);

  if (!filePath.startsWith(basePath + path.sep) && filePath !== path.join(basePath, "index.html")) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (!path.extname(filePath)) {
        const indexPath = path.join(root, "index.html");
        fs.readFile(indexPath, "utf8", (err2, indexHtml) => {
          if (err2) {
            response.writeHead(404);
            response.end("Not found");
            return;
          }
          
          let processedHtml = indexHtml;
          const decodedPath = decodeURIComponent(pathname);
          const baseUrl = `${request.headers["x-forwarded-proto"] || "http"}://${request.headers.host || "localhost"}`;
          
          try {
            const db = readDb();
            const siteName = db.config?.siteName || "Ishonch.uz";
            const siteDesc = db.config?.descriptionUz || "Yetti sahifali zamonaviy o'zbekcha va ruscha yangiliklar sayti.";
            
            if (decodedPath.startsWith("/news/")) {
              const slugOrId = decodedPath.replace("/news/", "").split("/")[0];
              if (slugOrId) {
                let foundStory = null;
                let foundLang = null;
                for (const l of ["uz", "ru", "uzk"]) {
                  const match = (db.stories[l] || []).find(s => s.slug === slugOrId || s.id === slugOrId);
                  if (match) {
                    foundStory = match;
                    foundLang = l;
                    break;
                  }
                }
                
                if (foundStory) {
                  const title = foundStory.metaTitle || foundStory.title;
                  const description = foundStory.metaDesc || foundStory.summary;
                  const image = foundStory.image || "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80";
                  
                  const eTitle = escapeHtml(title);
                  const eDesc = escapeHtml(description);
                  const eImage = escapeHtml(image);
                  
                  const seoTags = `
    <title>${eTitle} — ${escapeHtml(siteName)}</title>
    <meta name="description" content="${eDesc}" />
    <meta property="og:title" content="${eTitle}" />
    <meta property="og:description" content="${eDesc}" />
    <meta property="og:image" content="${eImage}" />
    <meta property="og:url" content="${baseUrl}/news/${slugOrId}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${eTitle}" />
    <meta name="twitter:description" content="${eDesc}" />
    <meta name="twitter:image" content="${eImage}" />`;
                  
                  // Clean out existing default title and description
                  processedHtml = processedHtml
                    .replace(/<title>.*?<\/title>/gi, "")
                    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gis, "");
                  
                  // Inject new metadata before </head>
                  processedHtml = processedHtml.replace("</head>", seoTags + "\n  </head>");
                }
              }
            } else {
              // Inject dynamic site title and description for other pages
              processedHtml = processedHtml
                .replace(/<title>.*?<\/title>/gi, `<title>${siteName}</title>`)
                .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/gis, `<meta name="description" content="${siteDesc}" />`);
            }
          } catch (dbErr) {
            console.error("Error performing server-side SEO meta injection:", dbErr);
          }
          
          response.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "no-store",
          });
          response.end(processedHtml);
        });
        return;
      }
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(content);
  });
}

ensureDb();

const server = http.createServer((request, response) => {
  // CORS ruxsatlari (Backend alohida turganda Netlify ulanishi uchun)
  const origin = request.headers.origin;
  if (origin) {
    response.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    response.setHeader("Access-Control-Allow-Origin", "*");
  }
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);
  if (url.pathname.startsWith("/api/") || ["/rss.xml", "/rss-ru.xml", "/sitemap.xml", "/robots.txt"].includes(url.pathname)) {
    handleApi(request, response, url.pathname).catch((error) => {
      sendJson(response, 500, { error: error.message || "Server error" });
    });
    return;
  }
  serveStatic(request, response, url.pathname);
});

function listen(port, attemptsLeft = 20) {
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && attemptsLeft > 0) {
      listen(port + 1, attemptsLeft - 1);
      return;
    }
    throw error;
  });

  async function startApp() {
  if (gcsBucket) {
    try {
      const file = gcsBucket.file("db.json");
      const [exists] = await file.exists();
      if (exists) {
        await file.download({ destination: dbPath });
        console.log("db.json GCS'dan yuklab olindi.");
      } else {
        ensureDb();
        await gcsBucket.upload(dbPath, { destination: "db.json" });
        console.log("GCS'ga yangi db.json yaratildi.");
      }
    } catch(e) { console.error("GCS startup error:", e.message); }
  }
  server.listen(port, "0.0.0.0", () => {
    console.log(`Ishonch.uz is running locally: http://localhost:${port}`);
    
    // Find and display local network IPs
    const os = require("os");
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
      for (const net of networkInterfaces[interfaceName]) {
        if (net.family === "IPv4" && !net.internal) {
          console.log(`Access on your local network: http://${net.address}:${port}`);
        }
      }
    }
  });
}
startApp();
}

listen(preferredPort);

async function sendTelegramMessage(text, image = null, request = null) {
  const db = readDb();
  const token = db.config?.telegramBotToken || "";
  const chatId = db.config?.telegramChatId || "";
  
  if (!token.trim() || !chatId.trim()) {
    console.log("Telegram bot token or chat ID is missing, skipping Telegram post.");
    return false;
  }
  
  const https = require("https");
  const path = require("path");
  const fs = require("fs");
  
  try {
    let isLocalImage = false;
    let localImagePath = "";
    
    if (image && image.startsWith("/uploads/")) {
      isLocalImage = true;
      localImagePath = path.join(root, "uploads", path.basename(image));
    }
    
    if (isLocalImage && fs.existsSync(localImagePath)) {
      console.log(`Auto-posting with local image upload to Telegram: ${localImagePath}`);
      const boundary = "----WebKitFormBoundary" + crypto.randomBytes(8).toString("hex");
      const filename = path.basename(localImagePath);
      
      let mimeType = "image/jpeg";
      if (filename.toLowerCase().endsWith(".png")) mimeType = "image/png";
      else if (filename.toLowerCase().endsWith(".webp")) mimeType = "image/webp";
      else if (filename.toLowerCase().endsWith(".gif")) mimeType = "image/gif";
      else if (filename.toLowerCase().endsWith(".svg")) mimeType = "image/svg+xml";
      
      const fileBuffer = fs.readFileSync(localImagePath);
      
      const payloadHeader = 
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="chat_id"\r\n\r\n${chatId}\r\n` +
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="caption"\r\n\r\n${text}\r\n` +
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="parse_mode"\r\n\r\nHTML\r\n` +
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="photo"; filename="${filename}"\r\n` +
        `Content-Type: ${mimeType}\r\n\r\n`;
        
      const payloadFooter = `\r\n--${boundary}--\r\n`;
      const totalLength = Buffer.byteLength(payloadHeader) + fileBuffer.length + Buffer.byteLength(payloadFooter);
      
      const url = `https://api.telegram.org/bot${token}/sendPhoto`;
      const req = https.request(url, {
        method: "POST",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${boundary}`,
          "Content-Length": totalLength
        }
      }, (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => console.log("Telegram upload response:", body));
      });
      
      req.on("error", e => console.error("Telegram upload request error:", e));
      req.write(payloadHeader);
      req.write(fileBuffer);
      req.write(payloadFooter);
      req.end();
      return true;
    } else if (image && (image.startsWith("http://") || image.startsWith("https://")) && !image.includes("localhost") && !image.includes("127.0.0.1")) {
      console.log(`Auto-posting with public image URL to Telegram: ${image}`);
      const url = `https://api.telegram.org/bot${token}/sendPhoto`;
      const postData = JSON.stringify({
        chat_id: chatId,
        photo: image,
        caption: text,
        parse_mode: "HTML"
      });
      
      const req = https.request(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData)
        }
      }, (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => console.log("Telegram URL photo response:", body));
      });
      
      req.on("error", e => console.error("Telegram photo request error:", e));
      req.write(postData);
      req.end();
      return true;
    } else {
      console.log("Auto-posting text message to Telegram");
      const url = `https://api.telegram.org/bot${token}/sendMessage`;
      const postData = JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: false
      });
      
      const req = https.request(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData)
        }
      }, (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => console.log("Telegram text message response:", body));
      });
      
      req.on("error", e => console.error("Telegram message request error:", e));
      req.write(postData);
      req.end();
      return true;
    }
  } catch (err) {
    console.error("Failed to execute sendTelegramMessage:", err);
    return false;
  }
}

function getLocalSeoFallback(title, body, type) {
  const allText = ((title || "") + " " + (body || "")).toLowerCase();
  
  const words = allText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "").split(/\s+/).filter(w => w.length > 3);
  
  const stopwords = new Set([
    "bilan", "uchun", "orqali", "tufayli", "haqida", "keyin", "avval", "ammo", "lekin", "balki", "chunki", "yoki", "hamda", "shuningdek", "bo'lib", "yaxshi", "kabi",
    "для", "или", "что", "как", "все", "это", "они", "был", "была", "быlo", "были", "его", "нее", "ними", "него", "один", "одна", "одно", "одни"
  ]);
  
  const freqMap = {};
  for (const w of words) {
    if (!stopwords.has(w)) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }
  }
  
  const sortedKeywords = Object.keys(freqMap)
    .sort((a, b) => freqMap[b] - freqMap[a])
    .slice(0, 6);

  let metaTitle = title;
  if (!metaTitle.includes("Ishonch.uz")) {
    metaTitle = `${title} | Ishonch.uz`;
  }
  if (metaTitle.length > 65) {
    metaTitle = title.slice(0, 50) + "... | Ishonch.uz";
  }

  let metaDesc = body.slice(0, 150).trim();
  if (metaDesc.length > 0) {
    const lastSpace = metaDesc.lastIndexOf(" ");
    if (lastSpace > 100) {
      metaDesc = metaDesc.slice(0, lastSpace);
    }
    metaDesc = metaDesc + "... Batafsil Ishonch.uz saytida mutolaa qiling.";
  } else {
    metaDesc = `${title}. So'nggi yangiliklar, voqealar va tahlillar Ishonch.uz portalida.`;
  }

  let tags = sortedKeywords.join(", ");
  if (!tags) {
    tags = "yangiliklar, ishonch, o'zbekiston, tahlil";
  }

  const suggestions = [];
  if (title.length < 40) {
    suggestions.push("Sarlavhani biroz kengaytiring (ideal holda 40-65 belgi bo'lishi kerak).");
  }
  const bodyWords = body.split(/\s+/).filter(Boolean).length;
  if (bodyWords < 150) {
    suggestions.push("Maqola matni qisqa. Tafsilotlarni ko'paytirish qidiruv tizimlarida yaxshiroq indekslanishiga yordam beradi.");
  }
  if (sortedKeywords.length < 4) {
    suggestions.push("Matnda kalit so'zlar kam uchramoqda. Mavzuga oid muhim atamalarni ko'proq ishlating.");
  }

  return {
    metaTitle,
    metaDesc,
    tags,
    suggestions,
    source: "local-heuristic"
  };
}

