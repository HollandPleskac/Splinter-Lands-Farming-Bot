const fs = require('fs').promises;

const express = require('express');
const bodyparser = require('body-parser');
const puppeteer = require('puppeteer');

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
let splinterChoice = 'fire';

app.use(bodyparser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// (async function openSplinterLands() {})();

app.post('/open-splinterlands', async (request,response) => {
    const fileData = await fs.readFile('credentials.txt', 'utf8', function (err, data) {
      if (err) throw err;
      return data
    });
    const credentials = fileData.split(',');
    const username = credentials[0];
    const password = credentials[1];
    let returnResult = "success";
    try {
      page = await farming.startFarming(username, password);
    } catch(e) {
      returnResult = `failure : ${e}`
    }
    
    response.json({'data':returnResult});
});

app.post('/battle', async (request, response) => {

  let battleResponse = 'stopped battling - success';
  let restartFailedCount = 0;

  function shouldBattle() {
    return battleSwitch;
  }

  isInMatch = true;
  while (shouldBattle()) {
    try {
      const battleResults = await farming.battle(page, splinterChoice);
      await firestore.logBattle(db, battleResults);
      battleResponse = 'stopped battling - success';
    } catch (err) {
      console.log(`error battling ${err}, failed count ${restartFailedCount}`);
      await farming.performRestart(page);
      restartFailedCount++;
      if (restartFailedCount >= 3) {
        battleResponse = 'failed while battling - manual restart required';
        battleSwitch = false;
      }
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

app.post('/change-splinter-choice', (request, response) => {
  console.log('request body', request.body);
  splinterChoice = request.body.newSplinterChoice;
  response.json({'splinterChoice': splinterChoice});
});

app.get('/get-farming-status', (request, response) => {
  response.json({ 'status': battleSwitch });
});

app.get('/get-isInMatch', (request, response) => {
  response.json({ 'isInMatch': isInMatch });
});

app.get('/get-splinter-choice', (request, response) => {
  response.json({ 'splinterChoice': splinterChoice });
});

app.get('/', (request, response) => {
  response.json({'homepage': 'homepage'});
});



app.listen(8080);

// important for puppeteer and app engine

/*
  must set instance_class: F4 in the yaml file.
  https://stackoverflow.com/questions/62891633/puppeteer-error-navigation-failed-because-browser-has-disconnected
  problem is with app engines memory capacity.
  */