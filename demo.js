const x = [
  { season: 2010, winners: 'Kolkata Knight Riders', noofwins: '7' },
  { season: 2010, winners: 'Delhi Daredevils', noofwins: '7' },
  { season: 2010, winners: 'Deccan Chargers', noofwins: '8' },
  {
    season: 2010,
    winners: 'RCB',
    noofwins: '8',
  },
  { season: 2010, winners: 'Chennai Super Kings', noofwins: '9' },
  { season: 2010, winners: 'Mumbai Indians', noofwins: '11' },
  { season: 2011, winners: '', noofwins: '1' },
  { season: 2011, winners: 'Delhi Daredevils', noofwins: '4' },
  { season: 2011, winners: 'Pune Warriors', noofwins: '4' },
  { season: 2011, winners: 'Rajasthan Royals', noofwins: '6' },
  { season: 2011, winners: 'Kochi Tuskers Kerala', noofwins: '6' },
];

// const seasons = [];
const matchesWonPerTeam = {};

for (const x1 of x) {
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

console.log(matchesWonPerTeam);
