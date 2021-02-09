const db = firebase.firestore();

const decCountElement = document.getElementById('dec-count');
const winRatioElement = document.getElementById('win-ratio');
const previousBattlesElement = document.querySelector('.battle-results-content');


db.collection('Battle Log').onSnapshot(querySnapshot => {
  let decCount = 0;
  let wins = 0;
  let losses = 0;
  querySnapshot.forEach(documentSnapshot => {
    decCount += documentSnapshot.data().dec;
    if (documentSnapshot.data().isWinner === true) {
      wins += 1;
    } else {
      losses += 1;
    }

  });
  decCountElement.textContent = decCount.toFixed(2);
  winRatioElement.textContent = `W ${wins} / L ${losses}`;
});

db.collection('Battle Log').orderBy('timestamp', 'desc').limit(40).onSnapshot(querySnapshot => {
  querySnapshot.forEach(documentSnapshot => {
    previousBattlesElement.insertAdjacentHTML('beforeend', `
        <div class="battle-result-even-columns">
          <div>HVCMiner</div>
          <div>VS</div>
          <div class="opponent">${documentSnapshot.data().opponent}</div>
        </div>
     `);
  });
});