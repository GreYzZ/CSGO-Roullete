function updateUserProfile(user, query, callback) {
  if (!user || !query) return;
  try {
    Meteor.users.update(user, query);
    return callback(true);
  } catch (err) {
    console.log(err);
    return callback(err);
  }

}

Meteor.methods({
  cancelOffer: function(offerId) {
    const offer = Withdraws.findOne({_id: offerId});
    if (!offer) return;
    if (offer.offertype === 'withdraw') {
      console.log(offer.items);
      _.each(offer.items, function(item) {
        console.log(item.itemId);
        Items.update({itemId: item.itemId}, {$set: {sold: false}});
      });
      const user = Meteor.users.findOne({"profile.id": offer.steamid});
      if (user) {
        const currentBalance = parseInt(user.profile.money);
        const balance = currentBalance + parseInt(offer.price);
        const query = {$set: {"profile.money": balance}};
        updateUserProfile(user, query, function(done) {
          try {
            Withdraws.remove(offerId);
          } catch (err) {
            throw new Meteor.Error(err);
          }
        });
      }
    } else {
      try {
        Withdraws.remove(offerId);
      } catch (err) {
        throw new Meteor.Error(err);
      }
    }


  },
  updateSteamProfile: function(steamid) {
    var getUsername = Meteor.http.call("GET",
  "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=218B787F6803A6648607457FF95DF158&steamids=" + steamid);
    if (getUsername.data.response.players[0]) {
      var userSteamName = getUsername.data.response.players[0].personaname;
      var userAvatar = getUsername.data.response.players[0].avatar;
      var user = Meteor.users.findOne({"profile.id": steamid});
      var query = {$set: {"profile.username": userSteamName, "profile.avatar": userAvatar}};
      if (user) {
        var updateUser = updateUserProfile(user, query, function(result) {
          if (result == true) {
            console.log(result);
            return true;
          } else {
            return false;
          }
        });
        if (updateUser == true) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  sendCoins: function(userId, steamid, amount) {
    if (typeof amount != 'number') return;
    if (amount == "") return;
    if (isNaN(amount)) return;
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return console.log("cant_find_user");
    var user2 = Meteor.users.findOne({"profile.id": steamid});
    if (!user2) return "cant_find_second_user";

    if (user.profile.money < amount) {
      return 'not_enough_money';
    }
    if (user._id == user2._id) {
      return 'self_account';
    }
    var userMoney = user.profile.money - amount;
    var user2Money = user2.profile.money + amount;
    if (!userMoney || !user2Money) return;
    Meteor.users.update(user, {$set: {"profile.money": userMoney}});
    Meteor.users.update(user2, {$set: {"profile.money": user2Money}});
    var q = {
      senderId: user._id,
      senderSteamId: user.profile.id,
      recepientSteamId: user2.profile.id,
      recepientId: user2._id,
      amount: amount,
      status: 'Done',
      date: new Date()
    };
    CoinsTransfers.insert(q);
    return true;
  },
  giveCoins: function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return console.log("cant_find_user");
    var userBalance = parseFloat(user.profile.money) + 100;
    Meteor.users.update(user, {$set: {"profile.money": userBalance}});
  },
  applyTradeLink: function(userId, code) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return "cant_find_user";
    Meteor.users.update(user, {$set: {"profile.tradelink": code}});
    return true;
  },
  banChat: function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return "cant_find_user";
    Meteor.users.update(user, {$set: {"profile.chatBanned": true}});
    return true;
  },
  unbanChat: function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return "cant_find_user";
    Meteor.users.update(user, {$set: {"profile.chatBanned": false}});
    return true;
  },
  banSite: function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return "cant_find_user";
    Meteor.users.update(user, {$set: {"profile.banned": true}});
    return true;
  },
  unbanSite: function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return "cant_find_user";
    Meteor.users.update(user, {$set: {"profile.banned": false}});
    return true;
  },
  removeFromGroup: function(userId) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return "cant_find_user";
    Meteor.users.update(user, {$set: {"profile.group": "default"}});
    return true;
  },
  addToGroup: function(userId, group) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return "cant_find_user";
    Meteor.users.update(user, {$set: {"profile.group": group}});
    return true;
  },
  applyPromocode: function(userId, code) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) {
      return 'user_not_found';
    }
    if (user.profile.promocode == code) {
      return 'self_promo';
    }
    var partner = Meteor.users.findOne({"profile.promocode": code});
    if (!partner) {
      return "code_not_found";
    }
    var settings = Settings.findOne();
    if (!settings) {
      return 'cant_get_settings';
    }
    var bonus = parseFloat(settings.partner_bonus);
    var userBalance = parseFloat(user.profile.money + bonus);
    var partnerBalance = parseFloat(user.profile.money + bonus);
    Meteor.users.update(user, {$set: {"profile.money": userBalance, "profile.promocode_activated": true}});
    Meteor.users.update(partner, {$set: {"profile.money": partnerBalance}});
    return true;
  },
  getLoginStatus: function(userId) {
    var settings = Settings.findOne();
    if (!settings) return console.log('cant get settings[checking login status]');
    var user = Meteor.users.findOne({_id: userId});
    if (settings.registration_opened == true && user != undefined) {
      return true;
    } else {
      return false;
    }
  },
  addMoney: function(userId) {
    var user = getUser(userId, function(user) {
      if (!user) {
        return;
      }
      return user;
    })
    if (user && user.profile) {
      var money = user.profile.money + 16000;
      try {
        Meteor.users.update(user, {$set: {"profile.money": money}});
        return true;
      } catch (err) {
        throw new Meteor.Error(err);
      }
    }
  },
  userUpdate: function(userId) {
     var user = getUser(userId, function(user) {
      if (!user) {
        return;
      }
      return user;
     });
     if (user && user.profile && user.profile.id) {
        getUsername(user.profile.id, function(result) {
          if (!result) return;
          try {
            console.log(result.username);
            console.log(result.avatar);
            Meteor.users.update(user, {$set: {"profile.username": result.username, "profile.avatar": result.avatar}});
            return true;
          } catch (err) {
            return;
          }
        });
     }
  },
  updateUserInventory: function(userId) {
    var user = getUser(userId, function(user) {
      if (!user) return;
      return user;
    });
    if (!user || !user.profile) {
      return;
    }
    var userItems = Meteor.http.call("GET", "http://steamcommunity.com/profiles/" + user.profile.id +"/inventory/json/730/2");
    if (userItems) {
      if (userItems.data.Error == "This profile is private.") {
        return "profile_private";
      }
      Meteor.users.update(user, {$set: {"profile.items": userItems.data.rgDescriptions}});
      console.log(userItems.data);
      return true;
    }
  },
  updateUser: function(user) {
    this.unblock();
    Userupdates.insert(user);
    return true;
  },
  getApiPrices: function() {
    var prices = Meteor.http.call("GET", "http://backpack.tf/api/IGetMarketPrices/v1/?key=56d0076fba8d88bd0af41735");
    if (prices) {
      Prices.insert(prices);
    }
  },
  createDepositOffer: function(items, userid, steamid, price, game, code, tradelink, botname) {
    var appid;
    if (game == 'csgo') {
      appid = 730;
    } else if (game == 'dota') {
      appid = 570;
    }
    var findAnotherOffers = Withdraws.find({steamid: steamid, done: false}).fetch();
    if (findAnotherOffers.length > 0) {
      return "exists"
    }
    var offertype = 'income';
    //console.log(items);
    Withdraws.insert({date: new Date(), done: false, items: items, steamid: steamid, price: price, game: game, status: 'waiting', offertype: offertype, code: code, tradelink: tradelink, bot: botname});
    console.log('ok');
  },
  withdraw: function(steamid, userid,  game, tradelink, botname, items) {
    var settings = Settings.findOne();
    if (!settings) return;
    if (settings.withdraws_active == "false") {
      return 'withdraws_disabled';
    }
    var totalPrice = 0;
    _.each(items, function(item) {
      totalPrice += item.price;
    });
    var check = Meteor.users.findOne({_id: userid});
    if (check != undefined) {
      if (check.profile.money >= totalPrice) {
        var offertype = 'withdraw';
        Withdraws.insert({steamid: steamid, done: false, price: totalPrice, userid: userid, game: game, status: 'waiting', offertype: offertype, tradelink: tradelink, bot: botname, items: items});
        var user = Meteor.users.findOne({_id: userid});
        var old = user.profile.money;
        var newm = user.profile.money - totalPrice;
        Meteor.users.update(user, {$set: {"profile.money": newm}});
        _.each(items, function(u) {
          var i = Items.findOne({id: u.assetid});
          if (i) {
            Items.update(i, {$set: {sold: true}});
            console.log("sold");
          }
        });
        return true;
      } else {
        console.log("not_enough_money")
        return "not_enough_money";
      }
    }

  }
});

function getUser(userid, callback) {
  var user = Meteor.users.findOne({_id: userid});
  if (user) {
    return callback(user);
  } else {
    return;
  }
}

function getUsername(steamid, callback) {
  var getUsername = Meteor.http.call("GET",
    "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=218B787F6803A6648607457FF95DF158&steamids=" + steamid);
  var username = getUsername.data.response.players[0].personaname;
  var userAvatar = getUsername.data.response.players[0].avatar;
  if (!username || !userAvatar) {
    return callback(undefined);
  }
  var result = {
    username: username,
    avatar: userAvatar
  }
  return callback(result);

}

Accounts.onCreateUser(function (options, user) {
  var r =  Math.random().toString(36).substring(7);
  var sId = options.profile.id;
  user.roles = [];
  var getUsername = Meteor.http.call("GET",
  "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=218B787F6803A6648607457FF95DF158&steamids=" + sId);
  var userSteamName = getUsername.data.response.players[0].personaname;
  var userAvatar = getUsername.data.response.players[0].avatar;
  try {
    Promocodes.insert({
      sender: user._id,
      promocode: r
    });

  } catch (err) {
    throw new Meteor.Error('error when inserting user promocode');
  }
  var settings = Settings.findOne();
  if (!settings) return;

  var startMoney = settings.start_bonus;
  if (options.profile)
    var role = 'default';
    user.roles = role;
    user.profile = options.profile;
    user.profile.money = startMoney;
    user.profile.promocode = null;
    user.profile.group = "default";
    user.profile.username = userSteamName;
    user.profile.avatar = userAvatar;
    user.profile.banned = false;
    user.profile.chatBanned = false;
    user.profile.affilates = [];
    user.profile.affilated = false;
    user.profile.totalAffilateBonus = 0;
    user.profile.deposited = false;
    user.profile.availableBonus = 0;
    user.profile.totalBets = 0;
    user.profile.totalWins = 0;
    //user.profile.csgo = csGo;
    //user.profile.username = o;
  return user;
});
