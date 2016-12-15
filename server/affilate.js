Meteor.methods({
  affilateUser: function(affilateId, userSteamId) {
    if (!affilateId || !userSteamId) return;
    var user = Meteor.users.findOne({"profile.id": userSteamId});
    var affilate = Meteor.users.findOne({_id: affilateId});
    if (!user || !affilate) return console.log("cant find user");
    if (affilate.profile.affilated == true) return 'already_affilated';
    try {
      var userMoney = parseFloat(affilate.profile.money) + 500;
      Meteor.users.update(affilate, {$set: {'profile.affilated': true, 'profile.affilatedWith': user._id, 'profile.money': userMoney}});
    } catch (err) {
      console.log(err);
      return err;
    }

    console.log(affilate._id);
    var query = {
      $push: {
        'profile.affilates': {
          userId: affilate._id,
          username: affilate.profile.username,
          date: new Date(),
          bonus: 0,
          steamid: affilate.profile.id,
          deposited: false
        }
      }
    }
    var g = updateAffilate(user, query, function(result) {
      if (result == true) {
        return true;
      }
    })
    if (g == true) {
      return true;
    }
  },
  removeAffilate: function(affilateId, userSteamId) {
    if (!affilateId || !userSteamId) return;
    var user = Meteor.users.findOne({"profile.id": userSteamId});
    var affilate = Meteor.users.findOne({_id: affilateId});
    if (!user || !affilate) return console.log("cant find user");
    try {
      Meteor.users.update(affilate, {$set: {'profile.affilated': false, 'profile.affilatedWith': null}});
    } catch (err) {
      console.log(err);
      return err;
    }
    var query = {
      $pull: {
        'profile.affilates': {
          userId: affilate._id
        }
      }
    }
    var g = updateAffilate(user, query, function(result) {
      if (result == true) {
        return true;
      }
    })
    if (g == true) {
      return true;
    }
  },
  collectAffilateBonus: function(userId) {
    const user = Meteor.users.findOne({_id: userId});
    if (!user) return 'cant find user';
    if (user.profile.affilates.length > 0) {
      var affilates = user.profile.affilates;
      var total = 0;
      _.each(affilates, function(item) {
        total += item.bonus;
      });
      var totalBonus = parseFloat(user.profile.availableBonus) + parseFloat(user.profile.money);
      if (user.profile.availableBonus == 0) {
        return "nothing_to_collect";
      }
      Meteor.users.update(user, {$set: {'profile.money': totalBonus, 'profile.availableBonus': 0}});
      return true;
    } else {
      return "nothing_to_collect";
    }
  },
  editPromocode: function(userId, promocode) {
    if (!userId || !promocode) return;
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return;
    var exception = false;
    var users = Meteor.users.find({}).fetch();
    _.each(users, function(item) {
      if (item.profile.promocode == promocode) {
        exception = true;
        return;
      }
    });
    if (exception == true) {
      return "already_in_use";
    }
    try {
      Meteor.users.update(user, {$set: {"profile.promocode": promocode}});
      return true;
    } catch (err) {
      console.log(err);
    }
  }
});

function updateAffilate(user, query, callback) {
  try {
    Meteor.users.update(user, query);
    console.log('updated');
    return callback(true);
  } catch (err) {
    return callback(false);
  }
}
