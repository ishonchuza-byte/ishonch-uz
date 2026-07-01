const fs = require('fs');
const http = require('https');
const path = require('path');

const BABEL_URL = 'https://unpkg.com/@babel/standalone@7.24.0/babel.min.js';
const babelCachePath = path.join(__dirname, 'babel.min.js');

function downloadBabel(callback) {
  if (fs.existsSync(babelCachePath)) {
    return callback(null, fs.readFileSync(babelCachePath, 'utf8'));
  }
  console.log('Downloading @babel/standalone...');
  const file = fs.createWriteStream(babelCachePath);
  http.get(BABEL_URL, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      callback(null, fs.readFileSync(babelCachePath, 'utf8'));
    });
  }).on('error', err => {
    fs.unlink(babelCachePath, () => {});
    callback(err);
  });
}

downloadBabel((err, babelCode) => {
  if (err) {
    console.error('Failed to download Babel:', err);
    process.exit(1);
  }

  // Load Babel Standalone into global context
  const vm = require('vm');
  const context = {
    console: console,
    process: process,
    exports: {},
    module: { exports: {} }
  };
  context.window = context;
  context.global = context;
  context.self = context;
  
  vm.createContext(context);
  vm.runInContext(babelCode, context);

  const Babel = context.exports;
  if (!Babel || typeof Babel.transform !== 'function') {
    console.error('Babel not loaded in context.');
    process.exit(1);
  }

  console.log('Reading app.jsx...');
  const sourceCode = fs.readFileSync(path.join(__dirname, '../app.jsx'), 'utf8');

  console.log('Compiling app.jsx with Babel...');
  try {
    const result = Babel.transform(sourceCode, {
      presets: ['react'],
      filename: 'app.jsx'
    });
    console.log('Successfully compiled app.jsx!');
  } catch (compilationError) {
    console.error('Babel Compilation Failed:');
    console.error(compilationError.message);
    if (compilationError.loc) {
      console.error(`Error at line ${compilationError.loc.line}, column ${compilationError.loc.column}`);
      // Show code snippet around error
      const lines = sourceCode.split('\n');
      const errLine = compilationError.loc.line - 1;
      const startLine = Math.max(0, errLine - 5);
      const endLine = Math.min(lines.length - 1, errLine + 5);
      for (let i = startLine; i <= endLine; i++) {
        const prefix = i === errLine ? ' > ' : '   ';
        console.error(`${prefix}${i + 1}: ${lines[i]}`);
      }
    }
    process.exit(1);
  }
});
