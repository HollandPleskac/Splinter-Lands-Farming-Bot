const firestore = require('./firestore');

async function pickSummoner(page, availiableSplinters, splinterChoice, lastOpponentSplinter) {
  console.log('last splinter the opponent played:', lastOpponentSplinter);

  async function getAvailiableSummoners() {
    return await page.evaluate(() => {
      function getSplinter(name) {
        if (name === 'Pyre') {
          return 'fire';
        } else if (name === 'Bortus') {
          return 'water';
        } else if (name === 'Wizard of Eastwood') {
          return 'earth';
        } else if (name === 'Mother Khala') {
          return 'life';
        } else if (name === 'Contessa L\'ament' || name === 'Mimosa Nightshade') {
          return 'death';
        } else if (name === 'Drake of Arnak') {
          return 'dragon';
        } else {
          throw 'error picking splinter';
        }
      }

      const summoners = [];

      const summonerDivs = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta');
      for (let i = 0; i < summonerDivs.length; i++) {
        const name = summonerDivs[i].querySelector('.card-name-name').textContent.trim();
        const mana = parseInt(summonerDivs[i].querySelector('.stat-text-mana').textContent.trim());
        summoners.push({
          name: name,
          mana: mana,
          splinter: getSplinter(name),
          position: i
        });
      }

      return summoners;
    });
  }

  async function chooseSummoner(summoners, availiableSplinters, splinterChoice, lastOppSplinter) {

    function getSummonerBySplinter(splinter, summoners) {
      const summonerChoices = summoners.filter(summoner => summoner.splinter === splinter);
      if (summonerChoices.length === 0) {
        console.log(`splinter type ${splinter} not availiable`);
        return summoners[0];
      } else {
        return summonerChoices[0];
      }
    }

    let chosenSplinter;
    if (splinterChoice === 'BEST') {
      chosenSplinter = await firestore.getSplinterFromConversionRates(lastOppSplinter, availiableSplinters);
    } else {
      chosenSplinter = splinterChoice;
    }

    const chosenSummoner = getSummonerBySplinter(chosenSplinter, summoners);

    return chosenSummoner;

  };

  async function clickOnSummoner(chosenSummoner, summoners, lastOpponentSplinter) {

    await page.evaluate((chosenSummoner, summoners) => {

      function getSummonerElementByName(summonerName, summoners) {
        const position = summoners.filter(summoner => summoner.name === summonerName)[0].position;
        const summonerElement = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[position].querySelector('img');
        return summonerElement;
      }

      const summonerElement = getSummonerElementByName(chosenSummoner.name, summoners);
      summonerElement.click();

    }, chosenSummoner, summoners);


    // extra step for dragon
    if (chosenSummoner.splinter === 'dragon') {

      const dragonSplinters = await page.evaluate(() => {
        const labelEls = [...document.querySelectorAll('.modal-body .filter-option-button > label')];
        let dragonSplinters = [];

        for (let i = 0; i < labelEls.length; i++) {
          if (labelEls[i].className.trim() !== 'disabled') {
            dragonSplinters.push({
              splinterName: labelEls[i].textContent.toLowerCase().trim(),
              position: i,
            });
          }
        }
        return dragonSplinters;
      });

      console.log('Dragon splinters : ', dragonSplinters);
      const dragonSplinterNames = dragonSplinters.map(dragonSplinter => dragonSplinter.splinterName);
      const bestDragonSplinter = await firestore.getSplinterFromConversionRates(lastOpponentSplinter, dragonSplinterNames);

      console.log('Chosen splinter based on conversion rates : ', bestDragonSplinter);

      await page.evaluate((bestDragonSplinter, dragonSplinters) => {

        function getDragonSplinterBtnByName(splinterName, dragonSplinters) {
          const position = dragonSplinters.filter(dragonSplinter => dragonSplinter.splinterName === splinterName)[0].position;
          const dragonSplinterElement = document.querySelectorAll('.modal-body .filter-option-button > label')[position];
          return dragonSplinterElement;
        }

        const dragonSplinterEl = getDragonSplinterBtnByName(bestDragonSplinter, dragonSplinters);
        dragonSplinterEl.click();

      }, bestDragonSplinter, dragonSplinters);
    }



  }


  const summoners = await getAvailiableSummoners();

  const chosenSummoner = await chooseSummoner(summoners, availiableSplinters, splinterChoice, lastOpponentSplinter);

  await clickOnSummoner(chosenSummoner, summoners, lastOpponentSplinter);

  return chosenSummoner;
}

module.exports = { pickSummoner };