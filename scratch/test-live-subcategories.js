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
  console.log("Starting Live Server Subcategories End-to-End Test...");
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

    const setCookie = loginRes.headers['set-cookie'];
    const cookie = setCookie[0].split(';')[0];

    // 2. Fetch current config
    console.log("2. Fetching current config...");
    const configRes = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/config',
      method: 'GET'
    });
    const originalConfig = JSON.parse(configRes.body).config;

    // 3. Configure Siyosat with 'Mahalliy' subcategory
    console.log("3. Configuring 'Siyosat' with 'Mahalliy' subcategory...");
    const nextSubcategoriesUz = {
      ...(originalConfig.subcategoriesUz || {}),
      "Siyosat": ["Mahalliy", "Xalqaro"]
    };
    const configPayload = JSON.stringify({
      config: {
        ...originalConfig,
        subcategoriesUz: nextSubcategoriesUz
      }
    });

    const configUpdateRes = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/admin/config',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(configPayload),
        'Cookie': cookie
      }
    }, configPayload);

    if (configUpdateRes.statusCode !== 200) {
      console.error(`Config update failed: ${configUpdateRes.body}`);
      process.exit(1);
    }
    console.log("Config update succeeded!");

    // 4. Create a test story with subcategory 'Mahalliy'
    console.log("4. Creating a test story with subcategory 'Mahalliy'...");
    const storyPayload = JSON.stringify({
      lang: "uz",
      story: {
        category: "Siyosat",
        subcategory: "Mahalliy",
        title: "Test Live Subcategory Story",
        summary: "This is a test story for live subcategory verification",
        body: "<p>Live test body content</p>",
        status: "published",
        author: "Test Suite"
      }
    });

    const createStoryRes = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/admin/stories',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(storyPayload),
        'Cookie': cookie
      }
    }, storyPayload);

    if (createStoryRes.statusCode !== 200) {
      console.error(`Story creation failed: ${createStoryRes.body}`);
      process.exit(1);
    }
    const createdStory = JSON.parse(createStoryRes.body).story;
    console.log(`Story created successfully with ID: ${createdStory.id}`);

    // 5. Verify story is available and has correct subcategory
    console.log("5. Fetching public stories to verify subcategory...");
    const storiesRes = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/stories',
      method: 'GET'
    });
    const storiesList = JSON.parse(storiesRes.body).stories?.uz || [];
    const foundStory = storiesList.find(s => s.id === createdStory.id);

    if (!foundStory || foundStory.subcategory !== "Mahalliy") {
      console.error("Verification failed: Created story not found or subcategory mismatch!");
      process.exit(1);
    }
    console.log("Verification succeeded: subcategory is 'Mahalliy'.");

    // 6. Rename subcategory 'Mahalliy' -> 'Mahalliy O\'zgargan'
    console.log("6. Renaming subcategory 'Mahalliy' -> 'Mahalliy O\'zgargan'...");
    const nextSubcategoriesUz2 = {
      ...(originalConfig.subcategoriesUz || {}),
      "Siyosat": ["Mahalliy O'zgargan", "Xalqaro"]
    };
    const configPayload2 = JSON.stringify({
      config: {
        ...originalConfig,
        subcategoriesUz: nextSubcategoriesUz2
      }
    });

    const configUpdateRes2 = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/admin/config',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(configPayload2),
        'Cookie': cookie
      }
    }, configPayload2);

    if (configUpdateRes2.statusCode !== 200) {
      console.error(`Config update 2 failed: ${configUpdateRes2.body}`);
      process.exit(1);
    }

    // 7. Verify that the story's subcategory is updated
    console.log("7. Verifying story subcategory rename propagation...");
    const storiesRes2 = await makeRequest({
      hostname: host,
      port: port,
      path: '/api/stories',
      method: 'GET'
    });
    const storiesList2 = JSON.parse(storiesRes2.body).stories?.uz || [];
    const foundStory2 = storiesList2.find(s => s.id === createdStory.id);

    if (!foundStory2 || foundStory2.subcategory !== "Mahalliy O'zgargan") {
      console.error(`Propagation failed! Subcategory is: ${foundStory2 ? foundStory2.subcategory : "undefined"}`);
      process.exit(1);
    }
    console.log("Propagation succeeded: subcategory updated to 'Mahalliy O'zgargan'.");

    // 8. Clean up: Delete test story and restore original config
    console.log("8. Cleaning up (deleting test story)...");
    const deleteRes = await makeRequest({
      hostname: host,
      port: port,
      path: `/api/admin/stories/uz/${createdStory.id}`,
      method: 'DELETE',
      headers: {
        'Cookie': cookie
      }
    });
    if (deleteRes.statusCode !== 200) {
      console.error("Cleanup warning: Failed to delete test story!");
    }

    console.log("9. Cleaning up (restoring original config)...");
    const restorePayload = JSON.stringify({
      config: originalConfig
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

    console.log("\n★★★ ALL SUBCATEGORY TESTS PASSED SUCCESSFULLY! ★★★");

  } catch (err) {
    console.error("Test error:", err);
    process.exit(1);
  }
}

runTest();
