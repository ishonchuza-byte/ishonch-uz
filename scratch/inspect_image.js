const fs = require('fs');
const path = require('path');

const imgPath = 'C:\\Users\\Xp11\\.gemini\\antigravity\\brain\\d4445686-a820-4f5a-8d94-cd4d350be8a9\\media__1781764185037.png';

// Read the PNG signature and basic headers
const buffer = fs.readFileSync(imgPath);
console.log('File size:', buffer.length, 'bytes');

// Check PNG format
if (buffer.readUInt32BE(0) === 0x89504E47) {
  console.log('Valid PNG image.');
  // Find IHDR chunk
  let pos = 8;
  while (pos < buffer.length) {
    const length = buffer.readUInt32BE(pos);
    const type = buffer.toString('ascii', pos + 4, pos + 8);
    if (type === 'IHDR') {
      const width = buffer.readUInt32BE(pos + 8);
      const height = buffer.readUInt32BE(pos + 12);
      const bitDepth = buffer[pos + 16];
      const colorType = buffer[pos + 17];
      console.log(`Dimensions: ${width}x${height}`);
      console.log(`Bit Depth: ${bitDepth}, Color Type: ${colorType} (6 = RGBA)`);
      break;
    }
    pos += 12 + length;
  }
} else {
  console.log('Not a valid PNG.');
}
