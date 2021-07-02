const { pool } = require('../util/dataBaseConfig.js');
const logger = require('../util/winstonLogger.js');

async function economicalBowlers(year = 2015) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const economicalBowlersResult = await client.query(`
   select player as bowler,
   Trunc((((sum(wide_runs)+sum(batsman_runs)+sum(noball_runs))/count(player)::float)*6)::numeric,2) as economy_rate 
   from playertable  join
   deliverytable as delivery on playertable.player_id=delivery.bowler
   join matchestable as matches on delivery.match_id=matches.match_id 
   join seasontable as season on season.season_id=matches.season_id
   where season =${year}
   group by player
   order by economy_rate
   limit 10
   `);

    await client.query('COMMIT');

    return economicalBowlersResult.rows;
  } catch (err) {
    await client.query('ROLLBACK');

    logger.error(err.stack);
    console.log(err.message);
  } finally {
    client.release();
  }
}

module.exports = economicalBowlers;
