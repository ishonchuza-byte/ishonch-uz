const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'app.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Normalize line endings to LF
content = content.replace(/\r\n/g, '\n');

// 1. Update activeContacts memo definition
const targetActiveContacts = `  const activeContacts = useMemo(() => {
    const list = lang === "ru" ? siteConfig.contactRu : siteConfig.contactUz;
    if (!list || list.length === 0) {
      return lang === "ru" ? copy.ru.contact : copy.uz.contact;
    }
    return list.map(c => [c.title, c.value]);
  }, [lang, siteConfig]);`;

const replacementActiveContacts = `  const activeContacts = useMemo(() => {
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
  }, [lang, siteConfig]);`;

if (content.includes(targetActiveContacts)) {
  content = content.replace(targetActiveContacts, replacementActiveContacts);
  console.log("✓ Updated activeContacts memo");
} else {
  console.log("⚠️ activeContacts target pattern not found");
}

// 2. Update drawer section to render all contacts
const targetDrawer = `          <div className="drawer-section">
            <h4>{lang !== "ru" ? "Bog'lanish" : "Контакты"}</h4>
            <p style={{fontSize: 14, color: "var(--muted)", lineHeight: 1.5, margin: "8px 0 0"}}>
              <strong>{activeContacts[0]?.[0] || ""}:</strong> {activeContacts[0]?.[1] || ""}<br/>
              <strong>{activeContacts[1]?.[0] || ""}:</strong> {activeContacts[1]?.[1] || ""}
            </p>
          </div>`;

const replacementDrawer = `          <div className="drawer-section">
            <h4>{lang !== "ru" ? "Bog'lanish" : "Контакты"}</h4>
            <p style={{fontSize: 14, color: "var(--muted)", lineHeight: 1.5, margin: "8px 0 0"}}>
              {activeContacts.map(([title, val]) => (
                <span key={title} style={{display: "block", marginBottom: "4px"}}>
                  <strong>{title}:</strong> {val}
                </span>
              ))}
            </p>
          </div>`;

if (content.includes(targetDrawer)) {
  content = content.replace(targetDrawer, replacementDrawer);
  console.log("✓ Updated drawer contacts display");
} else {
  console.log("⚠️ Drawer target pattern not found");
}

// 3. Update ContactPage instantiations to pass siteConfig
const targetContactPageRender = `            <ContactPage t={t} page={page} />`;
const replacementContactPageRender = `            <ContactPage t={t} page={page} siteConfig={siteConfig} />`;

if (content.includes(targetContactPageRender)) {
  content = content.replace(targetContactPageRender, replacementContactPageRender);
  console.log("✓ Updated ContactPage instantiation in App");
} else {
  console.log("⚠️ ContactPage instantiation target pattern not found");
}

// 4. Update ContactPage function signature
const targetContactPageSig = `function ContactPage({ t, page }) {`;
const replacementContactPageSig = `function ContactPage({ t, page, siteConfig }) {`;

if (content.includes(targetContactPageSig)) {
  content = content.replace(targetContactPageSig, replacementContactPageSig);
  console.log("✓ Updated ContactPage function signature");
} else {
  console.log("⚠️ ContactPage function signature target pattern not found");
}

// 5. Update ContactPage inner rendering of t.contact
const targetContactPageCards = `            {t.contact.map(([title, text]) => (
              <div className="contact-card" key={title} style={{padding: "16px", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "8px"}}>
                <strong>{title}</strong>
                <p style={{margin: "8px 0 0 0", color: "var(--muted)", fontSize: "14px"}}>{text}</p>
              </div>
            ))}`;

const replacementContactPageCards = `            {(() => {
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
            })()}`;

if (content.includes(targetContactPageCards)) {
  content = content.replace(targetContactPageCards, replacementContactPageCards);
  console.log("✓ Updated ContactPage cards list to support siteConfig properties");
} else {
  console.log("⚠️ ContactPage cards list pattern not found");
}

// Write back with CRLF line endings
fs.writeFileSync(filePath, content.replace(/\n/g, '\r\n'), 'utf8');
console.log("App.jsx contacts update complete.");
