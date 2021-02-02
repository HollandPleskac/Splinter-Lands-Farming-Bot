const puppeteer = require('puppeteer');
const pickCards = require('./pickcards');
const pickSummoner = require('./picksummoner');


async function startFarming(username, password) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });
  const page = await browser.newPage();

  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
  await page.setViewport({ height: 800, width: 800 }); // make sure this works, login btn not defined for tiny viewport error cause

  await page.goto('https://splinterlands.com/');

  await page.waitForTimeout(4000);

  await page.evaluate(() => {
    const loginDialogBtn = document.getElementById('log_in_button').firstElementChild;
    loginDialogBtn.click();
  });

  await page.waitForSelector('#login_dialog_v2');
  await page.waitForSelector('#email');

  // await page.screenshot({ path: './screenshots/1.png' });

  // enter credentials
  await page.type('#email', username);
  await page.type('#password', password);
  // await page.screenshot({ path: './screenshots/2.png' });

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

  // await page.screenshot({ path: './screenshots/3.png' });

  // go to home screen
  await page.evaluate(() => {
    const playNowBtn = document.getElementById('play_now').firstElementChild.querySelector('button');
    playNowBtn.click();
  });

  await page.waitForTimeout(3000); // change later
  // await page.screenshot({ path: './screenshots/4.png' });

  return page;

}

async function battle(page, splinterChoice) {

  async function clickRumbleButton(page) {
    try {
      await page.waitForTimeout(4000);
      await page.click('#btnRumble');
    } catch (e) {
      console.log('rumble not availiable yet, trying again');
      await clickRumbleButton(page);
    }
  }

  async function clickCloseBattleButton(page) {
    try {
      await page.waitForTimeout(3000);
      await page.click('.btn.btn--done');
    } catch (e) {
      console.log('done button not availiable yet, trying again');
      await clickCloseBattleButton(page);
    }
  }

  async function clickSkipButton(page) {
    try {
      await page.waitForTimeout(3000);
      await page.click('#btnSkip');
    } catch (e) {
      console.log('skip button not availiable yet, trying again');
      await clickSkipButton(page);
    }
  }

  async function getEnemyPreviousMatchData(page) {
    return await page.evaluate(() => {

      function getMonsterNameFromLi(unformattedName) {
        let name = unformattedName.split('	')[0];
        name.slice(0, -1); // remove last letter
        return name;
      }

      function getSplinterFromUrl(imgText) {
        let splinter = imgText.replace('https://d36mxiodymuqjm.cloudfront.net/website/icons/', '');
        splinter = splinter.replace('.svg', '');
        splinter = splinter.replace('icon-element-', '');
        return splinter;
      }

      const previousTeamsDivs = document.querySelector('.recently-played-splinters__list').querySelectorAll('.recent-team');

      const data = [...previousTeamsDivs].map((teamDiv) => {
        const splinter = getSplinterFromUrl(teamDiv.querySelector('img').src);
        const monsters = [...teamDiv.querySelector('ul').querySelectorAll('li')].map(monsterLi => getMonsterNameFromLi(monsterLi.textContent.trim()));
        return {
          splinter: splinter,
          monsters: monsters
        }
      });
      return data;
    });
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
      } catch (e) {
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
          cardName = cardName.replace('https://d36mxiodymuqjm.cloudfront.net/cards_battle_untamed/', '');
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

  async function getSplinters(page) {

    const splinters = await page.evaluate(async () => {
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

      function getSplinterOfTeam(position) {
        // 0 for team 1, 1 for team 2
        const color = document.querySelectorAll('canvas')[position].style.boxShadow.split(" ")[0];
        if (color === 'red') {
          return 'fire';
        } else if (color === 'blue') {
          return 'water';
        } else if (color === 'green') {
          return 'earth';
        } else if (color === 'purple') {
          return 'death';
        } else if (color === 'rgb(187,') {
          return 'light';
        } else {
          return 'dragon';
        }
      }

      let hvcMinerSplinter;
      let opponenentSplinter;
      if (getMyTeam() === 'team1') {
        hvcMinerSplinter = getSplinterOfTeam(0);
        opponenentSplinter = getSplinterOfTeam(1);
      } else {
        hvcMinerSplinter = getSplinterOfTeam(1);
        opponenentSplinter = getSplinterOfTeam(0);
      }

      return ({
        hvcminerSplinter: hvcMinerSplinter,
        opponenentSplinter: opponenentSplinter
      });

    });
    return splinters;
  }

  async function getBattleRule(page) {
    return await page.evaluate(() => {
      let rule = document.querySelector('.combat__conflict').querySelector('img').src;
      rule = rule.replace('https://d36mxiodymuqjm.cloudfront.net/website/icons/rulesets/new/img_combat-rule_', '');
      rule = rule.replace('_150.png', '');
      rule = rule.replace('-', ' ');
      return rule;
    });
  }

  async function getManaCap(page) {
    return await page.evaluate(() => {
      return parseInt(document.querySelector('.mana-cap__icon').querySelector('div').firstElementChild.textContent.trim());
    });
  }

  async function playBattle(page, splinterChoice) {

    await page.click('#battle_category_btn');

    await page.waitForTimeout(3000); // change later
    // await page.screenshot({ path: './screenshots/5.png' });

    // accept the battle with the create team button
    await page.waitForSelector('.btn.btn--create-team', { timeout: 250000 });
    // await page.screenshot({ path: './screenshots/6.png' });


    const battleRule = await getBattleRule(page);
    const manaCap = await getManaCap(page);
    const enemyPreviousMatchData = await getEnemyPreviousMatchData(page);

    await page.click('.btn.btn--create-team');

    await page.waitForTimeout(1000);
    // await page.screenshot({ path: './screenshots/7.png' });

    // choose a summoner

    const summoner = await pickSummoner(page, splinterChoice);
    console.log('chosen summoner : ' + summoner.name);
    await page.waitForTimeout(1000);
    // await page.screenshot({ path: './screenshots/8.png' });

    // pick cards

    const manaRemaining = await pickCards(page, summoner.mana);
    // await page.screenshot({ path: './screenshots/cards.png' });

    // click battle

    await page.evaluate(() => {
      const startBattleBtn = document.querySelector('.btn-green');
      startBattleBtn.click();
    });

    await page.waitForSelector('#btnRumble', { timeout: 300000 }); // instead wait for the match to actually load (this takes you to the animation)
    // await page.screenshot({ path: './screenshots/9.png' });

    await clickRumbleButton(page);
    // await page.screenshot({ path: './screenshots/10.png' });

    const cardsFromBattle = await getCardsUsed(page);
    const splinters = await getSplinters(page);

    await clickSkipButton(page);
    // await page.screenshot({ path: './screenshots/11.png' });

    // click on close button
    await page.waitForSelector('.btn.btn--done', { timeout: 250000 });

    const battleResults = await getBattleResults(page);

    await page.waitForTimeout(2000);
    await clickCloseBattleButton(page);
    // await page.screenshot({ path: './screenshots/12.png' });

    await page.waitForTimeout(2000);

    return {
      ...cardsFromBattle,
      ...battleResults,
      ...splinters,
      previousOpponentMatches: enemyPreviousMatchData,
      rule: battleRule,
      manaCap: manaCap,
      manaRemaining: manaRemaining,
      hvcMinerSummoner: summoner,
      timestamp: Date.now()
    }

  }

  return await playBattle(page, splinterChoice);

}

async function performRestart(page) {
  // first take a screenshot
  // await page.screenshot({ path: './screenshots/battle-err.png' });
  await page.goto('https://splinterlands.com/?p=battle_history');
  await page.waitForTimeout(5000);
  await page.evaluate(async () => {
    try {
      document.querySelector('.modal-close-new').click();
    } catch (e) {
      console.log('no need to close modal');
    }
  });
}


module.exports = { startFarming, battle, performRestart };