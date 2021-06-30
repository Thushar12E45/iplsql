const { pool } = require('../util/dataBaseConfig.js');
const logger = require('../util/winstonLogger.js');

async function matchesWinPerTeam() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    let noOfWinsPerTeam = await client.query(`
   select season, team as winners, count(match_id) as noOfWins 
   from seasonTable as season join
   matchesTable as matches 
   on season.season_id = matches.season_id
   join teamTable as team 
   on matches.winner = team.team_id 
   group by season,winners
   order by season, noOfWins
  `);

    await client.query('COMMIT');

    noOfWinsPerTeam = noOfWinsPerTeam.rows;

    const matchesWonPerTeam = {};

    for (const x1 of noOfWinsPerTeam) {
      const obj = {};
      if (matchesWonPerTeam[x1.season]) {
        obj.team = x1.winners;
        obj.wins = x1.noofwins;
        matchesWonPerTeam[x1.season].push(obj);
      } else {
        matchesWonPerTeam[x1.season] = [];
        obj.team = x1.winners;
        obj.wins = x1.noofwins;
        matchesWonPerTeam[x1.season].push(obj);
      }
    }
    return matchesWonPerTeam;
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error(err.stack);
    console.log(err.message);
  } finally {
    client.release();
  }
}

module.exports = matchesWinPerTeam;
