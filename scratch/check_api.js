const http = require('http');

http.get('http://localhost:5173/api/stories', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('API call successful. Languages returned:', Object.keys(json.stories));
      Object.keys(json.stories).forEach(lang => {
        console.log(`\n=== Lang: ${lang} ===`);
        json.stories[lang].forEach((story, index) => {
          console.log(`${index}: [${story.category}] ${story.title} (${story.id}) - status: ${story.status}`);
        });
      });
    } catch (e) {
      console.error('Failed to parse API response:', e.message);
      console.log('Response content was:', data);
    }
  });
}).on('error', (err) => {
  console.error('API call failed:', err.message);
});
