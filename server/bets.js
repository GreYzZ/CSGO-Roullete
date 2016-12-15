Meteor.methods({
  /*
  *create new bet
  *
  *@method makeBet
  *@param {String} userId (id of user)
  *@param {String} gameid (id of game)
  *@param {Number} bet (bet amount)
  *@param {String} side (terrorists/ct/bomb)
  */
  makeBet: function(userid, gameid, bet, side) {
    this.unblock();
    var bet = parseInt(bet);
    if (bet <= 0) {
      return;
    }
    if (isNaN(bet)) {
      return console.log("not a number!");
    }
    if (bet > 5000000) {
      return "max_bet";
    }
    if (bet < 10) {
      return "min_bet";
    }
    var user = Meteor.users.findOne({_id: userid});
    if (!user) {
      throw new Meteor.Error('Cant find user');
    }
    if (user.profile.money < parseInt(bet)) {
      return 'not_enough_money';
    }
    var game = Games.findOne({started: false, finished: false, opened: true});
    if (!game) {
      throw new Meteor.Error('Cant find game');
    }
    var u = _.where(game.bets, {userid: user._id});
    if (u.length >= 3) {
      return "max_count";
    }
    if (user.profile.affilated == true) {
      var userAffilated = user.profile.affilatedWith;
      if (!userAffilated) {
        console.log('not affilated');
      } else {
        var bonusRecepient = Meteor.users.findOne({_id: userAffilated});
        var aff = bonusRecepient.profile.affilates;
        var cbonus;
        _.each(aff, function(item) {
          if (item.userId == user._id) {
            console.log(item);
            cbonus = item.bonus;
            return item;
          }
        });

        var modifier;
        var affilatesCount = 0;
        _.each(bonusRecepient.profile.affilates, function(item) {
          if (item.deposited == true) {
            affilatesCount += 1;
          }
        });


        if (affilatesCount >= 0 && affilatesCount < 50) {
          modifier = 300;
        } else if (affilatesCount >= 50 && affilatesCount < 150) {
          modifier == 200;
        } else if (affilatesCount >= 150) {
          modifier == 100;
        }
        var totalBonus = bet/modifier;
        Meteor.users.update({_id: bonusRecepient._id, 'profile.affilates.userId': user._id}, {$inc: {
          "profile.affilates.$.bonus": totalBonus,
          "profile.totalAffilateBonus": totalBonus,
          "profile.availableBonus": totalBonus
          }
        });

      }
    }
    var total;
    var query = {};
    switch (side) {
      case "red":
        total = game.red + bet;
        query['red'] = total;
        break;
      case "black":
        total = game.black + bet;
        query['black'] = total;
        break
      case "zero":
        total = game.zero + bet;
        query['zero'] = total;
        break;
    }
    try {
      Games.update(game, {$set: query, $push: {bets: {userid: user._id, username: user.profile.username, bet: bet, side: side}}});
      updateUserBalance(user._id, bet);
      return true;
    } catch (err) {
      console.log(err);
    }
  },
  /*
  *remove user bet from database
  *
  *@method clearBet
  *@param {String} userid
  */
  clearBet: function(userid) {
    var game = Games.findOne({started: false, finished: false, opened: true});
    if (game) {
      var user = Meteor.users.findOne({_id: userid});
      if (!user) {
        throw new Meteor.Error('cant find user');
      }
      try {
        if (game.started !== false) {
          return 'already_started';
        }
        var userbet = 0;
        var side;
        _.each(game.bets, function(item) {
          if (item.userid == user._id) {
            userbet = item.bet;
            side = item.side;
          }
        });
        if (side == "terrorists") {
          var total = game.terrorists - userbet;
          Games.update(game, {$set: {terrorists: total}, $pull: {'bets': {'userid': user._id}}});
          var usermoney = user.profile.money + userbet;
          Meteor.users.update(user, {$set: {"profile.money": usermoney}});
        } else if (side == "ct") {
          var total = game.ct - userbet;
          Games.update(game, {$set: {ct: total}, $pull: {'bets': {'userid': user._id}}});
          var usermoney = user.profile.money + userbet;
          Meteor.users.update(user, {$set: {"profile.money": usermoney}});
        } else if (side == "bomb") {
          var total = game.bomb - userbet;
          Games.update(game, {$set: {bomb: total}, $pull: {'bets': {'userid': user._id}}});
          var usermoney = user.profile.money + userbet;
          Meteor.users.update(user, {$set: {"profile.money": usermoney}});
        }
        return userbet;
      } catch (err) {
        return err;
      }
    }
  },
  updateBalance: function(userid, bet) {
    updateUserBalance(userid, bet);
  }
});

function updateUserBalance(userid, bet) {
  var user = Meteor.users.findOne({_id: userid});
  if (!user) {
    return console.log('cant find user');
  }
  userMoney = parseInt(user.profile.money) - parseInt(bet);
  totalBets = parseInt(user.profile.totalBets) + parseInt(bet);
  try {
    Meteor.users.update(user, {$set: {"profile.money": userMoney, "profile.totalBets": totalBets}});
  } catch (err) {
    throw new Meteor.Error('Problem with updating user balance..');
  }
}
