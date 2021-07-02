const fetchData = require('./util/fetchData.js');
const logger = require('./util/winstonLogger.js');
const { pool } = require('./util/dataBaseConfig.js');

const { createTable, insertIntoTable } = require('./queries/queryFunctions.js');
const fnCreateMatchesTable = require('./queries/matches.js');
const fnCreateDeliveryTable = require('./queries/deliveries.js');
const {
  MATCHES_FILE_PATH,
  DELIVERIES_FILE_PATH,
  TEAM_ARRAY,
  PLAYER_ARRAY,
  UMPIRE_ARRAY,
  CITY_ARRAY,
  VENUE_ARRAY,
  SEASON_ARRAY,
} = require('./util/constants.js');

async function executeQuery(client, matchesData, deliveryData) {
  try {
    await client.query('BEGIN');
    await client.query(createTable('team', 'varchar(40)'));
    await client.query(createTable('player', 'varchar(40)'));
    await client.query(createTable('umpire', 'varchar(40)'));
    await client.query(createTable('city', 'varchar(40)'));
    await client.query(createTable('venue', 'varchar(80)'));
    await client.query(createTable('season', 'integer'));
  } catch (e) {
    logger.error(e.stack);
  }

  try {
    await insertIntoTable('teamTable', 'team', TEAM_ARRAY, 'winner', matchesData, client);
    await insertIntoTable('umpireTable', 'umpire', UMPIRE_ARRAY, 'umpire1', matchesData, client);
    await insertIntoTable('umpireTable', 'umpire', UMPIRE_ARRAY, 'umpire2', matchesData, client);
    await insertIntoTable('cityTable', 'city', CITY_ARRAY, 'city', matchesData, client);
    await insertIntoTable('venueTable', 'venue', VENUE_ARRAY, 'venue', matchesData, client);
    await insertIntoTable('seasonTable', 'season', SEASON_ARRAY, 'season', matchesData, client);
    await insertIntoTable('playerTable', 'player', PLAYER_ARRAY, 'player_of_match', matchesData, client);
    await insertIntoTable('playerTable', 'player', PLAYER_ARRAY, 'batsman', deliveryData, client);
    await insertIntoTable('playerTable', 'player', PLAYER_ARRAY, 'bowler', deliveryData, client);
  } catch (e) {
    logger.error(e.stack);
  }

  try {
    await fnCreateMatchesTable(matchesData, client);
    await fnCreateDeliveryTable(deliveryData, client);
  } catch (e) {
    logger.error(e.stack);
  }

  await client.query('COMMIT');
}
async function parseAndCreateData() {
  let matchesData;
  let deliveryData;

  try {
    matchesData = await fetchData(MATCHES_FILE_PATH);
    deliveryData = await fetchData(DELIVERIES_FILE_PATH);
  } catch (err) {
    console.log(err.message);
  }

  const client = await pool.connect();
  try {
    await executeQuery(client, matchesData, deliveryData);
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error(err.stack);
    console.log(err.message);
  } finally {
    client.release();
  }
}

parseAndCreateData();
