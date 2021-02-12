const db = firebase.firestore();

const decCountElement = document.getElementById('dec-count');
const winRatioElement = document.getElementById('win-ratio');
const lossRatioElement = document.getElementById('loss-ratio');
const previousBattlesElement = document.querySelector('.battle-results-content');


db.collection('Battle Log').onSnapshot(querySnapshot => {
  let decCount = 0;
  let wins = 0;
  let losses = 0;
  querySnapshot.forEach(documentSnapshot => {
    decCount += documentSnapshot.data().dec;
    if (documentSnapshot.data().winner === 'hvcminer') {
      wins += 1;
    } else {
      losses += 1;
    }

  });
  decCountElement.textContent = decCount.toFixed(2);
  winRatioElement.textContent = `W ${wins}`;
  lossRatioElement.textContent = `L ${losses}`;
});

function insertCardImages(player, doc) {
  const playerCardsDiv = document.getElementById(doc.id + player);
  doc.data()[player + 'Team'].forEach(card => {
    if (card.cardUrl === "") {
      playerCardsDiv.insertAdjacentHTML('beforeend', '<div class="empty-card"></div>');
    } else {
      playerCardsDiv.insertAdjacentHTML('beforeend', `
        <div class="card tooltip" style="background-image: url(${card.cardUrl})" data-text="${card.cardName}"></div>
       `);
    }
  });
}

function setColorClasses(doc) {
  const hvcminerName = document.getElementById(doc.id + 'hvcminer').previousElementSibling;
  const opponentName = document.getElementById(doc.id + 'opponent').previousElementSibling;
  const vsElement = document.getElementById(doc.id).querySelector('.vs').firstElementChild;
  console.log(doc.data().winner);
  if (doc.data().winner === 'hvcminer') {
    vsElement.classList.add('winner');
    vsElement.style.borderColor = "#b5ff88";
    hvcminerName.classList.add('winner');
    opponentName.classList.add('loser');
  } else {
    vsElement.classList.add('loser');
    vsElement.style.borderColor = "#f88";
    hvcminerName.classList.add('loser');
    opponentName.classList.add('winner');
  }

}

// listen for new documents

db.collection('Battle Log').orderBy('timestamp', 'desc').onSnapshot(querySnapshot => {
  querySnapshot.docChanges().forEach(change => {
    previousBattlesElement.insertAdjacentHTML('afterbegin', `
      <div class="battle-result" id="${change.doc.id}">
        <div>
         <div>HVCMiner</div>
          <div class="cards-used" id="${change.doc.id}hvcminer">
            
          </div>
        </div>
       <div class="vs"><p>VS</p></div>
       <div class="opponent">
          <div>${change.doc.data().opponent}</div>
          <div class="cards-used" id="${change.doc.id}opponent">

          </div>
        </div>
      </div>
     `);
    insertCardImages('hvcminer', change.doc);
    insertCardImages('opponent', change.doc);
    setColorClasses(change.doc);
  });
});



// set the initial data


db.collection('Battle Log').orderBy('timestamp', 'desc').limit(40).get(querySnapshot => {
  querySnapshot.forEach(docSnap => {
    previousBattlesElement.insertAdjacentHTML('beforeend', `
      <div class="battle-result" id="${docSnap.id}">
        <div>
         <div>HVCMiner</div>
          <div class="cards-used" id="${docSnap.id}hvcminer">
            
          </div>
        </div>
       <div class="vs"><p>VS</p></div>
       <div class="opponent">
          <div>${docSnap.data().opponent}</div>
          <div class="cards-used" id="${docSnap.id}opponent">

          </div>
        </div>
      </div>
     `);
    insertCardImages('hvcminer', docSnap);
    insertCardImages('opponent', docSnap);
    setColorClasses(docSnap);
  });
});