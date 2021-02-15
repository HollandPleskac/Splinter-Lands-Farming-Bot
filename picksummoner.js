const admin = require('firebase-admin');

const db = admin.firestore();

async function pickSummoner(page, splinter) {
  return await page.evaluate((splinter) => {

    function getAvailiableSummoners() {
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
    }

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

    async function getConversionRates(summoners) {

      function getAvailiableSplinters() {
        let splinters = [];
        summoners.forEach((summoner) => {
          if (!splinters.includes(summoner.splinter)) {
            splinter.push(summoner.splinter);
          }
        });
        return splinters;
      }

      const availiableSplinters = getAvailiableSplinters();
      const conversionRates = [];

      // 0 fire, 1 water, 2 earth, 3 death, 4 life
      // highest number in conversionRates is the splinter that wins the most against what the opponent picked last

      for (let i = 0; i < availiableSplinters.length; i++) {

        let splinterConversionRate;
        const snapshot = await db.collection("Battle Log").where("opponenentSplinter", "==", availiableSplinters[i]).get();

        if (!snapshot.empty) {
          let hvcminerWins = 0;
          snapshot.forEach(doc => {
            if (doc.data().winner === 'hvcminer') {
              hvcminerWins++;
            }
          });
          splinterConversionRate = hvcminerWins / snapshot.size;
        } else {
          splinterConversionRate = 0;
        }
        conversionRates.push(splinterConversionRate);

      }

      return conversionRates;
    }

    const summoners = getAvailiableSummoners();

    const conversionRates = await getConversionRates(summoners);
    console.log('Conversion Rates ',conversionRates);

    const chosenSummoner = getSummonerBySplinter(splinter, summoners);

    const summonerElement = getSummonerElementByName(chosenSummoner.name, summoners);
    summonerElement.click();

    return chosenSummoner;
  }, splinter);
}

function getSummonerThompsonSampling(conversionRates) {
  /*

    python server call to get chosen splinter
    return the splinter

  */
}

module.exports = pickSummoner;