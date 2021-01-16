const puppeteer = require('puppeteer');

const startFarming = async (username, password) => {

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

  await page.goto('https://splinterlands.com/');

  // activate login dialog
  await page.evaluate(() => {
    const loginDialogBtn = document.getElementById('log_in_button').firstElementChild;
    loginDialogBtn.click();
  });

  await page.waitForSelector('#login_dialog_v2');
  await page.waitForSelector('#email');

  await page.screenshot({ path: './screenshots/1.png' });

  // enter credentials
  await page.type('#email', username);
  await page.type('#password', password);
  await page.screenshot({ path: './screenshots/2.png' });

  // click submit
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button[name=loginBtn]');
    const loginBtn = buttons[1];
    loginBtn.click();
  });

  await page.waitForTimeout(5000); // change later

  await page.screenshot({ path: './screenshots/3.png' });

  // go to home screen
  await page.evaluate(() => {
    const playNowBtn = document.getElementById('play_now').firstElementChild.querySelector('button');
    playNowBtn.click();
  });

  await page.waitForTimeout(3000); // change later
  await page.screenshot({ path: './screenshots/4.png' });

  while (true) {
    await battle(page);
  }
  
}

const battle = async (page) => {
  // click on battle
  await page.click('#battle_category_btn');

  await page.waitForTimeout(3000); // change later
  await page.screenshot({ path: './screenshots/5.png' });

  // accept the battle with the create team button
  await page.waitForSelector('.btn.btn--create-team');

  await page.screenshot({ path: './screenshots/6.png' });

  await page.click('.btn.btn--create-team');

  await page.waitForTimeout(1000);
  await page.screenshot({ path: './screenshots/7.png' });

  // choose a summoner

  await page.evaluate(() => {
    const summoners = document.querySelector('.deck-builder-page2__cards');
    const pyreDiv = summoners.querySelectorAll('div')[0];
    const pyreClickable = pyreDiv.querySelector('img');
    pyreClickable.click();
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: './screenshots/8.png' });

  // pick cards and battle

  await page.evaluate( () => {
    const manaCap = parseInt(document.querySelector('.mana-cap').textContent.trim());
    const battleBtn = document.querySelector('.btn-green');
    const card1 = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div')[0].querySelector('img');
    card1.click();
    battleBtn.click();
  });

  await page.waitForSelector('#btnRumble', {timeout: 250000}); // instead wait for the match to actually load
  await page.waitForTimeout(10000);
  await page.screenshot({path: './screenshots/9.png'});

  // click on rumble button
  await page.click('#btnRumble');
  await page.screenshot({path: './screenshots/10.png'});

  await page.waitForTimeout(6000); // wait for the skip button to be availiable
  // there is some animation to comes so wait for more time

  // click on the skip button
  await page.click('#btnSkip');
  await page.screenshot({path: './screenshots/11.png'});

  // click on close button
  await page.waitForSelector('.btn.btn--done');
  await page.waitForTimeout(2000);
  await page.click('.btn.btn--done');
  await page.screenshot({path: './screenshots/12.png'});

  await page.waitForTimeout(2000);
}

module.exports = startFarming;