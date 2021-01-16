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

const pickCards = async (page) => {
  await page.evaluate(() => {

    let totalMana = parseInt(document.querySelector('.mana-cap').textContent.trim());

    totalMana -= 10; // account for the pick of the summoner and living lava


    const chickenCard = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[19].querySelector('img');
    chickenCard.click();

    const livingLavaCard = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[10].querySelector('img');
    livingLavaCard.click();


    if (totalMana < 3) {
      return;
    }

    const serpentineSpy = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[2].querySelector('img');
    serpentineSpy.click();
    totalMana -= 3;

    if (totalMana < 4) {
      return;
    }

    const sparkPixies = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[11].querySelector('img');
    sparkPixies.click();
    totalMana -= 4;

    if (totalMana < 1) {
      return;
    }

    const creepingOoze = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[12].querySelector('img');
    creepingOoze.click();
    totalMana -= 1;
    // when you click a card, the reference to it changes or something so the click event doesn't work if you store all of the div's in a list (get a new reference after each click works)
  });
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

  await pickCards(page);

  await page.evaluate(() => {
    const startBattleBtn = document.querySelector('.btn-green');
    startBattleBtn.click();
  });

  await page.waitForSelector('#btnRumble', { timeout: 250000 }); // instead wait for the match to actually load
  await page.waitForTimeout(10000);
  await page.screenshot({ path: './screenshots/9.png' });

  // click on rumble button
  await page.click('#btnRumble');
  await page.screenshot({ path: './screenshots/10.png' });

  await page.waitForTimeout(8000); // wait for the skip button to be availiable
  // there is some animation to comes so wait for more time
  // maybe wait for it to be visible instead of wating 8 seconds

  // click on the skip button
  await page.click('#btnSkip');
  await page.screenshot({ path: './screenshots/11.png' });

  // click on close button
  await page.waitForSelector('.btn.btn--done');
  await page.waitForTimeout(2000);
  await page.click('.btn.btn--done');
  await page.screenshot({ path: './screenshots/12.png' });

  await page.waitForTimeout(2000);



}

module.exports = startFarming;