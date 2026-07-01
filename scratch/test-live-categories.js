const http = require('http');

async function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTest() {
  console.log("Starting Live Server Categories Rename Test...");
  const host = 'localhost';
  const port = 5173;

  try {
    // 1. Log in
    console.log("1. Logging in...");
    const loginData = JSON.stringify({ password: 'admin2026' });
    const loginRes = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(loginData)
      }
    }, loginData);

    if (loginRes.statusCode !== 200) {
      console.error(`Login failed: ${loginRes.statusCode} - ${loginRes.body}`);
      process.exit(1);
    }

    console.log("Login successful!");
    
    // Extract yk_session cookie
    const setCookie = loginRes.headers['set-cookie'];
    if (!setCookie || !setCookie[0]) {
      console.error("No Set-Cookie header received!");
      process.exit(1);
    }
    const cookie = setCookie[0].split(';')[0];
    console.log(`Using cookie: ${cookie}`);

    // 2. Fetch current config
    console.log("2. Fetching current config...");
    const configRes = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/config',
      method: 'GET'
    });
    
    const configData = JSON.parse(configRes.body);
    const originalConfig = configData.config;
    console.log("Loaded config successfully.");

    // 3. Fetch stories list to check initial categories
    console.log("3. Fetching stories to find initial category counts...");
    const storiesRes = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/stories',
      method: 'GET'
    });
    const storiesData = JSON.parse(storiesRes.body);
    const initialUzStories = storiesData.stories?.uz || [];
    
    // Find a category name that has articles or use the first one from categoriesUz
    const categoriesUz = originalConfig.categoriesUz || ["Siyosat", "Iqtisod", "Texnologiya", "Sport", "Madaniyat", "Tahlil"];
    const targetCat = categoriesUz[0]; // e.g. "Siyosat"
    const countBefore = initialUzStories.filter(s => s.category === targetCat).length;
    console.log(`Stories in '${targetCat}' before rename: ${countBefore}`);

    // Define the new categories list (renaming targetCat to 'Siyosat Yangi' or similar)
    const renamedCat = targetCat + " Yangi";
    const nextCategoriesUz = categoriesUz.map(c => c === targetCat ? renamedCat : c);

    console.log(`4. Renaming category '${targetCat}' -> '${renamedCat}'...`);
    const updatePayload = JSON.stringify({
      config: {
        ...originalConfig,
        categoriesUz: nextCategoriesUz
      }
    });

    const updateRes = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/admin/config',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(updatePayload),
        'Cookie': cookie
      }
    }, updatePayload);

    if (updateRes.statusCode !== 200) {
      console.error(`Update failed: ${updateRes.statusCode} - ${updateRes.body}`);
      process.exit(1);
    }

    console.log("Config update succeeded!");

    // 5. Fetch stories again and verify that stories category was updated
    console.log("5. Verifying story category renaming on server...");
    const storiesAfterRes = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/stories',
      method: 'GET'
    });
    const storiesAfterData = JSON.parse(storiesAfterRes.body);
    const uzStoriesAfter = storiesAfterData.stories?.uz || [];

    const countTargetAfter = uzStoriesAfter.filter(s => s.category === targetCat).length;
    const countRenamedAfter = uzStoriesAfter.filter(s => s.category === renamedCat).length;

    console.log(`Stories in '${targetCat}' after: ${countTargetAfter}`);
    console.log(`Stories in '${renamedCat}' after: ${countRenamedAfter}`);

    // Clean up: restore original config
    console.log("6. Restoring original categories list...");
    const restorePayload = JSON.stringify({
      config: {
        ...originalConfig,
        categoriesUz: categoriesUz
      }
    });
    await makeRequest({
      hostname: host,
      port: port,
      path: '/api/admin/config',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(restorePayload),
        'Cookie': cookie
      }
    }, restorePayload);

    if (countTargetAfter === 0 && countRenamedAfter === countBefore) {
      console.log("\n★★★ ALL TESTS PASSED SUCCESSFULLY! ★★★");
    } else {
      console.error("\n✕ TEST FAILED: Stories categories were not properly renamed!");
      process.exit(1);
    }

  } catch (err) {
    console.error("Test error:", err);
    process.exit(1);
  }
}

runTest();
