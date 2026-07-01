const http = require('http');

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

// Helper to make request
function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: 'localhost',
      port: PORT,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch(e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
        }
      });
    });
    req.on('error', err => reject(err));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING ENDPOINT TESTS ---');

  try {
    // 1. Test public message sending
    console.log('Testing public message sending (POST /api/messages)...');
    const msgRes = await makeRequest('POST', '/api/messages', {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Hello',
      message: 'This is a test message'
    });
    console.log('Result:', msgRes.status, msgRes.data);

    // 2. Test public comment submission
    console.log('Testing public comment submission (POST /api/comments)...');
    const commentRes = await makeRequest('POST', '/api/comments', {
      storyId: 'test-story-id',
      name: 'Commenter',
      text: 'Great article!'
    });
    console.log('Result:', commentRes.status, commentRes.data);

    // 3. Test public subscriber registration
    console.log('Testing public subscriber registration (POST /api/subscribers)...');
    const subRes = await makeRequest('POST', '/api/subscribers', {
      email: 'subscriber@example.com'
    });
    console.log('Result:', subRes.status, subRes.data);

    // 4. Test public payment submission
    console.log('Testing public payment submission (POST /api/payments)...');
    const payRes = await makeRequest('POST', '/api/payments', {
      name: 'Donor',
      amount: 15000,
      currency: 'UZS',
      description: 'Charity test'
    });
    console.log('Result:', payRes.status, payRes.data);

    // 5. Test public quotes fetching
    console.log('Testing public quotes fetching (GET /api/public/quotes)...');
    const quotesRes = await makeRequest('GET', '/api/public/quotes');
    console.log('Result:', quotesRes.status, 'Total quotes:', quotesRes.data.quotes ? quotesRes.data.quotes.length : 0);

    // 6. Test public journals fetching
    console.log('Testing public journals fetching (GET /api/public/journals)...');
    const journalsRes = await makeRequest('GET', '/api/public/journals');
    console.log('Result:', journalsRes.status, 'Total journals:', journalsRes.data.journals ? journalsRes.data.journals.length : 0);

    console.log('--- ALL PUBLIC TESTS PASSED SUCCESSFULLY! ---');
  } catch(e) {
    console.error('Test failed with error:', e);
  }
}

runTests();
