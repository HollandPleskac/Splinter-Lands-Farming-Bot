//maybe still make a list with objects for the cards
// calculate that position dynamically for the query selectors

async function pickCards(page) {
  
  await page.evaluate(() => {

    function getCardElementByName(cardName, cardsList) {
      const cardPosition = cardsList.filter(card => card.name === cardName)[0].position;
      const cardElement = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[cardPosition].querySelector('img');
      return cardElement;
    }

    let totalMana = parseInt(document.querySelector('.mana-cap').textContent.trim());
    totalMana -= 3; // summoner(3)

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

    const chickenEl = getCardElementByName('Furious Chicken', cards);
    chickenEl.click();

    const livingLavaEl = getCardElementByName('Living Lava', cards);
    livingLavaEl.click();
    totalMana -= 7;


    if (totalMana < 3) {
      return;
    }

    const serpentineSpyEl = getCardElementByName('Serpentine Spy', cards);
    serpentineSpyEl.click();
    totalMana -= 3;

    if (totalMana < 4) {
      return;
    }

    const sparkPixiesEl = getCardElementByName('Spark Pixies', cards);
    sparkPixiesEl.click();
    totalMana -= 4;

    if (totalMana < 1) {
      return;
    }

    const creepingOozeEl = getCardElementByName('Creeping Ooze', cards);
    creepingOozeEl.click();
    totalMana -= 1;

    if (totalMana < 5) {
      return;
    }

    const fireElementalEl = getCardElementByName('Fire Elemental', cards);
    fireElementalEl.click();
    totalMana -= 5;
  });
}

// async function pickEvenStevens() {
//   await page.evaluate(() => {
//     let totalMana = parseInt(document.querySelector('.mana-cap').textContent.trim());
//     totalMana -= 3;

//     let cards = [];
//     let isPicking = true;

//     const cardDivs = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta');

//     for (i = 0; i < cardDivs.length; i++) {
//       const mana = parseInt(cardDivs[i].querySelector('.stat-mana').textContent.trim());
//       const name = cardDivs[i].querySelector('.card-name-name').textContent;

//       cards.push({
//         name: name,
//         mana: mana,
//         position: i,
//       });
//     };

//     const usableCards = cards.filter(card => card.mana % 2 === 0);

//     const chickenEl = getCardElementByName('Furious Chicken', usableCards);
//     chickenEl.click();

//     const livingLavaEl = getCardElementByName('Living Lava', usableCards);
//     livingLavaEl.click();


//     if (totalMana < 3) {
//       return;
//     }

//     const serpentineSpyEl = getCardElementByName('Serpentine Spy', usableCards);
//     serpentineSpyEl.click();
//     totalMana -= 3;

//     if (totalMana < 4) {
//       return;
//     }

//     const sparkPixiesEl = getCardElementByName('Spark Pixies', usableCards);
//     sparkPixiesEl.click();
//     totalMana -= 4;

//     if (totalMana < 1) {
//       return;
//     }

//     const creepingOozeEl = getCardElementByName('Creeping Ooze', usableCards);
//     creepingOozeEl.click();
//     totalMana -= 1;

//     if (totalMana < 5) {
//       return;
//     }

//     const fireElementalEl = getCardElementByName('Fire Elemental', usableCards);
//     fireElementalEl.click();
//     totalMana -= 5;
//   });
// }

module.exports = pickCards;