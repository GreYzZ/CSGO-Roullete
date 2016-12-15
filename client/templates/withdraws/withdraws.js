Session.setDefault('itemsgame', 'csgo');
Session.setDefault('currentOffer', null);
Session.setDefault('botname', 'bombroulette');
Session.setDefault('sortWithdraws', 'HL');
Session.setDefault('total', 0);
Session.setDefault('slot1', null);
Session.setDefault('slot2', null);
Session.setDefault('slot3', null);
Session.setDefault('slot4', null);
Session.setDefault('slot5', null);
Session.setDefault('slot6', null);
Session.setDefault('slot7', null);
Session.setDefault('slot8', null);
Session.setDefault('slots', 0)
Template.csgo.events({
  'click .withdraw': function(e) {
    var bot = Session.get('botname');
    Meteor.call('withdraw', Meteor.user().profile.id, this.market_hash_name, Meteor.user()._id, this.id, this.price, this.game, Meteor.user().profile.tradelink, bot, function(err, result) {
      if (!err) {
        console.log(result);
        if (result == "not_enough_money") {
          return sweetAlert("", "Not enough money.", "warning");
        } else if (result == "not_exists") {
          return sweetAlert("", "Item already sold.", "warning");
        } else if (result == "withdraws_disabled") {
          return sweetAlert("Sorry", "Withdraws currently disabled.", "warning");
        } else {
          return sweetAlert("", "Trade offer has been sent", "success");
        }
      } else {
        return sweetAlert("", "Please try again later.", "warning");
      }
    });
  },
  'click .csgo': function() {
    return Router.go('/csgo');
  },
  'click .dota': function() {
    return Router.go('/dota');
  },
  'click .bot': function(e) {
    e.preventDefault();
    Withdrawlocal.remove({});
    return Session.set("botname", e.target.dataset.name);
  },
  'click .withdrawBtn': function(e) {
    e.preventDefault();
    var withdraws = Withdrawlocal.find().fetch();
    if (withdraws.length >= 6) {
      return sweetAlert('', 'You can withdraw only 6 items in one offer', 'warning');
    }
    var i = e.target.value;
    var item = Items.findOne({id: i});
    var settings = Settings.findOne();
    var discounts = settings.discounts.split(',');
    item.price = parseFloat(item.price);
    if (item.price >= parseInt(discounts[0]) && item.price < parseInt(discounts[1])) {
      item.price = item.price - (item.price / 100 * 20);
      item.discount = "20% off";
      console.log(item.price);
    } else if (item.price >= parseInt(discounts[1]) && item.price < parseInt(discounts[2])) {
      item.price = item.price - (item.price / 100 * 10);
      item.discount = "10% off"
      console.log(item.price);
    } else if (item.price >= parseInt(discounts[2])) {
      item.discount = "normal price"
    }
    Withdrawlocal.insert(item);
    var total = Session.get('total');
    var price = parseFloat(total) + item.price;
    Session.set('total', price);
    var elem = document.getElementById("" + item.id);
    document.getElementById("" + item.id).style.background = "green";
  },
  'click .removeBtn': function(e) {
    e.preventDefault();
    var item = Withdrawlocal.findOne({id: e.target.value});
    var total = Session.get('total') - item.price;
    Session.set('total', total);
    if (!item) return;
    document.getElementById("" + item.id).style.background = "#4D4D4D";
    Withdrawlocal.remove(item);
  },
  'click .createWithdrawOffer': function(e) {
    e.preventDefault();
    var items = Withdrawlocal.find().fetch();
    var total = [];
    _.each(items, function(item) {
      var obj = {
        appid: item.appid,
        contextid: 2,
        amount: 1,
        assetid: item.id,
        price: item.price,
        name: item.market_name,
        name_color: item.name_color,
        icon_url: item.icon_url,
        itemId: item.itemId
      }
      console.log(item._id);
      console.log(item._id._str);
      total.push(obj);
    });

    var botname = Session.get('botname');
    if (total.length > 8) {
      return sweetAlert('', 'You can trade 8 items max in every offer', 'error');
    }
    Meteor.call('withdraw', Meteor.user().profile.id, Meteor.user()._id, 'cs', Meteor.user().profile.tradelink, botname, total, function(err, result) {
      if (result == true) {
        Withdrawlocal.remove({});
        Session.set('total', 0);
        return sweetAlert('', 'Trade offer created', 'success');
      }
      if (err) {
        console.log(err)
      }
    });
  },
  'click .filterWitdrawItemsPriceLH': function(e) {
    e.preventDefault();
    return Session.set('sortWithdraws', 'LH');
  },
  'click .filterWitdrawItemsPriceHL': function(e) {
    e.preventDefault();
    return Session.set('sortWithdraws', 'HL');
  },
  'click .filterWitdrawItemsNameLH': function(e) {
    e.preventDefault();
    return Session.set('sortWithdraws', 'NameLH');
  },
  'click .filterWitdrawItemsNameHL': function(e) {
    e.preventDefault();
    return Session.set('sortWithdraws', 'NameHL');
  },
  'click .cancelOffer': function(e) {
    e.preventDefault();
    Meteor.call('cancelOffer', this._id, function(err, result) {
      if (err) {
        return console.log(err);
      }
    });
  }
});
Template.csgo.helpers({
  offerItems: function() {
    var items = Withdrawlocal.find({}).fetch();
    return items;
  },
  items: function() {
    var bot = Session.get('botname');
    var s = Session.get('sortWithdraws');
    var sortBy;
    var settings = Settings.findOne();
    var minWithdraw = parseInt(settings.minWithdraw);
    if (s === 'HL') {
      sortBy = {sort: {price: -1}};
    } else if (s === "LH") {
      sortBy = {sort: {price: 1}};
    } else if (s === 'NameLH') {
      sortBy = {sort: {name: 1}};
    } else if (s === 'NameHL') {
      sortBy = {sort: {name: -1}};
    }

    var e = Items.find({game: "cs", botname: bot, sold: {$ne: true}, price: {$gt: minWithdraw}}, sortBy).fetch();
    if (e) {
      return e;
    }
  },
  bots: function() {
    var settings = Settings.findOne();
    var bots = settings.bots.split(',');
    return bots;
  },
  minimalPrice: function() {
    var settings = Settings.findOne();
    return settings.minimal_price;
  },
  currentBot: function() {
    return Session.get('botname');
  },
  getItemsInGroupsOfThree: function(array) {
    var result = [];
    var currentResultIndex = 0;
    for( var i = 0; i < array.length; i++ ) {
      if( i % 6 === 0 ) {
        if( i !== 0 ) currentResultIndex++;
        result.push({ items: [ array[i] ] });
      } else {
        result[ currentResultIndex ].items.push( array[i] );
      }
    }
    return result;
  },
  offerGroup: function(array) {
    var result = [];
    var currentResultIndex = 0;
    for( var i = 0; i < array.length; i++ ) {
      if( i % 3 === 0 ) {
        if( i !== 0 ) currentResultIndex++;
        result.push({ items: [ array[i] ] });
      } else {
        result[ currentResultIndex ].items.push( array[i] );
      }
    }
    return result;
  },
  total: function() {
    return Session.get('total');
  },
  currentWithdraws: function() {
    var withdraw = Withdraws.findOne({steamid: Meteor.user().profile.id, done: false, offertype: 'withdraw'});
    if (withdraw) {
      Session.set('currentOffer', withdraw._id);
      return withdraw;
    }
  }
});
