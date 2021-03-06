const url = 'http://localhost:5000';

const fireBtn = document.querySelector('.fire-btn');
const waterBtn = document.querySelector('.water-btn');
const earthBtn = document.querySelector('.earth-btn');
const lifeBtn = document.querySelector('.life-btn');
const deathBtn = document.querySelector('.death-btn');
const dragonBtn = document.querySelector('.dragon-btn');
const randomBtn = document.querySelector('.random-btn');
const bestBtn = document.querySelector('.best-btn');

fireBtn.addEventListener('click', async () => {
  await changeMode('fire');
});

waterBtn.addEventListener('click', async () => {
  await changeMode('water');
});

earthBtn.addEventListener('click', async () => {
  await changeMode('earth');
});

lifeBtn.addEventListener('click', async () => {
  await changeMode('life');
});

deathBtn.addEventListener('click', async () => {
  await changeMode('death');
});

dragonBtn.addEventListener('click', async () => {
  await changeMode('dragon');
});

randomBtn.addEventListener('click', async () => {
  await changeMode('RANDOM');
});

bestBtn.addEventListener('click', async () => {
  await changeMode('BEST');
});

async function changeMode(mode) {
  await fetch(`${url}/change-splinter-choice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 'newSplinterChoice': mode })
  })
    .then(res => res.json)
    .catch(err => console.log(err));
}