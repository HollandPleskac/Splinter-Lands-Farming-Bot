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
    if (documentSnapshot.data().winner === 'hvcMiner') {
      wins += 1;
    } else {
      losses += 1;
    }

  });
  decCountElement.textContent = decCount.toFixed(2);
  winRatioElement.textContent = `W ${wins} / L ${losses}`;
});

function displayCardImages(player, docSnap) {
  const playerCardsDiv = document.getElementById(docSnap.id + player);
  docSnap.data()[player + 'Team'].forEach(card => {
    if (card.cardUrl === "") {
      playerCardsDiv.insertAdjacentHTML('beforeend', '<div class="empty-card"></div>');
    } else {
      playerCardsDiv.insertAdjacentHTML('beforeend', `
        <div class="card tooltip" style="background-image: url(${card.cardUrl})" data-text="${card.cardName}"></div>
       `);
    }

  });
}

db.collection('Battle Log').orderBy('timestamp', 'desc').limit(40).onSnapshot(querySnapshot => {
  querySnapshot.forEach(documentSnapshot => {
    previousBattlesElement.insertAdjacentHTML('beforeend', `
      <div class="battle-result-columns">
        <div>
         <div>HVCMiner</div>
          <div class="cards-used" id="${documentSnapshot.id}hvcminer">
            
          </div>
        </div>
       <div class="vs"><p>VS</p></div>
       <div class="opponent">
          <div>${documentSnapshot.data().opponent}</div>
          <div class="cards-used" id="${documentSnapshot.id}opponent">

          </div>
        </div>
      </div>
     `);
    displayCardImages('hvcminer', documentSnapshot);
    displayCardImages('opponent', documentSnapshot);
  });
});