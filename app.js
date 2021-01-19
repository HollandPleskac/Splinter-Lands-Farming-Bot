const fs = require('fs').promises;

const express = require('express');
const bodyparser = require('body-parser');

const startFarming = require('./farming');

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

// TODO in the tank function make it only pick tanks that match the elements (no neutral tanks)

// https://medium.com/@gabe.szczepanek/keep-your-node-js-server-running-forever-49f066ee6405 async.forever() to run the server forever
// in the {} run, await startFarming();
// in the async forever have a while look that checks to see if the user wants to continue farming
// if not set some flag var to false so that the server is still running but it is not farming anymore
//before starting set a timeout of some time or write some logic that navigates to the login screen where start garming occurs?
// also close the window in puppeteer if stopped
// 

/*

while (true) {
  await battle(page);
}

move this code out of start farming and into async.forever
// that way you could keep the puppeteer window but not do anything with it unless the http request changed something??

 --> *** maybe the http request could change something in firebase where the while(true) could check to look at the document *** <--

*/