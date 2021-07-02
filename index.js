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
    extraRunsResult = await extraRuns(2016);
    economicalBowlersResult = await economicalBowlers(2015);
  } catch (e) {
    console.log(e.message);
    logger.error(e.stack);
  }

  try {
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
  } catch (e) {
    logger.error(e.stack);
  }
}

start();
