const db = firebase.firestore();

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
  // decCountElement.textContent = decCount.toFixed(2);
  // winRatioElement.textContent = `W ${wins} / L ${losses}`;
});

alert('testing');