
//d6fdce534a19f5e5a60b37d73bc25eab
//backback 56d0076fba8d88bd0af41735
//Kadira.connect('6BT5WxyxSA2M38xb3', '5b89a4e8-98f9-4a31-aede-fefc2ad03f5b');
Fiber = Npm.require('fibers')

//finish current game on server code reload or after deploying to server
Meteor.startup(function() {
  const game = Games.findOne({finished: false});
  Games._ensureIndex({"bets": 1});
  if (!game) return;
  setGameFinished(game._id);
  console.log('game state switched to "finished" on startup');
});

//just placeholder
Meteor.methods({
  getres: function(gameid) {
    this.unblock();
    const res = Results.findOne({gameid: gameid});
    if (res) {
      return res.result;
    }
  }
});


function setGameStateFinished(gameid) {
  Games.update({_id: gameid}, {$set: {finished: true}});
  createGame();

}


function findGame(callback) {
  const game = Games.findOne({started: false, finished: false, opened: true});
  if (game) {
    return callback(game);
  }
}


function checkBets() {
  findGame(function(game) {
    let terroristsBets;
    let ctBets;
    let bombBets;
    const bombModifier = game.bomb / (game.ct + game.terrorists);
    const terrModifier = game.terrorists / (game.ct + game.bomb);
    const ctModifier = game.ct / (game.bomb + game.terrorists);

    if (bombModifier <= 1) {
      findGame(function(game) {
        const rand = generateRandom(0, 10);
        if (rand == 0) {
          Results.update({gameid: game._id}, {$set: {result: 0}});
          Games.update(game, {$set: {result: 0}});

        }
      });
    }
    if (terrModifier <= 1) {
      findGame(function(game) {
        const rand = generateRandom(0, 10);
        if (rand == 0) {
          Results.update({gameid: game._id}, {$set: {result: 1}});
          Games.update(game, {$set: {result: 1}});

        }
      });
    }
    if (ctModifier <= 1) {
      findGame(function(game) {
        const rand = generateRandom(0, 10);
        if (rand == 0) {
          Results.update({gameid: game._id}, {$set: {result: 14}});
          Games.update(game, {$set: {result: 14}});

        }
      });
    }
  })
}

//this function creates new game
function createGame() {
  const settings = Settings.findOne();
  if (settings.roulette_active == "false") {
    return console.log("roulette disabled");
  }
  const minimum = 1; //min number
  const maximum = 14;//max number
  let num = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum; //generate random number
  const minZero = 0;
  const maxZero = 20;
  const zero = Math.floor(Math.random() * (maxZero - minZero + 1)) + minZero;


  if (zero == 0) {
    num = 0;
  }
  let options = {
    started: false,
    finished: false,
    opened: true,
    calculated: false,
    red: 0,
    black: 0,
    zero: 0,
    bets: [],
    result: num,
    date: new Date()
  }
  try {
    Games.insert(options, function(err, gameid) {
      if (!err) {
        options.gameid = gameid;
        Results.insert(options);
      }
    });

    //createSomeBots();
    /*
    Meteor.setTimeout(function() {
      checkBets();
    }, 48000);
    */
    Meteor.setTimeout(function() {
      findGame(function(game) {
        Games.update(game, {$set: {started: true, opened: false}}); //start game
        setGameFinished(game._id);
      });
    }, 50000);
    return true;
  } catch (e) {
    throw new Meteor.Error('error while inserting game');
  }
}

function setGameFinished(gameid) {
  Meteor.setTimeout(function() {
    const game = Games.findOne({_id: gameid});
    if (!game) {
      throw new Meteor.Error('cant find game..');
    }
    Games.update(game, {$set: {finished: true}});
    saveHistory(game);
    calculateWins(gameid);
  }, 10000);
}


function calculateWins(gameid) {
  Meteor.setTimeout(function() {
    const game = Games.findOne({_id: gameid});
    Games.update(game, {$set: {calculated: true}});
    ResultHistory.insert(game);
    const red = [1,2,3,4,5,6,7];
    const black = [8,9,10,11,12,13,14];
    const zero = 15;
    let result;
    let modifier;
    if (red.indexOf(game.result) > -1) {
      result = "red";
      modifier = 2;
    } else if (black.indexOf(game.result) > -1) {
      result = "black";
      modifier = 2;
    } else {
      result = "zero";
      modifier = 20;
    }
    if (game.bets.length == 0) {
      return;
    }
    _.each(game.bets, function(betItem) {
      if (betItem.side == result) {
        const user = Meteor.users.findOne({_id: betItem.userid});
        if (!user) {
          return;
        }

        const userMoney = parseInt(user.profile.money) + parseInt(betItem.bet * modifier);
        const userWins = parseInt(user.profile.totalWins) + parseInt(betItem.bet * modifier);
        Meteor.users.update(user, {$set: {"profile.money": userMoney, "profile.totalWins": userWins}});
        const earnings = parseInt(betItem.bet * modifier);
        const resultObj = {
          earnings: earnings,
          side: result,
          bet: betItem.bet,
          type: "win"
        }
        toHistory(game._id, game.date, user._id, resultObj);
      }
    });
  }, 0);
}

function saveHistory(game) {
  game.roundId = game._id;
  AllGamesHistory.insert(game);
}

function toHistory(gameid, gameDate, userid, result) {
  if (!gameid || !userid || !result) return;
  const user = Meteor.users.findOne({_id: userid});
  if (!user) return;
  const side = result.side;
  const params = {
    gameId: gameid,
    userId: userid,
    date: gameDate,
    side: result.side,
    earnings: result.earnings,
    bet: result.bet,
    type: 'win'
  }
  GameHistory.insert(params);
}

function createSomeBots() {
  Meteor.setTimeout(function() {
    var botCount = 10;
    var maximum = 100;
    var minimum = 0;
    var names = ["first", "second", "third", "Bob", "John", "Foo", "Bar"];
    var bots = [];
    for (var i = 0; i <= botCount; i++) {
      var randomNames = Math.floor(Math.random() * Names.length);
      var randomName = Names[randomNames];
      var bet = generateRandom(10, 100);
      var sideNum = generateRandom(1, 3);
      var side;
      if (sideNum == 1) {
        side = "terrorists";
      } else if (sideNum == 2) {
        side = "ct";
      } else if (sideNum == 3) {
        side = "bomb"
      }
      bots.push({
        name: randomName,
        bet: bet,
        side: side,
        robot: true
      });
    }
    var game = Games.findOne({started: false, finished: false, opened: true});
    if (game) {
      _.each(bots, function(bot) {
        var d = generateRandom(100, 15000);
        Meteor.setTimeout(function() {
          gameUpdate(game._id, bot)
        }, d);

      });
    }
  }, 1000);

}

function gameUpdate(gameid, bot) {
  var game = Games.findOne({_id: gameid});
  var botside;
  var query = {};
  var helper;
  if (bot.side == "red") {
    helper = game.red;
    var total = helper + bot.bet;
    query["red"] = total;
  } else if (bot.side == "black") {
    helper = game.ct;
    var total = helper + bot.bet;
    query["black"] = total
  } else if (bot.side == "zero") {
    helper = game.bomb;
    var total = helper + bot.bet;
    query["zero"] = total
  }
  if (game) {
      Games.update(game, {$set: query, $push: {bets: {username: bot.name, bet: bot.bet, side: bot.side}}});
  }
}
/*
function updateGameTerr(gameid, bot) {
  var game = Games.findOne({_id: gameid});
  var timeout = generateRandom(1000, 17000)
  if (game) {
    Meteor.setTimeout(function() {
      var total = game.terrorists + bot.bet;
      Games.update(game, {$set: {ct: total}, $push: {bets: {username: bot.name, bet: bot.bet, side: bot.side}}});
    }, timeout);
  }
}
*/
function generateRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

Meteor.setInterval(function() {
  createGame();
}, 60000)
