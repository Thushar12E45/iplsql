const { pool } = require('../util/dataBaseConfig.js');
const logger = require('../util/winstonLogger.js');

async function extraRuns(year = 2016) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const extraRunsConceded = await client.query(`
    select team , sum(extra_runs) as runs
    from teamTable as team join
    deliveryTable as delivery on team.team_id = delivery.batting_team
    join matchesTable as matches on delivery.match_id=matches.match_id
    join seasonTable as season on matches.season_id=season.season_id
    where season=${year}
    group by team 
    order by runs  
  `);

    await client.query('COMMIT');

    return extraRunsConceded.rows;
  } catch (err) {
    await client.query('ROLLBACK');

    logger.error(err.stack);
    console.log(err.message);
  } finally {
    client.release();
  }
}

module.exports = extraRuns;
