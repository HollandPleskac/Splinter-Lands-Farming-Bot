const admin = require('firebase-admin');

const db = admin.firestore();

async function logBattle(battleResults) {
  console.log('logging the battle');
  const res = await db.collection('Battle Log').add(battleResults);
  console.log(res.id);
}

async function getConversionRates(opponentSplinter) {

  const conversionRates = [];

  // get total wins
  let fireWins = 0;
  let waterWins = 0;
  let earthWins = 0;
  let deathWins = 0;
  let lifeWins = 0;

  const snapshot = await db.collection("Battle Log").where("opponentSplinter", "==", opponentSplinter).get();
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
      } else {
        lifeWins++;
      }
    }
  });

  // add the data to conversion rates
  conversionRates.push(fireWins / snapshot.size);
  conversionRates.push(waterWins / snapshot.size);
  conversionRates.push(earthWins / snapshot.size);
  conversionRates.push(deathWins / snapshot.size);
  conversionRates.push(lifeWins / snapshot.size);

  return conversionRates;
}

function getSummonerThompsonSampling(conversionRates) {
  /*

    python server call to get chosen splinter
    return the splinter

  */
}

module.exports = { logBattle, getConversionRates };