Meteor.publish('messages', function(room) {
  return Messages.find({room: room}, {sort: {time: -1}, limit: 50});
});
Meteor.publish("results", function() {
  return Results.find({});
});
Meteor.publish("userStatus", function() {
  return Meteor.users.find({ "status.online": true });
});
Meteor.publish('games', function() {
    return Games.find({}, {sort: {date: -1}, limit: 10});
});
Meteor.publish('items', function() {
  return Items.find();
});
Meteor.publish("currentOffers", function(steamid, offertype) {
  return Withdraws.find({offertype: offertype, done: false, steamid: steamid});
});
Meteor.publish('users', function() {
  return Meteor.users.find({}, {sort: {'status.lastLogin.date': -1}}, {limit: 50});
});

Meteor.publish('prices', function() {
  return Prices.find();
});

Meteor.publish('settings', function(userId) {
  if (checkAdmin(userId)) {
    return Settings.find();
  };
});
Meteor.publish('pricesAdmin', function(userId) {
  if (checkAdmin(userId)) {
    return Prices.find({}, {fields: {'median_price': 1, 'name': 1}});
  };
});
Meteor.publish('giveaways', function() {
    return Giveaways.find();

});
Meteor.publish('publicSettings', function(fields) {
  return Settings.find({}, {fields: fields});
});
Meteor.publish('faq', function() {
  return Settings.find({}, {fields: {'faqText': 1}});
});
Meteor.publish('settingsBotNames', function() {
  return Settings.find({}, {fields: {'bots': 1, 'minimal_price': 1}});
});

Meteor.publish('profileSettings', function() {
  return Settings.find({}, {fields: {'partner_bonus': 1}});
});
Meteor.publish('indexAlert', function() {
  return Settings.find({}, {fields: {'alert': 1}});
});
Meteor.publish('withdrawsHistory', function(steamid) {
  var user = Meteor.users.findOne({"profile.id": steamid});
  if (!user) return;
  return Withdraws.find({steamid: steamid});
});
Meteor.publish('gameHistory', function(userid) {
  var user = Meteor.users.findOne({_id: userid});
  if (!user) return;
  return GameHistory.find({userId: userid});
});
Meteor.publish('usersAdmin', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (user && user.profile && user.profile.group == "admin" || user.profile.group == "superadmin") {
      return Meteor.users.find();
  }
});
Meteor.publish('coinsTransfers', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (user && user.profile && user.profile.group == "admin" || user.profile.group == "superadmin") {
      return CoinsTransfers.find();
  }
});

Meteor.publish('adminGameHistory', function(userId, options) {
  var user = Meteor.users.findOne({_id: userId});
  if (user && user.profile && user.profile.group == "admin" || user.profile.group == "superadmin") {
      console.log('subscribed');
      return AllGamesHistory.find({}, options);
  }
});
Meteor.publish('adminWithdrawsHistory', function(userId, options) {
  if (checkAdmin(userId)) {
    console.log('admin');
    return Withdraws.find({offertype: 'withdraw'}, options);
  };
});
Meteor.publish('adminDepositHistory', function(userId, options) {
  if (checkAdmin(userId)) {
    console.log('admin');
    return Withdraws.find({offertype: 'income'}, options);
  };
});
Meteor.publish('tickets', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (user && user.profile && user.profile.group == "admin" || user.profile.group == "superadmin") {
      return Support.find({}, {sort: {date: -1}});
  }
});

function checkAdmin(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (user && user.profile && user.profile.group == "admin" || user.profile.group == "superadmin") {
    return true;
  } else {
    return false;
  }
}
