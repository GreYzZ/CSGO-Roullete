Session.setDefault('total', 0);
Session.setDefault('depositGame', 'csgo');
Session.setDefault('botname', 'ghostxriiot_stoarge');
Template.deposit.events({
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
  'click .addToOffer': function(e) {
    e.preventDefault();
    var item = _.findWhere(Meteor.user().profile.csgo, {id: e.target.value});
    console.log(item);
    var settings = Settings.findOne();
    var discounts = settings.discounts.split(',');
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
    Local.insert(item);

    var total = Session.get('total');

    var price = total + item.price;
    Session.set('total', price);
  },
  'click .removeCodeMessage': function(e) {
    e.preventDefault();
    Codes.remove(this);
  },
  'click .removeFromOffer': function(e) {
    e.preventDefault();
    var total = Session.get('total');
    var price = total - this.price;
    Session.set('total', price);
    Local.remove(this);
  },
  'click .createOffer': function(e) {
    var getAppId = Session.get('depositGame');
    var gameid;
    if (getAppId = 'csgo') {
      gameid = 'csgo';
    } else if (getAppId = 'dota') {
      gameid = 'dota'
    }
    e.preventDefault();
    var code = Math.random().toString(10).substring(2);
    var items = Local.find().fetch();
    var total = [];
    var price = 0;
    _.each(items, function(item) {
      var obj = {
        appid: item.appid,
        contextid: 2,
        amount: 1,
        assetid: item.id,
        price: item.price,
        name: item.market_name
      }
      price += item.price;
      total.push(obj);
    });
    if (total.length > 8) {
      return sweetAlert('', 'You can trade 8 items max in every offer', 'error');
    }
    var botname = Session.get('botname');
    var tradelink = Meteor.user().profile.tradelink;
    Meteor.call('createDepositOffer', total, Meteor.user()._id, Meteor.user().profile.id, price.toFixed(2), gameid, code, tradelink, botname, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        Codes.insert({code: code, price: price});
        return sweetAlert("", "Trade offer has been created", "success");
      }
    });
    Local.remove({});
    Session.set('total', 0);

  },
  'click .csgoitems': function() {
    Local.remove({});
    Session.set('total', 0);
    return Session.set('depositGame', 'csgo');
  },
  'click .dotaitems': function() {
    Local.remove({});
    Session.set('total', 0);
    return Session.set('depositGame', 'dota');
  },
  'click .bot': function(e) {
    e.preventDefault();
    return Session.set("botname", e.target.dataset.name);
  },
  'click .clearOffer': function(e) {
    e.preventDefault();
    Local.remove({});
    Session.set('total', 0);
    return;
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
Template.deposit.helpers({
  items: function() {
    var e = Session.get('depositGame');
    var settings = Settings.findOne();
    var currentMinDeposit = settings.minimal_price;
    if (e == 'csgo') {
      var items = Meteor.user().profile.csgo;
      var total = [];
      _.each(items, function(item) {
        var price = item.price;
        if (!price) {
          return;
        }
        //item.price = parseFloat(price.median_price) * 1000;
        if (price >= parseFloat(currentMinDeposit)) {
          total.push(item);
        }
      });
      return total
    } else if (e == 'dota') {
      return Meteor.user().profile.dota;
    }
  },
  offerItems: function() {
    var items = Local.find({}).fetch();
    return items;

  },
  total: function() {
    var e = Session.get('total');
    return e;
  },
  codes: function() {
    var codes = Codes.find().fetch();
    return codes;
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
  currentDeposits: function() {
    var deposits = Withdraws.find({steamid: Meteor.user().profile.id, done: false, offertype: 'income'});
    if (deposits) {
      return deposits;
    }
  }
});
