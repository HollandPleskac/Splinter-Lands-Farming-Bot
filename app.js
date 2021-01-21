const fs = require('fs').promises;

const express = require('express');
const bodyparser = require('body-parser');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const farming = require('./farming');
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

let page;
let battleSwitch = false;

app.use(bodyparser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

(async function () {
  const fileData = await fs.readFile('credentials.txt', 'utf8', function (err, data) {
    if (err) throw err;
    return data
  });
  const credentials = fileData.split(',');
  const username = credentials[0];
  const password = credentials[1];

  page = await farming.startFarming(username, password);
  
})();

app.post('/battle', async(request, response) => {
  function shouldBattle() {
    return battleSwitch;
  }
  while (shouldBattle()) {
    await farming.battle(page);
  }

  response.json({result: 'stopped battling'});
});

app.post('/start-farming', async (request, response) => {
  battleSwitch = true;
  response.json({switch: 'true'});
});

app.post('/stop-farming', async(request, response) => {
  battleSwitch = false;
  response.json({switch: 'false'});
});

app.listen(3000);

