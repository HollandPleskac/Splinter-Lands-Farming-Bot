const fs = require('fs').promises;

const express = require('express');
const bodyparser = require('body-parser');

const startFarming = require('./farming');
const { start } = require('repl');

const app = express();

app.use(bodyparser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.post('/start-farming', async (request, response) => {

  // get credentials
  const fileData = await fs.readFile('credentials.txt', 'utf8', function (err, data) {
    if (err) throw err;
    return data
  });
  const credentials = fileData.split(',');
  const username = credentials[0];
  const password = credentials[1];

  const result = await startFarming(username, password)

  response.json({ 'match history': `${username} + ${password}` });
});

app.listen(3000);