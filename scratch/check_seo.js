const http = require('http');

http.get('http://localhost:5173/news/1564ac87-eb78-4e20-ae60-03e5223e3eb3', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const titleMatch = body.match(/<title>(.*?)<\/title>/i);
    const descMatch = body.match(/<meta name="description" content="([^"]*)"/i);
    const ogTitleMatch = body.match(/<meta property="og:title" content="([^"]*)"/i);
    const ogImgMatch = body.match(/<meta property="og:image" content="([^"]*)"/i);
    
    console.log('--- SEO META INJECTION VERIFICATION ---');
    console.log('Title:      ', titleMatch ? titleMatch[1] : 'NOT FOUND');
    console.log('Description:', descMatch ? descMatch[1] : 'NOT FOUND');
    console.log('OG Title:   ', ogTitleMatch ? ogTitleMatch[1] : 'NOT FOUND');
    console.log('OG Image:   ', ogImgMatch ? ogImgMatch[1] : 'NOT FOUND');
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('Error fetching story:', err.message);
  process.exit(1);
});
