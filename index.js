const express = require('express');
const exphbs = require('express-handlebars');
const logger = require('./util/winstonLogger.js');

const matchesPlayed = require('./tasks/matchesPlayed.js');
const matchesWinPerTeam = require('./tasks/matchesWinPerTeam.js');
const extraRuns = require('./tasks/extraRuns.js');
const economicalBowlers = require('./tasks/economicalBowlers.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Handlebars middleware
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

let matchesPlayedResult;
let matchesWinPerTeamResult;
let extraRunsResult;
let economicalBowlersResult;

async function start() {
  try {
    matchesPlayedResult = await matchesPlayed();
    matchesWinPerTeamResult = await matchesWinPerTeam();
    console.log(matchesWinPerTeamResult);
    extraRunsResult = await extraRuns();
    economicalBowlersResult = await economicalBowlers();
  } catch (e) {
    console.log(e.message);
    logger.error(e.stack);
  }

  // app.use(express.static('public'));
  // app.use(express.static(`${__dirname}/public/`));
  app.use(express.static(`${__dirname}/public`));
  app.get('/', (req, res) => {
    res.render('index', {
      matchesPlayedResult,
      matchesWinPerTeamResult,
      extraRunsResult,
      economicalBowlersResult,
    });
  });

  app.listen(PORT, () => {
    console.log(`Listening at port http://localhost:${PORT}/`);
  });
}

start();
