const {
  TEAM_ARRAY,
  PLAYER_ARRAY,
  UMPIRE_ARRAY,
  CITY_ARRAY,
  VENUE_ARRAY,
  SEASON_ARRAY,
  MATCH_ARRAY,
} = require('../util/constants.js');

async function fnCreateMatchesTable(matchesData, client) {
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

  for (const match of matchesData) {
    if (!MATCH_ARRAY.includes(match.id)) {
      MATCH_ARRAY.push(match.id);
    }
    await client.query(`Insert into public.matchesTable values(${match.id},
    ${SEASON_ARRAY.indexOf(match.season) + 1},
    ${CITY_ARRAY.indexOf(match.city) + 1},
    '${match.date}',
    ${TEAM_ARRAY.indexOf(match.team1) + 1},
    ${TEAM_ARRAY.indexOf(match.team2) + 1},
    ${TEAM_ARRAY.indexOf(match.toss_winner) + 1},
    '${match.toss_decision}',
    '${match.result}',
    '${match.dl_applied}',
    ${TEAM_ARRAY.indexOf(match.winner) + 1},
    ${match.win_by_runs},
    ${match.win_by_wickets},
    ${PLAYER_ARRAY.indexOf(match.player_of_match) + 1},
    ${VENUE_ARRAY.indexOf(match.venue) + 1},
    ${UMPIRE_ARRAY.indexOf(match.umpire1) + 1},
    ${UMPIRE_ARRAY.indexOf(match.umpire2) + 1}
    )`);
  }
  console.log('matchesTable complete');
}

module.exports = fnCreateMatchesTable;
