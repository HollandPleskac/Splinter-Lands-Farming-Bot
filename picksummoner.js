async function pickSummoner(page) {
  return await page.evaluate(() => {

    function getAvailiableSummoners() {
      const summoners = [];

      const summonerDivs = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta');
      for (let i = 0; i < summonerDivs.length; i++) {
        const name = summonerDivs[0].querySelector('.card-name-name').textContent.trim();
        const mana = parseInt(summonerDivs[0].querySelector('.stat-text-mana').textContent.trim());
        summoners.push({
          name: name,
          mana: mana,
          position: i
        });
      }

      return summoners;
    }

    function getElementByName(summonerName, summoners) {
      const position = summoners.filter(summoner => summoner.name === summonerName)[0].position;
      const summonerElement = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[position].querySelector('img');
      return summonerElement;
    }

    const summoners = getAvailiableSummoners();

    const chosenSummoner = summoners[0];

    const summonerElement = getElementByName(chosenSummoner.name, summoners);
    summonerElement.click();

    return chosenSummoner;
  });
}

module.exports = pickSummoner;