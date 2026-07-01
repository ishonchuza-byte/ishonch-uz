const fs = require('fs');
const imgPath = 'C:\\Users\\Xp11\\.gemini\\antigravity\\brain\\d4445686-a820-4f5a-8d94-cd4d350be8a9\\media__1781764185037.png';

// Simple PNG decoder for alpha channel check
const buffer = fs.readFileSync(imgPath);

// Let's check pixel opacity on the right half of the image
// Since we don't have a png parsing library pre-installed, we can quickly install 'pngjs' or use a lightweight approach.
// Let's use npm to run a quick script if needed, or we can just convert the image to see it.
// Actually, we can run a powershell script or use node to check if the image has white text.
// Wait, we can install pngjs locally in a temp folder or workspace.
// Let's run npm install pngjs to parse the image, it's very fast.
console.log('Installing pngjs...');
const execSync = require('child_process').execSync;
execSync('npm install pngjs', { stdio: 'inherit' });

const PNG = require('pngjs').PNG;
const data = fs.readFileSync(imgPath);
const png = PNG.sync.read(data);

console.log(`Parsed PNG. Width: ${png.width}, Height: ${png.height}`);

// Let's scan pixels and find the bounding box of non-transparent pixels
let minX = png.width, maxX = 0, minY = png.height, maxY = 0;
let hasWhitePixelsOnRight = false;

for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];
    const a = png.data[idx + 3];

    if (a > 10) { // non-transparent
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;

      // Check if it's a white pixel (r, g, b close to 255) on the right half
      if (x > png.width / 2 && r > 200 && g > 200 && b > 200) {
        hasWhitePixelsOnRight = true;
      }
    }
  }
}

console.log(`Bounding box of visible content: X: ${minX} to ${maxX}, Y: ${minY} to ${maxY}`);
console.log(`Has visible content on the right half: ${maxX > png.width / 2}`);
console.log(`Has white pixels on the right half: ${hasWhitePixelsOnRight}`);
