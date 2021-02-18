const { battle } = require('./farming');
const firestore = require('./firestore');

async function pickSummoner(page, availiableSplinters, splinterChoice, lastOpponentSplinter) {

  console.log('last splinter the opponent played:',lastOpponentSplinter);

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

    function getDefaultFirstSplinter(availiableSplinters) {
      for (const s in conversionRates) {
        if (availiableSplinters.includes(s)) {
          return s;
        }
      }
    }

    // get conversion rates
    const conversionRates = await firestore.getConversionRates(lastOppSplinter);
    console.log(`Conversion Rates for ${lastOppSplinter}`, conversionRates);
  
    let pickedSplinter;

    // choose a splinter
    if (splinterChoice === 'BEST') {
      pickedSplinter = getDefaultFirstSplinter(availiableSplinters);
      for (const splinter in conversionRates) {
        if (conversionRates[splinter] > conversionRates[pickedSplinter] && availiableSplinters.includes(splinter)) {
          pickedSplinter = splinter;
        }
      }
      console.log('going with',pickedSplinter);
    } else {
      pickedSplinter = splinterChoice;
    }


    // click on the summoner
    return await page.evaluate((splinter, summoners) => {

      function getSummonerElementByName(summonerName, summoners) {
        const position = summoners.filter(summoner => summoner.name === summonerName)[0].position;
        const summonerElement = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[position].querySelector('img');
        return summonerElement;
      }

      function getSummonerBySplinter(splinter, summoners) {
        const summonerChoices = summoners.filter(summoner => summoner.splinter === splinter);
        if (summonerChoices.length === 0) {
          console.log(`splinter type ${splinter} not availiable`);
          return summoners[0];
        } else {
          return summonerChoices[0];
        }
      }

      const chosenSummoner = getSummonerBySplinter(splinter, summoners);

      const summonerElement = getSummonerElementByName(chosenSummoner.name, summoners);
      summonerElement.click();

      return chosenSummoner;
    }, pickedSplinter, summoners);
  };


  const summoners = await getAvailiableSummoners();

  const chosenSummoner = await chooseSummoner(summoners, availiableSplinters, splinterChoice, lastOpponentSplinter);

  return chosenSummoner;
}

module.exports = { pickSummoner };