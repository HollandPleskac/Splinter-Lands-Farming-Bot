async function pickCards(page, summonerMana) {
  return await page.evaluate((summonerMana) => {
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

    function getSplinter(cardDivElement) {
      const isNeutral = cardDivElement.getAttribute('card_color') === 'Gray' ? true : false;
      const isFire = cardDivElement.getAttribute('card_color') === 'Red' ? true : false;
      const isWater = cardDivElement.getAttribute('card_color') === 'Blue' ? true : false;
      const isEarth = cardDivElement.getAttribute('card_color') === 'Green' ? true : false;
      const isDeath = cardDivElement.getAttribute('card_color') === 'Black' ? true : false;
      const isLife = cardDivElement.getAttribute('card_color') === 'White' ? true : false;
      const isDragon = cardDivElement.getAttribute('card_color') === 'Gold' ? true : false;

      let splinter;
      if (isNeutral === true) {
        splinter = 'neutral';
      } else if (isFire === true) {
        splinter = 'fire';
      } else if (isWater === true) {
        splinter = 'water';
      } else if (isEarth === true) {
        splinter = 'earth';
      } else if (isDeath === true) {
        splinter = 'dark';
      } else if (isLife === true) {
        splinter = 'light';
      } else if (isDragon === true) {
        splinter = 'dragon';
      } else {
        splinter = 'unknown';
      }

      return splinter;

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

    function getAvailiableMana(summonerMana) {
      let totalMana = parseInt(document.querySelector('.mana-cap').textContent.trim());
      totalMana -= summonerMana; // summoner 3 mana
      return totalMana;
    }

    function getAvailiableCards() {
      const cards = [];
      const cardDivs = document.querySelector('.deck-builder-page2__cards').querySelectorAll('div > .card.beta');

      for (let i = 0; i < cardDivs.length; i++) {
        const mana = parseInt(cardDivs[i].querySelector('.stat-mana').textContent.trim());
        const name = cardDivs[i].querySelector('.card-name-name').textContent;

        const abilities = getAbilities(cardDivs[i]);
        const attackType = getAttackType(cardDivs[i], abilities);
        const splinter = getSplinter(cardDivs[i]);


        cards.push({
          name: name,
          mana: mana,
          attackType: attackType,
          abilities: abilities,
          splinter: splinter,
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


      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (card.mana > highestManaCard.mana && card.mana <= availiableMana && card.splinter !== 'neutral' && card.attackType !== 'ranged') {
          highestManaCard = card;
        }
      }

      return highestManaCard;
    };

    function getRandomNumber(min, max) {
      const randomNumber = Math.floor(Math.random() * (max + min) + min);
      return randomNumber;
    }

    function getSecondPositionCard(cards, availiableMana) {
      // get random second pos card
      let secondPositionCards = cards.filter(
        card => card.mana <= availiableMana && card.attackType === 'melee' && (card.abilities.includes('Opportunity') || card.abilities.includes('Reach'))
      );

      const randomNumber = getRandomNumber(0, secondPositionCards.length);
      return secondPositionCards[randomNumber];
    }

    function getArchers(totalMana, secondPosCard, cards) {
      let archers = [];

      if (secondPosCard === undefined) {
        secondPosCard = { name: "" }; // dummy value of name so that secondPosCard.name will still work
      }

      let rangedCards = cards.filter(card =>
        card.attackType === 'ranged' || (getRangedAbilities(card.abilities).length !== 0 && card.name !== secondPosCard.name)
      );

      for (let i = 0; i < rangedCards.length; i++) {
        const randomNum = getRandomNumber(0, rangedCards.length);
        const rangedCard = rangedCards[randomNum];
        if (rangedCard.mana < totalMana) {
          archers.push(rangedCard);
          rangedCards.splice(i, 1); // remove from archers
          totalMana -= rangedCard.mana;
        }
      }

      return archers;
    }

    function getLeftOvers(totalMana, tank, secondPosCard, chosenArchers, cards) {

      let leftOverCards = [];

      const archerNamesList = chosenArchers.map(archer => archer.name);

      if (secondPosCard === undefined) {
        secondPosCard = { name: "" }; // dummy value of name so that secondPosCard.name will still work
      }

      // calculate mana remaining
      const possibleLeftOvers = cards.filter(card => card.mana <= totalMana && card.name !== tank.name && card.name !== secondPosCard.name && archerNamesList.includes(card.name) === false && card.name !== 'Furious Chicken');

      possibleLeftOvers.forEach(leftOver => {
        if (leftOver.mana <= totalMana) {
          leftOverCards.push(leftOver);
          totalMana -= leftOver.mana;
        }
      })

      return leftOverCards;
    }

    function getLastSlot(totalManaRemaining, pickedCards, cards) {
      const remainingCards = cards.filter(card => {
        return !pickedCards.includes(card.name) && card.mana <= totalManaRemaining;
      });
      console.log('cards that are remaining to be picked', remainingCards);
      let lastCard = remainingCards[0];
      for (let i = 0; i < remainingCards.length; i++) {
        if (remainingCards[i].mana > lastCard.mana) {
          lastCard = remainingCards[i];
        }
      }
      console.log('out of those cards, picked', lastCard);
      return lastCard;
    }

    const cards = getAvailiableCards();
    let availiableMana = getAvailiableMana(summonerMana);
    let position = 1;

    if (availiableMana <= 30) {
      try {
        const chickenElement = getCardElementByName('Furious Chicken', cards);
        chickenElement.click();
        position++;
      } catch (e) {
        console.log('chicken is not availiable');
      }
    }

    const tank = getTank(cards, availiableMana);
    const tankElement = getCardElementByName(tank.name, cards);
    tankElement.click();
    availiableMana -= tank.mana;
    position++;

    let secondPositionCard;
    try {
      secondPositionCard = getSecondPositionCard(cards, availiableMana);
      const secondPositionElement = getCardElementByName(secondPositionCard.name, cards);
      secondPositionElement.click();
      availiableMana -= secondPositionCard.mana;
      position++;
    } catch (e) {
      console.log('second position cards not availiable');
    }

    let chosenArchers = [];
    const archers = getArchers(availiableMana, secondPositionCard, cards);
    archers.forEach(archer => {
      if (archer.mana <= availiableMana && position < 6) {
        const archerElement = getCardElementByName(archer.name, cards);
        archerElement.click();
        availiableMana -= archer.mana;
        chosenArchers.push(archer);
        position++;
      }
    });

    let chosenLeftOvers = [];
    try {
      const leftovers = getLeftOvers(availiableMana, tank, secondPositionCard, chosenArchers, cards);
      leftovers.forEach(leftOverCard => {
        if (leftOverCard.mana <= availiableMana && position < 6) {
          const leftOverCardElement = getCardElementByName(leftOverCard.name, cards);
          leftOverCardElement.click();
          availiableMana -= leftOverCard.mana;
          chosenLeftOvers.push(leftOverCard);
          position++;
        }
      });
    } catch (e) {
      console.log('could not get leftover cards', e);
    }
    console.log('availiable mana after picking everything', availiableMana);

    let lastCard;
    try {
      lastCard = getLastSlot(availiableMana, ['Furious Chicken', tank.name, secondPositionCard.name, ...chosenArchers.map(a => a.name), ...chosenLeftOvers.map(l => l.name)], cards)
      const lastCardEl = getCardElementByName(lastCard.name, cards);
      lastCardEl.click();
      availiableMana -= lastCard.mana;
    } catch (e) {
      console.log('could not get last slot card', e);
    }

    try {
      console.log('Team Chosen : ', ['Furious Chicken', tank.name, secondPositionCard.name, ...chosenArchers.map(a => a.name), ...chosenLeftOvers.map(l => l.name), lastCard.name]);
    } catch (e) {
      console.log('print didnt work');
    }


    return availiableMana;
  }, summonerMana);
}

module.exports = pickCards;