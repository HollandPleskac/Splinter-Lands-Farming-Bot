const fs = require('fs').promises;
const async = require('async');

const express = require('express');
const bodyparser = require('body-parser');

const farming = require('./farming');

const app = express();

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
})

app.post('/start-farming', async (request, response) => {
  battleSwitch = true;
  response.json({switch: 'true'});

});

app.post('/stop-farming', async(request, response) => {
  battleSwitch = false;
  response.json({switch: 'false'});
  // write to firestore to stop the battle
});

app.listen(3000);

