Meteor.methods({
  findRoundById: function(roundId) {
    if (!roundId) return;
    var round = AllGamesHistory.findOne({roundId: roundId});
    if (round) {
      return round;
    }
  },
  findWithdrawById: function(withdrawId) {
    if (!withdrawId) return;
    var withdraw = Withdraws.findOne({_id: withdrawId});
    if (withdraw) {
      return withdraw
    }
  },
  findDepositById: function(depositId) {
    if (!depositId) return;
    var deposit = Withdraws.findOne({_id: depositId});
    if (deposit) {
      return deposit
    }
  },
  finduserBySteamId: function(steamid) {
    if (!steamid) return;
    var user = Meteor.users.findOne({"profile.id": steamid});
    if (!user) return "cant_find_user";
    if (user) {
      return user;
    }
  }
});