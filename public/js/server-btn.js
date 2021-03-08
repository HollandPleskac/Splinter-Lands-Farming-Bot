const startServerBtn = document.querySelector('.start-server-btn');
const serverUrl = 'http://localhost:5000';

getCurrentServerStatus().then(result => updateBtn(result.status));

startServerBtn.addEventListener('click', async () => {
  await toggleServer();
  await battle();
  await updateBtn();
});

// toggle server
async function toggleServer() {
  const result = await getCurrentServerStatus();
  const currentStatus = result.status;
  await switchStatus(currentStatus);
}

async function getCurrentServerStatus() {
  return fetch(`${serverUrl}/get-farming-status`)
    .then(res => res.json())
    .catch(err => console.log(err));
}

async function switchStatus(status) {
  let condition;
  if (status === true) {
    condition = 'stop';
  } else {
    condition = 'start';
  }
  return await fetch(`${serverUrl}/${condition}-farming`, {
    method: 'POST'
  })
    .then(res => res.json())
    .catch(err => console.log(err));
}

// battle
async function battle() {
  const isInMatch = await isInBattle();
  if (!isInMatch) {
    await fetch(`${serverUrl}/battle`, {
      method: 'POST'
    })
      .then(res => res.json())
      .catch(err => console.log(err));
    
  } else {
    return false;
  }

}

async function isInBattle() {
  const isInMatchResult = await fetch(`${serverUrl}/get-isInMatch`)
    .then(res => res.json())
    .catch(err => console.log(err));
  console.log('is in match result, ', isInMatchResult.isInMatch);
  return isInMatchResult.isInMatch;
}

// update btn
async function updateBtn() {
  const result = await getCurrentServerStatus();
  if (result.status === true)
    startServerBtn.innerHTML = 'Server Running';
  else
    startServerBtn.innerHTML = 'Server Stopped';
}