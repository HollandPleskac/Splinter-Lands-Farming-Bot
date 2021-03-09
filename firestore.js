const admin = require('firebase-admin');

const db = admin.firestore();

async function logBattle(battleResults) {
  console.log('logging the battle');
  const res = await db.collection('Battle Log').add(battleResults);
  console.log(res.id);
}

async function getSplinterFromConversionRates(opponentSplinter, availiableSplinters, battleRule) {

  const conversionRates = {};

  // get total wins
  let fireWins = 0;
  let waterWins = 0;
  let earthWins = 0;
  let deathWins = 0;
  let lifeWins = 0;
  let dragonWins = 0;

  // TODO filter out non availiable splinters for snapshots
  let snapshot;
  if (opponentSplinter !== null) {
    // best against a specific splinter
    snapshot = await db.collection("Battle Log").where("opponentSplinter", "==", opponentSplinter).where('rule', '==', battleRule).get();
    console.log('first snap', snapshot.size);
    if (snapshot.size === 0) {
      snapshot = await db.collection("Battle Log").where("opponentSplinter", "==", opponentSplinter).get();
      console.log('second snap', snapshot.size);
    }
  } else {
    // best aginst all splinters
    snapshot = await db.collection("Battle Log").get();
    console.log('third snap', snapshot.size);
  }

  snapshot.forEach(doc => {
    let hvcminerSplinter = doc.data().hvcminerSplinter;
    if (doc.data().winner === 'hvcminer') {
      if (hvcminerSplinter === 'fire') {
        fireWins++;
      } else if (hvcminerSplinter === 'water') {
        waterWins++;
      } else if (hvcminerSplinter === 'earth') {
        earthWins++;
      } else if (hvcminerSplinter === 'death') {
        deathWins++;
      } else if (hvcminerSplinter === 'life') {
        lifeWins++;
      } else {
        dragonWins++;
      }
    }
  });

  // add the data to conversion rates (if there is no snapshot.size, 0 is added)
  conversionRates.fire = fireWins / snapshot.size || 0;
  conversionRates.water = waterWins / snapshot.size || 0;
  conversionRates.earth = earthWins / snapshot.size || 0;
  conversionRates.death = deathWins / snapshot.size || 0;
  conversionRates.life = lifeWins / snapshot.size || 0;
  conversionRates.dragon = dragonWins / snapshot.size || 0;

  // remove unused conversion rates
  // TODO REMOVE

  for (const splinter in conversionRates) {
    if (!availiableSplinters.includes(splinter)) {
      delete conversionRates[splinter];
    }
  }
  console.log(battleRule, conversionRates);

  // loop through and get highest conversion rate

  let highestConversionRateSplinter = Object.keys(conversionRates)[0];
  for (const splinter in conversionRates) {
    if (conversionRates[splinter] > conversionRates[highestConversionRateSplinter]) {
      highestConversionRateSplinter = splinter;
    }
  }

  // return the value

  return highestConversionRateSplinter;
}

function getSummonerThompsonSampling(conversionRates) {
  /*

    python server call to get chosen splinter
    return the splinter

  */
}

module.exports = { logBattle, getSplinterFromConversionRates };