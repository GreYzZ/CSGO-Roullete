Session.setDefault('total', 0);
Session.setDefault('depositGame', 'csgo');
Session.setDefault('historyType', 'withdraw');
Template.profile.events({
  'click .updateSteamProfile': function(e) {
    e.preventDefault();
    Meteor.call('updateSteamProfile', Meteor.user().profile.id, function(err, result) {
      if (result == true) {
        return sweetAlert('', 'Your profile updated', 'success');
      } else {
        return sweetAlert('', 'Please try again later', 'error');
      }
    });
  },
  'click .updateMe': function() {
    var user = Meteor.user();
    Meteor.call('updateUser', user, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        return sweetAlert('', 'Your inventory will be updated in 5 seconds', 'success');
      }
    });
  },
  'submit #promo': function(e, t) {
    e.preventDefault();
    var code = e.target.promocode.value;
    if (code != "") {
      Meteor.call('applyPromocode', Meteor.user()._id, code, function(err, result) {
        if (result == "code_not_found") {
          return sweetAlert('Sorry', 'This promocode is wrong', "error");
        }
        if (result == "cant_get_settings") {
          return sweetAlert('Sorry', 'Please try again later', "error");
        }
        if (result == "self_promo") {
          return sweetAlert('Sorry', 'You cant apply your promocode', "error");
        }
        if (result == true) {
          return sweetAlert('Success!', 'Promocode applyed', "success");
        }
      })
    }
  }
});

Template.tradelink.events({
  'submit #tradelink': function(e, t) {
    e.preventDefault();
    var link = e.target.tradelink.value;
    if (link == "") return;
    console.log(link);
    var arr = link.split("&");
    console.log(arr[1]);
    code = arr[1].split('');
    code.splice(0,6);
    code = code.join('');
    console.log(code);
    Meteor.call('applyTradeLink', Meteor.user()._id, code, function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "You have applyed trade link", "success");
        }
      }
    });
  }
});

Template.sendcoins.events({
  'submit #sendcoins': function(e) {
    e.preventDefault();
    var steamid = e.target.steamid.value;
    var amount = parseFloat(e.target.amount.value);
    var userid = Meteor.user()._id;
    if(typeof amount != 'number') return;
    if (steamid == "") return;
    if (amount <= 0) return;
    Meteor.call('sendCoins', userid, steamid, amount, function(err, result) {
      if (result == true) {
        return sweetAlert('', 'Success!', 'success');
      } else if (result == 'not_enough_money') {
        return sweetAlert('', 'Not enough coins', 'error');
      } else if (result == 'cant_find_second_user') {
        return sweetAlert('', 'Cant find user with this steam id', 'error');
      } else if (result == 'self_id') {
        return sweetAlert('', 'You cant do that', 'error');
      }
    })
  }
})

Template.profile.helpers({
  promobonus: function() {
    var settings = Settings.findOne();
    if (settings.partner_bonus) {
      return settings.partner_bonus;
    } else {
      return 0;
    }
  }
});
Template.profile.rendered = function() {
  console.log('rendered');
}

Template.withdrawsHistory.helpers({
  items: function() {
    var q = Session.get('historyType');
    return Withdraws.find({offertype: q, steamid: Meteor.user().profile.id}, {sort: {date: -1}, limit: 5}).fetch();
  }
});
Template.withdrawsHistory.events({
  'click .showAllWithdrawsHistory': function() {
    return Router.go('/h/withdraws');
  },
  'click .showDepositHistory': function() {
    return Session.set('historyType', 'income');
  },
  'click .showWithdrawHistory': function() {
    return Session.set('historyType', 'withdraw');
  }
});
Template.withdrawsHistoryFull.helpers({
  items: function() {
    var q = Session.get('historyType');
    return Withdraws.find({offertype: q, steamid: Meteor.user().profile.id}, {sort: {date: -1}});
  }
});
Template.withdrawsHistoryFull.events({
  'click .showDepositHistory': function() {
    return Session.set('historyType', 'income');
  },
  'click .showWithdrawHistory': function() {
    return Session.set('historyType', 'withdraw');
  }
})
Template.gameHistory.helpers({
  items: function() {
    return GameHistory.find({userId: Meteor.user()._id}, {sort: {date: -1}, limit: 5}).fetch();
  }
});
Template.gameHistory.events({
  'click .showAllGameHistory': function() {
    return Router.go('/h/bets');
  }
});
Template.betsHistoryFull.helpers({
  items: function() {
    return GameHistory.find({userId: Meteor.user()._id}, {sort: {date: 1}});
  }
});
