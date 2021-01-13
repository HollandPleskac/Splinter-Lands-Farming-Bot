const fs = require('fs');

const express = require('express');
const bodyparser = require('body-parser');

const app = express();

app.use(bodyparser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.post('/start-farming', (request, response) => {
  // get credentials
  fs.readFile('credentials.txt', 'utf8', function(err,data) {
    if (err) throw err;
    credentials = data.split(',');
    const userName = credentials[0];
    const password = credentials[1];
  });
  response.json({'match history': 'testing'});
});

app.listen(3000);