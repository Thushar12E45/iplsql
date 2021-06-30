const { pool } = require('../util/dataBaseConfig.js');
const logger = require('../util/winstonLogger.js');

async function matchesPlayed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const totalMatchesPlayed = await client.query(`
   select season,count(match_id)
   from seasonTable as season join matchesTable as matches
   on season.season_id=matches.season_id
   group by season
   order by season
  `);

    await client.query('COMMIT');

    return totalMatchesPlayed.rows;
  } catch (err) {
    await client.query('ROLLBACK');

    logger.error(err.stack);
    console.log(err.message);
  } finally {
    client.release();
  }
}

module.exports = matchesPlayed;
