Meteor.methods({
  'editFaq': function(text, userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return;
    if (user.profile.group === 'admin' || user.profile.group === 'superadmin') {
      var settings = Settings.findOne();
      Settings.update(settings, {$set: {faqText: text}});
      return true;
    }
  },
  changeUserBalance: function(userId, balance, callback) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return;
    try {
      Meteor.users.update(user, {$set: {"profile.money": parseFloat(balance)}});
      return true;
    } catch (e) {
      return e
    }
  },
  changeItemPrice: function(name, price) {
    var item = Prices.findOne({name: name});
    if (!item) return;
    Prices.update(item, {$set: {median_price: price}});
    return true;
  }
});