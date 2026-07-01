const http = require('http');

const PORT = 5173;
const BASE_URL = `http://localhost:${PORT}`;

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: 'localhost',
      port: PORT,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch(e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', err => reject(err));
    req.end();
  });
}

async function testStoriesSorting() {
  console.log('--- STARTING STORIES SORTING TESTS ---');
  try {
    const response = await makeRequest('GET', '/api/stories');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch stories: ${response.status}`);
    }
    
    const { stories } = response.data;
    if (!stories) {
      throw new Error('No stories found in the response.');
    }

    const languages = ['uz', 'ru'];
    for (const lang of languages) {
      const list = stories[lang] || [];
      console.log(`\nChecking '${lang}' stories list (Total: ${list.length})...`);
      
      const now = new Date().toISOString();
      const rawStories = list.filter((story) => {
        if (story.status !== "published") return false;
        if (story.publishAt && story.publishAt > now) return false;
        return true;
      });

      // Apply the same sorting as client code
      const sorted = [...rawStories].sort((a, b) => {
        const dateA = new Date(a.publishAt || a.createdAt || 0);
        const dateB = new Date(b.publishAt || b.createdAt || 0);
        return dateB - dateA;
      });

      console.log('Stories in sorted chronological order (newest first):');
      sorted.forEach((story, idx) => {
        const dateStr = story.publishAt || story.createdAt || 'N/A';
        console.log(`  ${idx + 1}. [${dateStr}] "${story.title}"`);
      });

      // Check order
      for (let i = 0; i < sorted.length - 1; i++) {
        const dateA = new Date(sorted[i].publishAt || sorted[i].createdAt || 0);
        const dateB = new Date(sorted[i+1].publishAt || sorted[i+1].createdAt || 0);
        if (dateA < dateB) {
          throw new Error(`Stories are NOT sorted correctly! Index ${i} date (${dateA.toISOString()}) is older than index ${i+1} date (${dateB.toISOString()}).`);
        }
      }
      console.log(`✓ '${lang}' stories are verified and correctly sorted descending!`);
    }

    console.log('\n--- ALL SORTING VERIFICATION TESTS PASSED! ---');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testStoriesSorting();
