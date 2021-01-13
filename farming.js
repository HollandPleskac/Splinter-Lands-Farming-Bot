const puppeteer = require('puppeteer');

const startFarming = async (username, password) => {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

  await page.goto('https://splinterlands.com/');

  // activate login dialog
  await page.evaluate( () => {
    const loginDialogBtn = document.getElementById('log_in_button').firstElementChild;
    loginDialogBtn.click();
  });

  await page.waitForSelector('#login_dialog_v2');
  await page.waitForSelector('#email');

  await page.screenshot({path: '1.png'});

  // enter credentials
  await page.type('#email', username);
  await page.type('#password', password);
  await page.screenshot({path: '2.png'});

  // click submit
  await page.evaluate( () => {
    const buttons = document.querySelectorAll('button[name=loginBtn]');
    const loginBtn = buttons[1];
    loginBtn.click();
  });

  await page.waitFor(5000);

  await page.screenshot({path: '3.png'});

}

module.exports = startFarming;