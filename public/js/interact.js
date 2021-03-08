const startServerBtn = document.querySelector('.start-server-btn');
const serverUrl = 'http://localhost:5000';

getCurrentServerStatus().then(result =>  updateBtn(result.status));

startServerBtn.addEventListener('click', async () => {
  await toggleServer();
});

async function toggleServer() {
  const result = await getCurrentServerStatus();
  const currentStatus = result.status;
  const switchResult = await switchStatus(currentStatus);
  const newStatus = switchResult.switch;
  updateBtn(newStatus);
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

function updateBtn(status) {
  console.log('server status ', status);
  if (status === true)
    startServerBtn.innerHTML = 'Server Running';
  else
    startServerBtn.innerHTML = 'Server Stopped';
}