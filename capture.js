const puppeteer = require('puppeteer');

async function snap() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'D:/SAIL-06/temp-app/public/screen-edit-button.png' });

  // Click Edit Text button
  const buttons = await page.$$('button');
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Edit Text')) {
      await b.click();
      break;
    }
  }

  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'D:/SAIL-06/temp-app/public/screen-edit-modal.png' });

  await browser.close();
  console.log('Screenshots generated successfully!');
}

snap().catch(e => console.error(e));
