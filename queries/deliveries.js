const { TEAM_ARRAY, PLAYER_ARRAY, MATCH_ARRAY } = require('../util/constants.js');

async function fnCreateDeliveryTable(deliveryData, client) {
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
    ${MATCH_ARRAY.indexOf(delivery.match_id) + 1},
    ${delivery.inning},
    ${TEAM_ARRAY.indexOf(delivery.batting_team) + 1},
    ${TEAM_ARRAY.indexOf(delivery.bowling_team) + 1},
    ${delivery.over},
    ${delivery.ball},
    ${PLAYER_ARRAY.indexOf(delivery.batsman) + 1},
    ${PLAYER_ARRAY.indexOf(delivery.non_striker) + 1},
    ${PLAYER_ARRAY.indexOf(delivery.bowler) + 1},
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
}

module.exports = fnCreateDeliveryTable;
