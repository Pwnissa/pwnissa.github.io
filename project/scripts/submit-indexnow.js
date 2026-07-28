import fs from 'fs';
import https from 'https';

const API_KEY = '2d9bcb8a683844e8aa2d8f0ecc5b45cd';
const HOST = 'pwnissa.it';
const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`;
const SITEMAP_PATH = './dist/sitemap-0.xml';

async function submitIndexNow() {
  try {
    if (!fs.existsSync(SITEMAP_PATH)) {
      console.log(`Sitemap not found at ${SITEMAP_PATH}. Skipping IndexNow submission.`);
      return;
    }

    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const urlMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)];
    const urlList = urlMatches.map(match => match[1]);

    if (urlList.length === 0) {
      console.log('No URLs found in sitemap. Skipping IndexNow submission.');
      return;
    }

    console.log(`Found ${urlList.length} URLs in sitemap. Submitting to IndexNow...`);

    const payload = JSON.stringify({
      host: HOST,
      key: API_KEY,
      keyLocation: KEY_LOCATION,
      urlList: urlList
    });

    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/IndexNow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✅ IndexNow submission successful! (HTTP ${res.statusCode})`);
        } else {
          console.error(`❌ IndexNow submission failed. HTTP ${res.statusCode}: ${data}`);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Error submitting to IndexNow: ${e.message}`);
    });

    req.write(payload);
    req.end();
  } catch (error) {
    console.error(`❌ Unexpected error: ${error.message}`);
  }
}

submitIndexNow();
