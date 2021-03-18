const fs = require('fs').promises;

const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const farming = require('./farming');
const firestore = require('./firestore');
const app = express();

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

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/img', express.static(__dirname + '/public/img'));

app.get('/', (request, response) => {
  response.sendFile('index.html', { root: path.join(__dirname, './views') });
});

app.get('/interact', (request, response) => {
  console.log('auth query ',request.params.uid );
  response.sendFile('interact.html', { root: path.join(__dirname, './views') });
});

app.get('/statistics', (request, response) => {
  console.log(request.headers );
  response.sendFile('statistics.html', { root: path.join(__dirname, './views') });
});

app.get('/live-view', (request, response) => {
  console.log(request.headers );
  response.sendFile('live-view.html', { root: path.join(__dirname, './views') });
});

app.get('/account', (request, response) => {
  console.log(request.headers );
  response.sendFile('account.html', { root: path.join(__dirname, './views') });
});

app.get('/login', (request, response) => {
  console.log(request.headers );
  response.sendFile('login.html', { root: path.join(__dirname, './views/auth-views') });
});

app.get('/signup', (request, response) => {
  console.log(request.headers );
  response.sendFile('signup.html', { root: path.join(__dirname, './views/auth-views') });
});

app.post('/open-splinterlands', async (request, response) => {
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
  } catch (e) {
    returnResult = `failure : ${e}`
  }

  console.log('successfully opened splinterlands');
  response.json({ 'data': returnResult });
});

app.post('/battle', async (request, response) => {

  let battleResponse = 'stopped battling - success';
  let restartFailedCount = 0;
  let failedWhileRestarting = false;

  function shouldBattle() {
    return battleSwitch;
  }

  isInMatch = true;
  while (shouldBattle()) {
    try {
      const battleResults = await farming.battle(page, splinterChoice);
      await firestore.logBattle(battleResults);
      battleResponse = 'stopped battling - success';
    } catch (err) {
      console.log(`error battling ${err}, failed count ${restartFailedCount}`);

      try {
        await farming.performRestart(page);
      } catch (e) {
        battleResponse = `failed while performing restart - check on server + ${e}`;
        failedWhileRestarting = true;
        battleSwitch = false;
      }


      restartFailedCount++;
      if (restartFailedCount >= 20 && failedWhileRestarting === false) {
        battleResponse = `failed while battling - manual restart required + ${err}`;
        battleSwitch = false;
      }
    }

  }
  isInMatch = false;

  response.json({ result: battleResponse });

});

app.post('/start-farming', async (request, response) => {
  battleSwitch = true;
  response.json({ switch: true });
});


app.post('/stop-farming', async (request, response) => {
  battleSwitch = false;
  response.json({ switch: false });
});

app.post('/change-splinter-choice', (request, response) => {
  console.log('request body', request.body);
  splinterChoice = request.body.newSplinterChoice;
  response.json({ 'splinterChoice': splinterChoice });
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


app.listen(5000);