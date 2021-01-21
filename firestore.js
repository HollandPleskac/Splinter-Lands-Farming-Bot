async function logBattle(db, battleResults) {
  console.log('logging the battle');
  const res = await db.collection('Battle Log').add(battleResults);
  console.log(res.id);
}

module.exports = { logBattle };