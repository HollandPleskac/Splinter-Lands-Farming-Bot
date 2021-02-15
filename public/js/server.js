// const serverUrl = 'http://aaccee.ddns.net';
const serverUrl = 'http://localhost:5000/';
let battleSplinter = 'none';

async function getServerStatus() {
  let serverData = {};
  let btnText;
  try {
    serverData = await fetch(`${serverUrl}/get-farming-status`)
      .then(response => response.json())
      .then(data => data);
  } catch (e) {
    serverData.status = 'battle unavailiable'; // triggers the else statement below
  }

  console.log(serverData);
  if (serverData.status === false) {
    btnText = 'Start the Server';
  } else if (serverData.status === true) {
    btnText = 'Stop the Server';
  } else {
    btnText = 'Server Unavailiable';
  }

  return {
    btnText: btnText,
    battleSwitch: serverData.status,
    isInMatch: true,
  };
}

async function startServer() {
  console.log('starting the server');

  const response = await fetch(`${serverUrl}/start-farming`, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => data);

  await startBattle();
  await getServerStatus().then((serverStatus) => {
    toggleBattleContent(serverStatus);
  });
}

async function stopServer() {
  console.log('stopping the server');

  const response = await fetch(`${serverUrl}/stop-farming`, {
    method: 'POST'
  })
    .then(response => response.json())
    .then(data => data);

  await getServerStatus().then((serverStatus) => {
    toggleBattleContent(serverStatus);
  });
}

async function toggleBattleContent(serverStatus) {
  // clone the node to get rid of event listeners
  let oldBattleBtn = document.querySelector('button');
  let newBattleBtn = oldBattleBtn.cloneNode(true);
  oldBattleBtn.replaceWith(newBattleBtn);

  // display button/h2 with new information
  newBattleBtn.textContent = serverStatus.btnText;

  // add event listener to button
  newBattleBtn.addEventListener('click', async () => {
    console.log(serverStatus.battleSwitch);
    if (serverStatus.battleSwitch === true) {
      await stopServer();
    } else {
      await startServer();
    }
  });
}

async function startBattle() {

  const isInMatchData = await fetch(`${serverUrl}/get-isInMatch`)
    .then(response => response.json())
    .then(data => data);

  if (isInMatchData.isInMatch === false) {
    fetch(`${serverUrl}/battle`, {
      method: 'POST'
    });
    console.log('starting battle!');
  } else {
    console.log('battle is already taking place!');
  }
}


// get the server status when the page loads
getServerStatus().then((serverStatus) => {
  toggleBattleContent(serverStatus);
});


// battle splinter logic

const fireBtn = document.querySelectorAll('.splinter-btns > img')[0];
const waterBtn = document.querySelectorAll('.splinter-btns > img')[1];
const earthBtn = document.querySelectorAll('.splinter-btns > img')[2];
const lifeBtn = document.querySelectorAll('.splinter-btns > img')[3];
const deathBtn = document.querySelectorAll('.splinter-btns > img')[4];

fireBtn.addEventListener('click', async () => {
  battleSplinter = 'fire';
  await changeBattleSplinter();
});

waterBtn.addEventListener('click', async () => {
  battleSplinter = 'water';
  await changeBattleSplinter();
});

earthBtn.addEventListener('click', async () => {
  battleSplinter = 'earth';
  await changeBattleSplinter();
});

lifeBtn.addEventListener('click', async () => {
  battleSplinter = 'life';
  await changeBattleSplinter();
});

deathBtn.addEventListener('click', async () => {
  battleSplinter = 'death';
  await changeBattleSplinter();
});

async function changeBattleSplinter() {
  const responseData = await fetch(`${serverUrl}/change-splinter-choice`, {
    method: 'POST',
    body: JSON.stringify({ "newSplinterChoice": battleSplinter }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then(response => response.json())
    .then(data => data);
  console.log('response', responseData);
  alert(`Splinter Changed to ${responseData.splinterChoice}`);
}