const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\Xp11\\.gemini\\antigravity\\brain\\d4445686-a820-4f5a-8d94-cd4d350be8a9\\.system_generated\\logs\\transcript.jsonl';

if (!fs.existsSync(logPath)) {
  console.error('Log file not found');
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n').filter(Boolean);
console.log(`Loaded ${lines.length} lines from log.`);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('DEFAULT_PASSWORD')) {
    console.log(`Line ${i}: length ${line.length}, start: ${line.substring(0, 150)}`);
  }
}
