const fetchData = require('./util/fetchData.js');
const { MATCHES_FILE_PATH, DELIVERIES_FILE_PATH } = require('./util/constants.js');
const logger = require('./util/winstonLogger.js');
const { pool } = require('./util/dataBaseConfig.js');
const { createTable, insertIntoTable } = require('./util/queryFunctions.js');

async function executeQuery(client, matchesData, deliveryData) {
  await client.query('BEGIN');
  await client.query(createTable('team', 'varchar(40)'));
  await client.query(createTable('player', 'varchar(40)'));
  await client.query(createTable('umpire', 'varchar(40)'));
  await client.query(createTable('city', 'varchar(40)'));
  await client.query(createTable('venue', 'varchar(80)'));
  await client.query(createTable('season', 'integer'));

  const teamArray = [];
  await insertIntoTable('teamTable', 'team', teamArray, 'winner', matchesData, client);

  const playerArray = [];
  await insertIntoTable('playerTable', 'player', playerArray, 'player_of_match', matchesData, client);

  const umpireArray = [];
  await insertIntoTable('umpireTable', 'umpire', umpireArray, 'umpire1', matchesData, client);
  await insertIntoTable('umpireTable', 'umpire', umpireArray, 'umpire2', matchesData, client);

  const cityArray = [];
  await insertIntoTable('cityTable', 'city', cityArray, 'city', matchesData, client);

  const venueArray = [];
  await insertIntoTable('venueTable', 'venue', venueArray, 'venue', matchesData, client);

  const seasonArray = [];
  await insertIntoTable('seasonTable', 'season', seasonArray, 'season', matchesData, client);

  const createMatchesTable = ` 
  DROP table IF EXISTS matchesTable cascade;
  create table matchesTable(
    match_id SERIAL Primary Key,
    season_id integer  References seasonTable(season_id),
    city_id   integer  References cityTable(city_id),
    date timestamp,
    team1   integer  References teamTable(team_id),
    team2   integer  References teamTable(team_id),
    toss_winner   integer  References teamTable(team_id),
    toss_decision varchar(20),
    result   varchar(20),
    dl_applied varchar(20),
    winner integer  References teamTable(team_id),
    win_by_runs integer,
    win_by_wickets integer,
    player_of_the_match integer References playerTable(player_id),
    venue integer References venueTable(venue_id),
    umpire1 integer References umpireTable(umpire_id),
    umpire2 integer References umpireTable(umpire_id)
  )`;
  await client.query(createMatchesTable);

  const matchArray = [];
  for (const match of matchesData) {
    if (!matchArray.includes(match.id)) {
      matchArray.push(match.id);
    }
    await client.query(`Insert into public.matchesTable values(${match.id},
      ${seasonArray.indexOf(match.season) + 1},
      ${cityArray.indexOf(match.city) + 1},
      '${match.date}',
      ${teamArray.indexOf(match.team1) + 1},
      ${teamArray.indexOf(match.team2) + 1},
      ${teamArray.indexOf(match.toss_winner) + 1},
      '${match.toss_decision}',
      '${match.result}',
      '${match.dl_applied}',
      ${teamArray.indexOf(match.winner) + 1},
      ${match.win_by_runs},
      ${match.win_by_wickets},
      ${playerArray.indexOf(match.player_of_match) + 1},
      ${venueArray.indexOf(match.venue) + 1},
      ${umpireArray.indexOf(match.umpire1) + 1},
      ${umpireArray.indexOf(match.umpire2) + 1}
      )`);
  }
  console.log('matchesTable complete');

  await insertIntoTable('playerTable', 'player', playerArray, 'batsman', deliveryData, client);
  await insertIntoTable('playerTable', 'player', playerArray, 'bowler', deliveryData, client);

  const createDeliveryTable = `
  DROP table IF EXISTS deliveryTable cascade;
  create table deliveryTable(
    match_id integer References matchesTable(match_id),
    inning integer,
    batting_team integer References teamTable(team_id),
    bowling_team integer References teamTable(team_id),
    over integer,
    ball integer,
    batsman integer References playerTable(player_id),
    non_striker integer References playerTable(player_id),
    bowler integer References playerTable(player_id),
    super_over integer,
    wide_runs integer,
    bye_runs integer,
    leg_bye_runs integer,
    noball_runs integer,
    penalty_runs integer,
    batsman_runs integer,
    extra_runs integer,
    total_runs integer
  )`;
  await client.query(createDeliveryTable);
  console.log('delivery table created');

  for (const delivery of deliveryData) {
    await client.query(` Insert into public.deliveryTable values( 
    ${matchArray.indexOf(delivery.match_id) + 1},
    ${delivery.inning},
    ${teamArray.indexOf(delivery.batting_team) + 1},
    ${teamArray.indexOf(delivery.bowling_team) + 1},
    ${delivery.over},
    ${delivery.ball},
    ${playerArray.indexOf(delivery.batsman) + 1},
    ${playerArray.indexOf(delivery.non_striker) + 1},
    ${playerArray.indexOf(delivery.bowler) + 1},
    ${delivery.is_super_over},
    ${delivery.wide_runs},
    ${delivery.bye_runs},
    ${delivery.legbye_runs},
    ${delivery.noball_runs},
    ${delivery.penalty_runs},
    ${delivery.batsman_runs},
    ${delivery.extra_runs},
    ${delivery.total_runs}
    )`);
  }
  console.log('Inserting into delivery complete');

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

module.exports = parseAndCreateData;
