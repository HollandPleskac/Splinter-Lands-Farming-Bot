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

  await page.waitForTimeout(3000); // change later
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

  return page;

}

async function battle(page) {

  async function clickRumbleButton(page) {
    try {
      await page.waitForTimeout(3000);
      await page.click('#btnRumble');
    } catch (e) {
      console.log('rumble not availiable yet, trying again');
      clickRumbleButton(page);
    }
  }

  async function clickCloseBattleButton(page) {
    try {
      await page.waitForTimeout(2000);
      await page.click('.btn.btn--done');
    } catch (e) {
      console.log('done button not availiable yet, trying again');
      clickCloseBattleButton(page);
    }
  }

  async function getBattleResults(page) {
    let resultsData = await page.evaluate(() => {

      const players = [...document.querySelectorAll('.player')].map(playerEl => playerEl.querySelector('.bio__name__display').textContent.trim());
      // [...document.querySelectorAll('div')] will convert StaticNodeList to Array of items - allows you to use .map()
      const opponent = players.filter(player => player !== 'hvcminer')[0];
      
      // if result is a draw the winner won't be declared
      let winner;
      let dec = 0;
      try {
        winner = document.querySelector('.player.winner').querySelector('.bio__name__display').textContent.trim();
        console.log(winner);
        if (winner === 'hvcminer') {
          dec = parseFloat(document.querySelector('.player.winner').querySelector('.dec-reward').querySelector('span').textContent.trim());
        }
      } catch(e) {
        winner = 'unknown'
      }

      console.log('results from inside inner function', {
        opponent: opponent,
        isWinner: winner === 'hvcminer' ? true : false,
        dec: dec
      });
      
      return {
        opponent: opponent,
        isWinner: winner === 'hvcminer' ? true : false,
        dec: dec
      }
    });

    console.log('results from inside outer function', resultsData);

    return resultsData;
  }

  async function getCardsUsed(page) {

    let cardData = await page.evaluate(async () => {
      function getCardNamesFromDOM(team) {
        let teamCards = document.querySelectorAll(`.cardContainer.${team}`);
        teamCards = [...teamCards].map((card) => {
          let cardName = card.querySelector('img').src;
          cardName = cardName.replace('https://d36mxiodymuqjm.cloudfront.net/cards_battle_beta/', '');
          cardName = cardName.replace('https://d36mxiodymuqjm.cloudfront.net/cards_battle_untamed/','');
          cardName = cardName.replace('%20', ' ');
          cardName = cardName.replace('.png', '');
          return cardName;
        });
        return teamCards;
      }

      function getMyTeam() {
        const team1Player = document.getElementById('t1_portrait').querySelector('.bio__name__display').textContent;
        const team2Player = document.getElementById('t2_portrait').querySelector('.bio__name__display').textContent;
        let hvcMinerTeam;
        if (team1Player === 'hvcminer') {
          hvcMinerTeam = 'team1';
        } else {
          hvcMinerTeam = 'team2';
        }
        return hvcMinerTeam;
      }

      const team1 = getCardNamesFromDOM('team1');
      const team2 = getCardNamesFromDOM('team2');
      let hvcMinerTeam;
      let opponentTeam;
      if (getMyTeam() === 'team1') {
        hvcMinerTeam = team1;
        opponentTeam = team2;
      } else {
        hvcMinerTeam = team2;
        opponentTeam = team1;
      }

      return {
        hvcvminerTeam: hvcMinerTeam,
        opponentTeam: opponentTeam
      }
    });

    return cardData;
  }

  let rule;

  // click on battle
  await page.click('#battle_category_btn');

  await page.waitForTimeout(3000); // change later
  await page.screenshot({ path: './screenshots/5.png' });

  // accept the battle with the create team button
  await page.waitForSelector('.btn.btn--create-team', { timeout: 250000 });
  await page.screenshot({ path: './screenshots/6.png' });

  // get battle rules
  await page.evaluate(() => {
    rule = document.querySelector('.combat__conflict').querySelector('img').src;
    console.log(rule);
  });

  await page.click('.btn.btn--create-team');

  await page.waitForTimeout(1000);
  await page.screenshot({ path: './screenshots/7.png' });

  // choose a summoner

  await page.evaluate(() => {
    const summoners = document.querySelector('.deck-builder-page2__cards');
    const summonerDiv = summoners.querySelectorAll('div')[0];
    const summonerElement = summonerDiv.querySelector('img');
    summonerElement.click();
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: './screenshots/8.png' });

  // pick cards and battle

  await pickCards(page, rule);
  await page.screenshot({ path: './screenshots/cards.png' });

  await page.evaluate(() => {
    const startBattleBtn = document.querySelector('.btn-green');
    startBattleBtn.click();
  });

  await page.waitForSelector('#btnRumble', { timeout: 280000 }); // instead wait for the match to actually load (this takes you to the animation)
  await page.screenshot({ path: './screenshots/9.png' });

  // click on rumble button
  await clickRumbleButton(page);
  await page.screenshot({ path: './screenshots/10.png' });

  // click on the skip button
  await page.waitForTimeout(15000); // wait for the skip button to be availiable

  const cardsFromBattle = await getCardsUsed(page);

  await page.click('#btnSkip');
  // put the click skip button in a try catch block too
  await page.screenshot({ path: './screenshots/11.png' });

  // click on close button
  await page.waitForSelector('.btn.btn--done', { timeout: 250000 });

  const battleResults = await getBattleResults(page);

  await page.waitForTimeout(2000);
  // probably click close battle button should be try catch
  await clickCloseBattleButton(page);
  await page.screenshot({ path: './screenshots/12.png' });

  await page.waitForTimeout(2000);

  console.log('Battle results : ', battleResults);
  console.log('Cards from the battle : ', cardsFromBattle);
  console.log('all together : ', {
    ...cardsFromBattle,
    ...battleResults
  });

  return {
    ...cardsFromBattle,
    ...battleResults
  }

}

module.exports = { startFarming, battle };