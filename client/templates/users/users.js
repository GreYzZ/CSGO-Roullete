Session.setDefault('user', null);
Session.setDefault('banChatTarget', null);
Session.setDefault('sortUsersBy', 'HL');
Session.setDefault('showUsersOptions', 'all');
Template.users.helpers({
  users: function() {
    var q = Session.get('sortUsersBy');
    var e = Session.get('showUsersOptions');
    var sortBy;
    var showOpt;
    if (e === 'all') {
      showOpt = {};
    } else if (e === 'chatBanned') {
      showOpt = {"profile.chatBanned": true};
    } else if (e === 'globalBanned') {
      showOpt = {"profile.banned": true};
    } else if (e === 'defaultGroup') {
      showOpt = {"profile.group": "default"};
    } else if (e === 'moderator') {
      showOpt = {"profile.group": "moderator"};
    } else if (e === 'streamer') {
      showOpt = {"profile.group": "streamer"};
    } else if (e === 'admin') {
      showOpt = {"profile.group": "admin"};
    } else if (e === 'superadmin') {
      showOpt = {"profile.group": "superadmin"};
    } else {
      showOpt = {}
    }
    if (q === 'LH') {
      sortBy = {sort: {"profile.money": 1}};
    } else if (q === "HL") {
      sortBy = {sort: {"profile.money": -1}};
    } else {
      sortBy = {};
    }
    return Meteor.users.find(showOpt, sortBy);
  },
  user: function() {
    return Session.get('user');
  },
  banTarget: function() {
    return Session.get('banChatTarget');
  }
});

Template.users.events({
  'click .removeAdmin': function(e) {
    e.preventDefault();
    console.log(this);
    Meteor.call('removeFromGroup', this._id, function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "User removed from admin group", "success");
        }
      }
    })
  },
  'click .removeStreamer': function(e) {
    e.preventDefault();
    console.log(this);
    Meteor.call('removeFromGroup', this._id, function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "User removed from streamer group", "success");
        }
      }
    })
  },
  'click .removeModerator': function(e) {
    e.preventDefault();
    console.log(this);
    Meteor.call('removeFromGroup', this._id, function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "User removed from moderator group", "success");
        }
      }
    })
  },
  'click .removeSuperAdmin': function(e) {
    e.preventDefault();
    console.log(this);
    Meteor.call('removeFromGroup', this._id, function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "User removed from super admin group", "success");
        }
      }
    })
  },
  'click .giveAdmin': function(e) {
    e.preventDefault();
    Meteor.call('addToGroup', this._id, 'admin', function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "User now have admin permissions", "success");
        }
      }
    });
  },
  'click .giveStreamer': function(e) {
    e.preventDefault();
    Meteor.call('addToGroup', this._id, 'streamer', function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "User now have streamer permissions", "success");
        }
      }
    });
  },
  'click .giveModerator': function(e) {
    e.preventDefault();
    Meteor.call('addToGroup', this._id, 'moderator', function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "User now have moderator permissions", "success");
        }
      }
    });
  },
  'click .giveSuperAdmin': function(e) {
    e.preventDefault();
    Meteor.call('addToGroup', this._id, 'superadmin', function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "User now have superadmin permissions", "success");
        }
      }
    });
  },
  'click .giveCoins': function(e) {
    e.preventDefault();
    Meteor.call('giveCoins', this._id);
  },
  'submit #findUser': function(e) {
    e.preventDefault();
    var userSteamId = e.target.steamid.value;
    Meteor.call('finduserBySteamId', userSteamId, function(err, result) {
      if (!err) {
        Session.set('user', result)
      }
      if (err) console.log(err);
      if (result === "cant_find_user") {
        return sweetAlert("", "Cant find user, check steam id", "error");
      }
    });
  },
  'submit #changeBalance': function(e) {
    e.preventDefault();
    var balance = e.target.balance.value;
    return Meteor.call('changeUserBalance', this._id, balance, function(err, result) {
      if (err) return console.log(err);
      if (result) {
        return sweetAlert("", "Done", "success");
      }
    });
  },
  'click .sortByBalanceLH': function(e) {
    e.preventDefault();
    return Session.set('sortUsersBy', 'LH');
  },
  'click .sortByBalanceHL': function(e) {
    e.preventDefault();
    return Session.set('sortUsersBy', 'HL');
  },
  'click .showAllUsers': function(e) {
    e.preventDefault();
    return Session.set('showUsersOptions', 'all');
  },
  'click .showUsersWithChatBan': function(e) {
    e.preventDefault();
    return Session.set('showUsersOptions', 'chatBanned');
  },
  'click .showUsersWithGlobalBan': function(e) {
    e.preventDefault();
    return Session.set('showUsersOptions', 'globalBanned');
  },
  'click .showUsersDefaultGroup': function(e) {
    e.preventDefault();
    return Session.set('showUsersOptions', 'defaultGroup');
  },
  'click .showUsersModeratorGroup': function(e) {
    e.preventDefault();
    return Session.set('showUsersOptions', 'moderator');
  },
  'click .showUsersStreamerGroup': function(e) {
    e.preventDefault();
    return Session.set('showUsersOptions', 'streamer');
  },
  'click .showUsersAdminGroup': function(e) {
    e.preventDefault();
    return Session.set('showUsersOptions', 'admin');
  },
  'click .showUsersSuperAdminGroup': function(e) {
    e.preventDefault();
    return Session.set('showUsersOptions', 'superadmin');
  },
  'click .openBanChatDialog': function(e) {
    e.preventDefault();
    var user = Meteor.users.findOne({_id: this._id});
    if (!user) return;
    Session.set('banChatTarget', user);
    setTimeout(function() {
      this.$('.datetimepicker').datetimepicker({
        format : 'DD.MM.YYYY HH:mm'
      });
    }, 2000);
  },
  'click .applyChatBan': function(e) {
    e.preventDefault();
    var user = Session.get('banChatTarget');
    if (!user) return;
    var banDate = $('#bandate').val();
    var mydate = new Date(banDate);
    console.log(mydate);
    console.log(banDate);
    Meteor.call('banChat', this._id, function(err, result) {
      if (!err) {
        if (result == true) {

          sweetAlert("Success!", "Good job, mate!", "success");
          $('#banChatModal').modal('hide');
        }
      }
    });
  },
  'click .removeChatBan': function(e) {
    return Meteor.call('unbanChat', this._id, function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "", "success");
        }
      }
    });
  },
  'click .applyBan': function(e) {
    return Meteor.call('banSite', this._id, function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "Good job, mate!", "success");
        }
      }
    });
  },
  'click .removeBan': function(e) {
    return Meteor.call('unbanSite', this._id, function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "Good job, mate!", "success");
        }
      }
    });
  }
});
