async function pickCards(page) {
  await page.evaluate(() => {

    function getAbilities(cardDivElement) {
      const abilityImgElements = cardDivElement.querySelector('.abilities').querySelectorAll('img');
      let abilities = [];

      if (abilityImgElements.length > 0) {
        abilityImgElements.forEach(abilityImg => {
          abilities.push(abilityImg.title.toString());
        });
      }

      return abilities;
    }

    function getAttackType(cardDivElement, abilities) {
      const isMelee = cardDivElement.querySelector('.stat-attack');
      const isRanged = cardDivElement.querySelector('.stat-ranged');
      const isMagic = cardDivElement.querySelector('.stat-magic');

      let attackType;
      if (isMelee !== null) {
        attackType = 'melee';
      } else if (isRanged !== null) {
        attackType = 'ranged';
      } else if (isMagic !== null) {
        attackType = 'magic';
      } else {
        attackType = 'none';
      }

      return attackType;
    }

    function getSecondPosAbilities(abilities) {
      const secondPosAbilities = abilities.filter(ability => {
        return ability === 'Opportunity' || ability === 'Reach';
      });

      return secondPosAbilities;
    }

    function getRangedAbilities(abilities) {
      const rangedAbilities = abilities.filter(ability => {
        return ability === 'Opportunity' || ability === 'Sneak';
      });

      return rangedAbilities;
    }

    function getAvailiableMana() {
      let totalMana = parseInt(document.querySelector('.mana-cap').textContent.trim());
      totalMana -= 3; // summoner 3 mana
      return totalMana;
    }

    function getAvailiableCards() {
      const cards = [];
      const cardDivs = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta');

      for (i = 0; i < cardDivs.length; i++) {
        const mana = parseInt(cardDivs[i].querySelector('.stat-mana').textContent.trim());
        const name = cardDivs[i].querySelector('.card-name-name').textContent;

        const abilities = getAbilities(cardDivs[i]);
        const attackType = getAttackType(cardDivs[i], abilities);

        cards.push({
          name: name,
          mana: mana,
          attackType: attackType,
          abilities: abilities,
          position: i,
        });
      };
      return cards;
    }

    function getCardElementByName(cardName, cards) {
      const cardPosition = cards.filter(card => card.name === cardName)[0].position;
      const cardElement = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[cardPosition].querySelector('img');
      return cardElement;
    }

    function getTank(cards, availiableMana) {
      let highestManaCard = cards[0];


      for (i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (card.mana > highestManaCard.mana && card.mana <= availiableMana) {
          highestManaCard = card;
        }
      }

      return highestManaCard;
    };

    function getSecondPositionCard(cards, availiableMana) {
      let secondPositionCards = cards.filter(
        card => card.mana <= availiableMana && card.attackType === 'melee' && (card.abilities.includes('Opportunity') || card.abilities.includes('Reach'))
      );

      return secondPositionCards[0];
    }

    function getArchers(totalMana, secondPosCard, cards) {
      let archers = [];

      if (secondPosCard === undefined) {
        secondPosCard = { name: "" }; // dummy value of name so that secondPosCard.name will still work
      }

      let rangedCards = cards.filter(card =>
        card.attackType === 'ranged' || (getRangedAbilities(card.abilities).length !== 0 && card.name !== secondPosCard.name)
      );

      for (i = 0; i < rangedCards.length; i++) {
        const rangedCard = rangedCards[i];
        if (rangedCard.mana < totalMana) {
          archers.push(rangedCard);
          totalMana -= rangedCard.mana;
        }

      }

      return archers;
    }

    const cards = getAvailiableCards();
    let availiableMana = getAvailiableMana();

    try {
      const chickenElement = getCardElementByName('Furious Chicken', cards);
      chickenElement.click();
    } catch (e) {
      console.log('chicken is not availiable');
    }

    const tank = getTank(cards, availiableMana);
    const tankElement = getCardElementByName(tank.name, cards);
    tankElement.click();
    availiableMana -= tank.mana;

    let secondPositionCard;
    try {
      secondPositionCard = getSecondPositionCard(cards, availiableMana);
      const secondPositionElement = getCardElementByName(secondPositionCard.name, cards);
      secondPositionElement.click();
      availiableMana -= secondPositionCard.mana;
    } catch (e) {
      console.log('second position cards not availiable');
    }

    const archers = getArchers(availiableMana, secondPositionCard, cards);
    archers.forEach(archer => {
      const archerElement = getCardElementByName(archer.name, cards);
      archerElement.click();
    });


  });
}






//maybe still make a list with objects for the cards
// calculate that position dynamically for the query selectors

// so basically how you get the urls is that you do the entire url then rule_<name of your rule here>_150.png
// async function pickCards(page, type) {
//   if (type === 'https://d36mxiodymuqjm.cloudfront.net/website/icons/rulesets/new/img_combat-rule_standard_150.png') {
//     await pickStandard(page);
//   } else if (type === 'http://d36mxiodymuqjm.cloudfront.net/website/icons/rulesets/new/img_combat-rule_even-stevens_150.png') {
//     await pickEvenStevens(page);
//   } else {
//     await pickStandard(page);
//   }
// }


async function pickStandard(page) {

  await page.evaluate(() => {

    function getCardElementByName(cardName, cardsList) {
      const cardPosition = cardsList.filter(card => card.name === cardName)[0].position;
      const cardElement = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[cardPosition].querySelector('img');
      return cardElement;
    }

    function getAvailiableCards() {
      const cards = [];
      const cardDivs = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta');

      for (i = 0; i < cardDivs.length; i++) {
        const mana = parseInt(cardDivs[i].querySelector('.stat-mana').textContent.trim());
        const name = cardDivs[i].querySelector('.card-name-name').textContent;
        const isMelee = cardDivs[i].querySelector('.stat-attack');
        const isRanged = cardDivs[i].querySelector('.stat-ranged');
        const isMagic = cardDivs[i].querySelector('.stat-magic');
        let attackType;
        if (isMelee !== null) {
          attackType = 'melee';
        } else if (isRanged !== null) {
          attackType = 'ranged';
        } else if (isMagic !== null) {
          attackType = 'magic';
        } else {
          attackType = 'none';
        }

        cards.push({
          name: name,
          mana: mana,
          attackType: attackType,
          position: i,
        });
      };
      return cards;
    }

    let totalMana = parseInt(document.querySelector('.mana-cap').textContent.trim());
    totalMana -= 3; // summoner(3)

    const cards = getAvailiableCards();

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

    if (totalMana < 4 && totalMana > 1) {
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

async function pickEvenStevens(page) {

  await page.evaluate(() => {

    function getCardElementByName(cardName, cardsList) {
      const cardPosition = cardsList.filter(card => card.name === cardName)[0].position;
      const cardElement = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta')[cardPosition].querySelector('img');
      return cardElement;
    }

    function getAvailiableCards() {
      const cards = [];
      const cardDivs = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta');

      for (i = 0; i < cardDivs.length; i++) {
        const mana = parseInt(cardDivs[i].querySelector('.stat-mana').textContent.trim());
        const name = cardDivs[i].querySelector('.card-name-name').textContent;
        const isMelee = cardDivs[i].querySelector('.stat-attack');
        const isRanged = cardDivs[i].querySelector('.stat-ranged');
        const isMagic = cardDivs[i].querySelector('.stat-magic');
        let attackType;
        if (isMelee !== null) {
          attackType = 'melee';
        } else if (isRanged !== null) {
          attackType = 'ranged';
        } else if (isMagic !== null) {
          attackType = 'magic';
        } else {
          attackType = 'none';
        }

        cards.push({
          name: name,
          mana: mana,
          attackType: attackType,
          position: i,
        });
      };
      return cards;
    }


    let totalMana = parseInt(document.querySelector('.mana-cap').textContent.trim());
    totalMana -= 3; // summoner(3)

    const cards = getAvailiableCards();

    const chickenEl = getCardElementByName('Furious Chicken', cards);
    chickenEl.click();

    const pitOgreEl = getCardElementByName('Pit Ogre', cards);
    pitOgreEl.click();
    totalMana -= 6;


    if (totalMana < 2) {
      return;
    }

    const goblinFireballerEl = getCardElementByName('Goblin Fireballer Spy', cards);
    goblinFireballerEl.click();
    totalMana -= 2;

    if (totalMana < 4 && totalMana > 1) {
      return;
    }

    const sparkPixiesEl = getCardElementByName('Spark Pixies', cards);
    sparkPixiesEl.click();
    totalMana -= 4;
  });
}

module.exports = pickCards;