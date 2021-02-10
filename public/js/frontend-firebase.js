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
    if (documentSnapshot.data().winner === hvcMiner) {
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
        <div>
         <div>HVCMiner</div>
          <div class="cards-used">
            <img class="card" src="https://d36mxiodymuqjm.cloudfront.net/cards_beta/Torhilo%20the%20Frozen.png" alt="Torhilo">
          </div>
        </div>
       <div>VS</div>
       <div class="opponent">
          <div>${documentSnapshot.data().opponent}</div>
          <div class="cards-used">
          </div>
        </div>
      </div>
     `);
  });
});