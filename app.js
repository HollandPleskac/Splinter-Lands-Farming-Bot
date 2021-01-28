const fs = require('fs').promises;

const express = require('express');
const bodyparser = require('body-parser');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const farming = require('./farming');
const firestore = require('./firestore');
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

let page;
let battleSwitch = false;
let isInMatch = false;

app.use(bodyparser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

(async function openSplinterLands() {
  const fileData = await fs.readFile('credentials.txt', 'utf8', function (err, data) {
    if (err) throw err;
    return data
  });
  const credentials = fileData.split(',');
  const username = credentials[0];
  const password = credentials[1];
  page = await farming.startFarming(username, password);
})();

app.post('/battle', async (request, response) => {
  let battleResponse = 'stopped battling - success';
  function shouldBattle() {
    return battleSwitch;
  }

  isInMatch = true;
  while (shouldBattle()) {
    try {
      const battleResults = await farming.battle(page);
      await firestore.logBattle(db, battleResults);
    } catch (err) {
      console.log(`error battling ${err}`);
      await page.screenshot('./screenshots/battle-err.png');
    }
  }
  isInMatch = false;

  response.json({ result: battleResponse });
});

app.post('/start-farming', async (request, response) => {
  battleSwitch = true;
  response.json({ switch: 'true' });
});

app.post('/stop-farming', async (request, response) => {
  battleSwitch = false;
  response.json({ switch: 'false' });
});

app.get('/get-farming-status', (request, response) => {
  response.json({ 'status': battleSwitch });
});

app.get('/get-isInMatch', (request, response) => {
  response.json({ 'isInMatch': isInMatch });
})

app.listen(3000);

// cancel match
// before cards
// after cards