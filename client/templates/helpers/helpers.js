UI.registerHelper('betsClosed', function() {
  var game = Games.findOne({started: false, finished: false, opened: true});
  if (game) {
    return false;
  } else {
    return true;
  }
});
UI.registerHelper('superAdmin', function(userid) {
  var user = Meteor.users.findOne({_id: userid});
  if (user && user.profile.group == 'superadmin') {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('side', function(number) {
  var terr = [1,2,3,4,5,6,7];
  var ct = [8,9,10,11,12,13,14];
  var bomb = [0,15];
  if (terr.indexOf(number) > -1) {
      return "#BB3838";
    } else if (ct.indexOf(number) > -1) {
      return "#333333";
    } else if (bomb.indexOf(number) > -1){
      return "#36AC47";
    }
});
UI.registerHelper('historySide', function(side) {
  if (side == "terrorists") {
    return "#BB3838";
  } else if (side == "ct") {
    return "#333333";
  } else if (side == "bomb") {
    return "#36AC47";
  }
});
UI.registerHelper('userPic', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (!user) return; //console.log('cant find user')
  if (user && user.profile && user.profile.avatar) {
    return user.profile.avatar
  }
});
UI.registerHelper('toInt', function(num) {
  return +num;
});
UI.registerHelper('isSold', function(itemid) {
  var e = Items.findOne({id: itemid});
  if (e != undefined) {
    if (e.sold == true) {
      return true
    } else {
      return false
    }
  }
});
UI.registerHelper('notSold', function(itemid) {
  var e = Items.findOne({id: itemid});
  if (e != undefined) {
    if (e.sold == true) {
      return false
    } else {
      return true
    }
  }
});
UI.registerHelper('isSended', function(item) {
  if (item == "sended") {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('isAdmin', function() {
  if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.group == "admin" || Meteor.user() && Meteor.user().profile && Meteor.user().profile.group == "superadmin") {
    return true
  } else {
    return false
  }
})
UI.registerHelper('offersNotNull', function() {
  var e = Local.find().count();
  if (e > 0) {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('WithdrawOffersNotNull', function() {
  var e = Withdrawlocal.find().count();
  if (e > 0) {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('itemPrice', function(hashName) {
  var e = Prices.findOne({name: hashName});
  if (e) {
    return (parseFloat(e.median_price) * 1000);
  }
});
UI.registerHelper('isPriceNull', function(price) {
  console.log(price);
  if (price == undefined) {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('isColorDefault', function(color) {
  if (color == "D2D2D2") {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('formatToFloat', function(num) {
  return num.toFixed(1);
});
UI.registerHelper('grouped_each', function(every, context, options) {
    var out = "", subcontext = [], i;
    if (context && context.length > 0) {
        for (i = 0; i < context.length; i++) {
            if (i > 0 && i % every === 0) {
                out += options.fn(subcontext);
                subcontext = [];
            }
            subcontext.push(context[i]);
        }
        out += options.fn(subcontext);
    }
    return out;
});

UI.registerHelper('h_checkIndex', function(index) {
  if (index % 5 == 0) return true;
  else return false;
});

UI.registerHelper('promocodeActivated', function() {
    if (Meteor.user() && Meteor.user().profile) {
      if (Meteor.user().profile.promocode_activated == true) {
        console.log('promocode activated!');
        return true;
      } else {
        return null;
      }
    } else {
      return null;
    }
});
UI.registerHelper('currentUserGroupAdmin', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (!user) return;
  if (user.profile.group == "admin" || user.profile.group == "superadmin") {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('currentUserGroupStreamer', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (!user) return;
  if (user.profile.group == "streamer") {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('currentUserGroupSuperAdmin', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (!user) return;
  if (user.profile.group == "superadmin") {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('currentUserGroupModerator', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (!user) return;
  if (user.profile.group == "moderator") {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('currentUserGroupDefault', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (!user) return;
  if (user.profile.group == "default") {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('chatColor', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (!user) return;
  if (user.profile.group == "admin" || user.profile.group == "superadmin") {
    return "#FF5B2E";
  } else if (user.profile.group == "moderator") {
    return "#2E8FFF";
  } else if (user.profile.group == "streamer") {
    return "#00CF29";
  }
});

UI.registerHelper('canBan', function(userId) {
  if (Meteor.user()._id == userId) {
    return false;
  }
  if (Meteor.user() && Meteor.user().profile) {
    if (Meteor.user().profile.group == "admin" || Meteor.user().profile.group == "moderator" || Meteor.user().profile.group == "superadmin") {
      return true;
    } else {
      return false;
    }
  }
});
UI.registerHelper('chatBanned', function(userId) {
  var user = Meteor.users.findOne({_id: userId});
  if (!user) return;
  if (user.profile.chatBanned == "true") {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('chatPlaceholder', function() {
  if (!Meteor.user()) {
    return "Please login to send messages";
  }
  if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.chatBanned == true) {
    return "You have a chat ban, mate.";
  }
  var settings = Settings.findOne();
  if (parseInt(settings.betToChat) > 0) {
    if (parseInt(Meteor.user().profile.totalBets) > parseInt(settings.betToChat)) {
      return "Your message...";
    } else {
      var str = "Place at least " +  parseInt(settings.betToChat) + " coins to send messages";
      return str;
    }
  } else {
    return "Your message..."
  }

})
UI.registerHelper('isChatBanned', function() {
  if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.chatBanned == true) {
    var settings = Settings.findOne();
    if (settings.betToChat == true) {
      if (Meteor.user().profile.totalBets > 0) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  } else {
    return false;
  }
});

UI.registerHelper('tradeLinkApplyed', function() {
  if (Meteor.user() && Meteor.user().profile && Meteor.user().profile.tradelink) {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('priceSmaller', function(marketName) {
  var settings = Settings.findOne();
  var minPrice = settings.minimal_price;
  var itemPrice = Prices.findOne({name: marketName});
  if (parseFloat(itemPrice.median_price * 1000) < minPrice) {
    return true
  } else {
    return false;
  }
});
UI.registerHelper('clearOffer', function() {
  var offers = Local.find().fetch();
    if (offers.length > 0) {
      return true;
    } else {
      return false;
    }
});
UI.registerHelper('codesNotNull', function() {
  var codes = Codes.find().fetch();
  if (codes.length > 0) {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('inventoryEmpty', function() {
  var bot = Session.get('botname');
  var items = Items.find({botname: bot, sold: {$ne: true}}).fetch();
  if (items.length == 0) {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('isLengthNotNull', function(item) {
  if (item.length > 0) {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('lengthNull', function(arr) {
  if (arr.length == 0) {
    return true;
  } else {
    return false;
  }
});
UI.registerHelper('offerWaiting', function(status) {
  if (status == "waiting") {
    return true;
  } else {
    return false;
  }
})
