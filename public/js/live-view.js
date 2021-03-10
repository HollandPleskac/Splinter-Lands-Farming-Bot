const db = firebase.firestore();
const liveViewContent = document.querySelector('.live-view-content');

function getBattleHtml(hvcminerTeamData, opponentTeamData, opponentName) {
  return `
  <div class="battle">
    <div>
      <h3>HVC Miner</h3>
      <div class="fighters">
        <div
          class="fighter-img-div"
          style="background-image: url(${hvcminerTeamData[0].cardUrl})">
        </div>
        <div
          class="fighter-img-div"
          style="background-image: url(${hvcminerTeamData[1].cardUrl})">
        </div>
        <div
          class="fighter-img-div"
          style="background-image: url(${hvcminerTeamData[2].cardUrl})">
        </div>
        <div
          class="fighter-img-div"
          style="background-image: url(${hvcminerTeamData[3].cardUrl})">
        </div>
        <div
          class="fighter-img-div"
          style="background-image: url(${hvcminerTeamData[4].cardUrl})">
        </div>
        <div
          class="fighter-img-div"
          style="background-image: url(${hvcminerTeamData[5].cardUrl})">
        </div>
        <div
          class="fighter-img-div"
          style="background-image: url(${hvcminerTeamData[6].cardUrl})">
        </div>
      </div>
    </div>
    <div>
      <h3>${opponentName}</h3>
      <div class="fighters">
        <div 
          class="fighter-img-div"
          style="background-image: url(${opponentTeamData[0].cardUrl})">
        </div>
        <div 
          class="fighter-img-div"
          style="background-image: url(${opponentTeamData[1].cardUrl})">
        </div>
        <div 
          class="fighter-img-div"
          style="background-image: url(${opponentTeamData[2].cardUrl})">
        </div>
        <div 
          class="fighter-img-div"
          style="background-image: url(${opponentTeamData[3].cardUrl})">
        </div>
        <div 
          class="fighter-img-div"
          style="background-image: url(${opponentTeamData[4].cardUrl})">
        </div>
        <div 
          class="fighter-img-div"
          style="background-image: url(${opponentTeamData[5].cardUrl})">
        </div>
        <div 
          class="fighter-img-div"
          style="background-image: url(${opponentTeamData[6].cardUrl})">
        </div>
      </div>
    </div>
  </div>
`;
}

// get initial data
db.collection("Battle Log").orderBy("timestamp", "desc").limit(10)
  .get()
  .then(querySnapshot => {
    querySnapshot.forEach(doc => {
      liveViewContent.insertAdjacentHTML(
        'beforeend',
        getBattleHtml(
          doc.data().hvcminerTeam,
          doc.data().opponentTeam,
          doc.data().opponent
        )
      );
    })
  })

// listen for data that is added
db.collection("Battle Log").limit(1).onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === "added") {
      liveViewContent.insertAdjacentHTML(
        'afterbegin',
        getBattleHtml(
          change.doc.data().hvcminerTeam,
          change.doc.data().opponentTeam,
          change.doc.data().opponent
        )
      );
    }
  })
});