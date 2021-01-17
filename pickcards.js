async function pickCards(page) {

  await page.evaluate(() => {
    let totalMana = parseInt(document.querySelector('.mana-cap').textContent.trim());
    totalMana -= 10; // summoner(3) + living lava(7)

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

    if (totalMana < 5) {
      return;
    }

    const fireElemental = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[9].querySelector('img');
    fireElemental.click();
    totalMana -= 5;
  });
}

module.exports = pickCards;