const puppeteer = require('puppeteer');
const pickCards = require('./pickcards');

async function startFarming(username, password) {

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
  await page.evaluate(() => {
    const closePopup = document.querySelector('.close');
    closePopup.click();
  })
  await page.waitForTimeout(1000);

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


async function battle(page) {

  // click on battle
  await page.click('#battle_category_btn');

  await page.waitForTimeout(3000); // change later
  await page.screenshot({ path: './screenshots/5.png' });

  // accept the battle with the create team button
  await page.waitForSelector('.btn.btn--create-team', { timeout: 250000 });
  await page.screenshot({ path: './screenshots/6.png' });

  // get battle rules
  await page.evaluate(() => {
    const rule = document.querySelector('.combat__conflict').querySelector('img').src;
    console.log(rule);
  });

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

  await pickCards(page);

  await page.evaluate(() => {
    const startBattleBtn = document.querySelector('.btn-green');
    startBattleBtn.click();
  });

  await page.waitForSelector('#btnRumble', { timeout: 250000 }); // instead wait for the match to actually load
  await page.waitForTimeout(12000);
  await page.screenshot({ path: './screenshots/9.png' });

  // click on rumble button
  await page.click('#btnRumble');
  await page.screenshot({ path: './screenshots/10.png' });

  // click on the skip button
  await page.waitForTimeout(15000); // wiat for the skip button to be availiable
  await page.click('#btnSkip');
  await page.screenshot({ path: './screenshots/11.png' });

  // click on close button
  await page.waitForSelector('.btn.btn--done', { timeout: 250000 });
  await page.waitForTimeout(2000);
  await page.click('.btn.btn--done');
  await page.screenshot({ path: './screenshots/12.png' });

  await page.waitForTimeout(2000);

}

module.exports = startFarming;