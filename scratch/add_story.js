const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');
const storiesPath = path.join(__dirname, '../stories.json');

const newId = "a93b4827-0cf7-4f4c-b16c-dfc581a94e1d";
const newIdUzk = "uzk-007";
const image = "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80";
const createdAt = "2026-06-18T11:15:00.000Z";

const newStoryUz = {
  id: newId,
  category: "Texnologiya",
  title: "Toshkent ko'chalarida ilk bor elektrobuslar uchun intellektual boshqaruv tizimi sinovdan o'tkazilmoqda",
  summary: "Yangi raqamli tizim yo'nalishlarni optimallashtirish, quvvatlash stansiyalari navbatini boshqarish va yo'lovchi oqimini hisoblash imkonini beradi.",
  image: image,
  author: "Sardor Alimov",
  time: "Hozir",
  read: "5 daqiqa",
  body: "Toshkent shahrida jamoat transporti tizimini raqamlashtirish bo'yicha yangi loyiha boshlandi. Elektrobuslarga o'rnatilgan intellektual datchiklar yordamida yo'llardagi tirbandliklar va quvvat sarfi real vaqt rejimida tahlil qilinadi. Bu esa o'z navbatida yo'nalishlardagi kutilish vaqtini 15 foizga kamaytirishga xizmat qiladi. Tahririyat ushbu mavzuni kuzatishda davom etadi va yangi tafsilotlar paydo bo'lishi bilan materialni yangilaydi.",
  script: "latin",
  status: "published",
  createdAt: createdAt,
  updatedAt: createdAt
};

const newStoryRu = {
  id: newId,
  category: "Технологии",
  title: "На улицах Ташкента впервые тестируется интеллектуальная система управления электробусами",
  summary: "Новая цифровая система позволяет оптимизировать маршруты, управлять очередями на зарядных станциях и подсчитывать пассажиропоток.",
  image: image,
  author: "Сардор Алимов",
  time: "Hozir",
  read: "5 daqiqa",
  body: "В Ташкенте стартовал новый проект по цифровизации системы общественного транспорта. Интеллектуальные датчики, установленные на электробусах, анализируют пробки и энергопотребление в режиме реального времени. Это позволит сократить время ожидания на маршрутах на 15 процентов. Редакция продолжает следить за этой темой и будет обновлять материал по мере появления новых подробностей.",
  status: "published",
  createdAt: createdAt,
  updatedAt: createdAt
};

const newStoryUzk = {
  id: newIdUzk,
  category: "Технология",
  title: "Тошкент кўчаларида илк бор электробуслар учун интеллектуал бошқарув тизими синовдан ўтказилмоқда",
  summary: "Янги рақамли тизим йўналишларни оптималлаштириш, қувватлаш станциялари навбатини бошқариш ва йўловчи оқимини ҳисоблаш имконини беради.",
  image: image,
  author: "Сардор Алимов",
  time: "Hozir",
  read: "5 дақиқа",
  body: "Тошкент шаҳрида жамоат транспорти тизимини рақамлаштириш бўйича янги лойиҳа бошланди. Электробусларга ўрнатилган интеллектуал датчиклар ёрдамида йўллардаги тирбандликлар ва қувват сарфи реал вақт режимида таҳлил қилинади. Бу эса ўз навбатида йўналишлардаги кутилиш вақтини 15 фоизга камайтиришга хизмат қилади. Таҳририят ушбу мавзуни кузатишда давом этади ва янги тафсилотлар пайдо бўлиши билан материални янгилайди.",
  status: "published",
  createdAt: createdAt,
  updatedAt: createdAt
};

function updateJsonFile(filePath, isDbFile) {
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return;
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  let data = JSON.parse(fileContent);

  const storiesObj = isDbFile ? data.stories : data.stories;

  // Prevent duplicate insertion
  storiesObj.uz = storiesObj.uz.filter(s => s.id !== newId);
  storiesObj.ru = storiesObj.ru.filter(s => s.id !== newId);
  if (storiesObj.uzk) {
    storiesObj.uzk = storiesObj.uzk.filter(s => s.id !== newIdUzk);
  }

  // Push new stories
  storiesObj.uz.push(newStoryUz);
  storiesObj.ru.push(newStoryRu);
  if (storiesObj.uzk) {
    storiesObj.uzk.push(newStoryUzk);
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Successfully updated ${filePath}`);
}

updateJsonFile(dbPath, true);
updateJsonFile(storiesPath, false);
console.log('Update process completed.');
