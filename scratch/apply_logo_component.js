const fs = require('fs');
const path = require('path');

const appJsxPath = path.join(__dirname, '../app.jsx');
let content = fs.readFileSync(appJsxPath, 'utf8');

// 1. Define the Logo component
const logoComponentDef = `
function Logo({ height = 36 }) {
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
      <text x="40" y="25" fontFamily="Inter, ui-sans-serif, system-ui, sans-serif" fontWeight="900" fontSize="21" fill="currentColor" letterSpacing="-0.5">Ishonch.uz</text>
    </svg>
  );
}
`;

// Insert the definition right before 'function WeatherBar'
const weatherBarIndex = content.indexOf('function WeatherBar');
if (weatherBarIndex !== -1) {
  content = content.slice(0, weatherBarIndex) + logoComponentDef + '\n\n' + content.slice(weatherBarIndex);
  console.log('Successfully inserted Logo component definition.');
} else {
  console.error('Could not find function WeatherBar to insert Logo definition');
  process.exit(1);
}

// 2. Replace the image tags
// Header navbar
content = content.replace(
  '<img src="/uploads/logo.svg" alt="Ishonch.uz Logo" style={{ height: "36px", objectFit: "contain" }} />',
  '<Logo height={36} />'
);

// Drawer header
content = content.replace(
  '<img src="/uploads/logo.svg" alt="Ishonch.uz Logo" style={{ height: "32px", objectFit: "contain" }} />',
  '<Logo height={32} />'
);

// Admin CMS login screen
content = content.replace(
  '<img src="/uploads/logo.svg" alt="Ishonch.uz Logo" style={{ height: "42px", borderRadius: "8px", objectFit: "contain" }} />',
  '<Logo height={42} />'
);

// Admin sidebar logo
content = content.replace(
  '<img src="/uploads/logo.svg" alt="Ishonch.uz Logo" style={{ height: "36px", borderRadius: "6px", objectFit: "contain" }} />',
  '<Logo height={32} />'
);

// Footer logo
content = content.replace(
  '<img src="/uploads/logo.svg" alt="Ishonch.uz Logo" style={{ height: "42px", borderRadius: "8px", objectFit: "contain" }} />',
  '<Logo height={42} />'
);

fs.writeFileSync(appJsxPath, content, 'utf8');
console.log('Successfully replaced all logo img tags in app.jsx');
