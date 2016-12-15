Session.setDefault('userTBets', 0);
Session.setDefault('userCTBets', 0);
Session.setDefault('userBombBets', 0);
Session.setDefault('oldTerrTotal', 0);
Session.setDefault('terrTotal', 0);
Session.setDefault('betReady', false);
Tracker.autorun(function() {
  const game = Games.findOne({started: false, finished: false, opened: true});
  if (!game) {
    return;
  }
  if (game.bets) {
    $("#totalRed").animateNumbers(parseInt(game.red));
    $("#totalBlack").animateNumbers(parseInt(game.black));
    $("#totalZero").animateNumbers(parseInt(game.zero));
  }
});

Template.betform.events({
  'keyup [name=betf]': function(e) {
    let bet  = document.getElementById('betamount').value;
    let r = parseInt(bet);
    if (isNaN(r)) {
      return;
    }
    if (typeof r == "number") {
      Session.set('betAmount', r);
    }
  }
});

Template.index.events({
  'click .betRed': function(e) {
    e.preventDefault();
    if (!Meteor.user()) {
      return;
    }
    if (Session.get('betCount') >= 3) {
      return sweetAlert('', 'Bet place limit reached', 'error');
    }
    createBet('red');
  },
  'click .betBlack': function(e) {
    e.preventDefault();
    if (!Meteor.user()) {
      return;
    }
    if (Session.get('betCount') >= 3) {
      return sweetAlert('', 'Bet place limit reached', 'error');
    }
    createBet('black');
  },
  'click .betZero': function(e) {
    e.preventDefault();
    if (!Meteor.user()) {
      return;
    }
    if (Session.get('betCount') >= 3) {
      return sweetAlert('', 'Bet place limit reached', 'error');
    }
    createBet('zero');
  }
});

function getGame(callback) {
  var game = Games.findOne({started: true, finished: false, opened: false});
  if (game) {
    return callback(game);
  } else {
    var game = Games.findOne({started: false, finished: false, opened: true});
    if (game) {
      return callback(game);
    } else {
      return callback(null);
    }
  }
}

Template.betButtons.helpers({
  'currentUserTerrBets': function() {
    return Session.get('userRedBets');
  },
  'currentUserCTBets': function() {
    return Session.get('userBlackBets');
  },
  'currentUserBombBets': function() {
    return Session.get('userZeroBets');
  },
  'totalRed': function() {
    return getGame(function(game) {
      if (game) {
        return parseInt(game.red);
      }
    });
  },
  'totalBlack': function() {
    return getGame(function(game) {
      if (game) {
        return parseInt(game.black);
      }
    });
  },
  'totalZero': function() {
    return getGame(function(game) {
      if (game) {
        return parseInt(game.zero);
      }
    });
  },
  'redBets': function() {
    var game = getGame(function(game) {
      return game;
    });
    var users = [];
    var total = 0;
    if (!game) return;
    _.each(game.bets, function(bet) {
      if (bet.side == 'red') {
        users.push({username: bet.username, amount: bet.bet, userid: bet.userid});
      }
    });
    var e = _.sortBy(users, "amount");
    return e.reverse();
  },
  'ctBets': function() {
    var game = getGame(function(game) {
      return game;
    });
    var users = [];
    if (!game) return;
    _.each(game.bets, function(bet) {
      if (bet.side == 'black') {
        users.push({username: bet.username, amount: bet.bet, userid: bet.userid});
      }
    });
    var e = _.sortBy(users, "amount");
    return e.reverse();
  },
  'bombBets': function() {
    var game = getGame(function(game) {
      return game;
    });
    var users = [];
    if (!game) return;
    _.each(game.bets, function(bet) {
      if (bet.side == 'zero') {
        users.push({username: bet.username, amount: bet.bet, userid: bet.userid});
      }
    });
    var e = _.sortBy(users, "amount");
    return e.reverse();
  }
});

function createBet(side) {

  if (Session.get('betCount') >= 3) {
    return sweetAlert('', 'Bet place limit reached', 'error');
  }
  var bet = parseInt(Session.get('betAmount'));
  if (bet == 0) {
    var r = document.getElementById('betamount').value;
    if (r == "") {
      return;
    }
    var b = parseInt(r);
    if (typeof b != "number") {
      return;
    }
    bet = b;
    Session.set('betAmount', bet);
  }
  var game = Games.findOne({started: false, finished: false, opened: true});
  if (!game) {
    return;
  }
  var options = {
  useEasing : true,
  useGrouping : true,
  separator : '',
  decimal : '.',
  prefix : '',
  suffix : ''
  };
  var money = parseInt(Meteor.user().profile.money) - bet;
  var rdy;
  var countup = new CountUp("balance", parseInt(Meteor.user().profile.money), money, 0, 2, options);
  Session.set('betReady', false);
  return Meteor.call('makeBet', Meteor.user()._id, game._id, bet, side, function(err, result) {
  if (err) return console.log(err);
  if (result === 'not_enough_money') return sweetAlert('', 'Not enough money', 'error');
  if (result === 'max_bet') return sweetAlert('', 'Maximum bet is 5 000 000', 'error');
  if (result === 'min_bet') return sweetAlert('', 'Minimum bet is 10', 'error');
  if (result === "max_count") return sweetAlert('', 'Bet place limit reached', 'error');
  if (result == true) {
    countup.start();
    Session.set('alreadyBet', true);
    Session.set('applied', true);
    var count = Session.get('betCount') + 1;
    Session.set('betCount', count);
    document.getElementById('betamount').value = "";
    Session.set('betReady', true);
    if (side === "red") {
      var userTBets = Session.get("userRedBets") + bet;
      Session.set("userRedBets", userTBets);
    } else if (side === "CT") {
      var userCTBets = Session.get("userBlackBets") + bet;
      Session.set("userBlackBets", userCTBets);
    } else if (side === "bomb") {
      var userBombBets = Session.get("userZeroBets") + bet;
      Session.set("userZeroBets", userBombBets);
    }
    //return sweetAlert('', 'bet accepted', 'success');
  }
  });
}
