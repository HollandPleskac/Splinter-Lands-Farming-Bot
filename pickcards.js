//maybe still make a list with objects for the cards
// calculate that position dynamically for the query selectors

function getCardElement(cardName) {
  const cardPosition = cards.filter(card => card.name === cardName)[0].position;
  const cardElement = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[cardPosition].querySelector('img');
  return cardElement;
}

async function pickCards(page) {

  await page.evaluate(() => {
    let totalMana = parseInt(document.querySelector('.mana-cap').textContent.trim());
    totalMana -= 10; // summoner(3) + living lava(7)

    let cards = [];

    const cardDivs = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta');

    for (i = 0; i < cardDivs.length; i++) {
      const mana = parseInt(cardDivs[i].querySelector('.stat-mana').textContent.trim());
      const name = cardDivs[i].querySelector('.card-name-name').textContent;

      cards.push({
        name: name,
        mana: mana,
        position: i,
      });
    };

    const chickenEl = getCardElement('Furious Chicken');
    chickenEl.click();

    const livingLavaEl = getCardElement('Living Lava');
    livingLavaEl.click();


    if (totalMana < 3) {
      return;
    }

    const serpentineSpyEl = getCardElement('Serpentine Spy');
    serpentineSpyEl.click();
    totalMana -= 3;

    if (totalMana < 4) {
      return;
    }

    const sparkPixiesEl = getCardElement('Spark Pixies');
    sparkPixiesEl.click();
    totalMana -= 4;

    if (totalMana < 1) {
      return;
    }

    const creepingOozeEl = getCardElement('Creeping Ooze');
    creepingOozeEl.click();
    totalMana -= 1;

    if (totalMana < 5) {
      return;
    }

    const fireElementalEl = getCardElement('Fire Elemental');
    fireElementalEl.click();
    totalMana -= 5;
  });
}

module.exports = pickCards;