Router.configure({
  loadingTemplate: 'loading',
  layoutTemplate: 'layout',
  notFoundTemplate: "notFound"
});

Router.before(function() {
  if (Meteor.loggingIn()) {
    this.render(this.loadingTemplate);
    this.stop();
  } else {
    this.next();
  }
});

function isLoggedIn() {
  if (!Meteor.userId()) {
    this.render('index');
  } else {
    this.next();
  }
}
function isBanned() {
  if (!Meteor.userId()) {
    this.next();
  } else {
    if (Meteor.user().profile.banned === true) {
      this.render('banPage');
    } else {
      this.next();
    }
  }
}
Router.onBeforeAction(isLoggedIn, {
  except: ['index']
});

Router.onBeforeAction(isBanned);
//{'faqText': 1}
//publicSettings
Router.map(function() {
  this.route('index', {
    path: '/',
    waitOn: function() {
      return [
      Meteor.subscribe('indexAlert'),
      Meteor.subscribe('results'),
      Meteor.subscribe('userStatus'),
      Meteor.subscribe('messages', Session.get('chatRoom')),
      Meteor.subscribe('games'),
      Meteor.subscribe('publicSettings', {'betToChat': 1}),
      Meteor.subscribe('giveaways')
      ]
    }
  });
  this.route('deposit', {
    path: '/deposit',
    waitOn: function() {
      return [
        Meteor.subscribe('publicSettings', {'bots': 1, 'minWithdraw': 1, 'discounts': 1, 'minimal_price': 1}),
        Meteor.subscribe('currentOffers', Meteor.user().profile.id, 'income')
      ];
    }
  });
  this.route('profile', {
    path: '/profile',
    waitOn: function() {
      return [
        Meteor.subscribe('profileSettings'),
        Meteor.subscribe('withdrawsHistory', Meteor.user().profile.id),
        Meteor.subscribe('gameHistory', Meteor.user()._id)
      ];
    }
  });
  this.route('withdrawsHistoryFull', {
    path: '/h/withdraws',
    waitOn: function() {
      return Meteor.subscribe('withdrawsHistory', Meteor.user().profile.id);
    }
  });
  this.route('betsHistoryFull', {
    path: '/h/bets',
    waitOn: function() {
      return Meteor.subscribe('gameHistory', Meteor.user()._id);
    }
  });
  this.route('settings', {
    path: '/settings',
    waitOn: function() {
      return Meteor.subscribe('settings', Meteor.userId());
    }
  });
  this.route('users', {
    path: '/users',
    waitOn: function() {
      return Meteor.subscribe('usersAdmin', Meteor.userId());
    }
  });
  this.route('csgo', {
    path: '/csgo',
    waitOn: function() {
      return [
        Meteor.subscribe('items'),
        Meteor.subscribe('publicSettings', {'bots': 1, 'minWithdraw': 1, 'discounts': 1}),
        Meteor.subscribe('currentOffers', Meteor.user().profile.id, 'withdraw')
      ]
    }
  });
  this.route('support', {
    path: 'support'
  });
  this.route('tickets', {
    path: 'tickets',
    waitOn: function() {
      return [
      Meteor.subscribe('tickets', Meteor.userId()),
      Meteor.subscribe('usersAdmin', Meteor.userId())
      ];
    }
  });
  this.route('faq', {
    path: 'faq',
    waitOn: function() {
      return Meteor.subscribe('faq');
    }
  });
  this.route('tos', {
    path: 'tos'
  });
  this.route('ref', {
    path: '/ref/:code',
    waitOn: function() {
      return Meteor.subscribe('users');
    },
    onRun: function() {
      var params = this.params;
      console.log(params.code);
      this.next();
    },
    data: function() {
      var params = this.params;
      var user = Meteor.users.findOne({"profile.promocode": params.code});
      if (!user) {
        return {
          error: "Can't find user"
        };
      }
      if (Meteor.user().profile.promocode == params.code) {
        return {
          error: "You cannot use your own link."
        }
      }
      if (Meteor.user().profile.affilated == true) {
        var errText = "You have already affiliated with " + user.profile.username;
        return {
          error: errText,
          steamid: user.profile.id
        }
      }
      return {
        code_: params.code,
        username: user.profile.username,
        steamid: user.profile.id
      };
    }
  });
  this.route('affiliates', {
    path: '/affiliates'
  });
  this.route('coinsTransfersHistory', {
    path: '/h/coinstransfers',
    waitOn: function() {
      return [
        Meteor.subscribe('coinsTransfers', Meteor.user()._id),
        Meteor.subscribe('usersAdmin', Meteor.userId())
        ]
    }
  });

  this.route('roundHistory', {
    path: '/h/allgames',
    waitOn: function() {
      return Meteor.subscribe('adminGameHistory', Meteor.userId(), {sort: {date: -1}, limit: 200});
    }
  });
  this.route('withdrawsHistoryAdmin', {
    path: '/h/withdrawsadm',
    waitOn: function() {
      return Meteor.subscribe('adminWithdrawsHistory', Meteor.userId(), {sort: {date: -1}, limit: 200});
    }
  });
  this.route('depositHistoryAdmin', {
    path: '/h/depositsadm',
    waitOn: function() {
      return Meteor.subscribe('adminDepositHistory', Meteor.userId(), {sort: {date: -1}, limit: 200});
    }
  });
  this.route('editfaq', {
    path: '/e/faq',
    waitOn: function() {
      return Meteor.subscribe('settings', Meteor.userId());
    }
  });
  this.route('editGiveaway', {
    path: '/e/giveaway',
    waitOn: function() {
      return [
        Meteor.subscribe('settings', Meteor.userId()),
        Meteor.subscribe('giveaways')
      ]
    }
  });
  this.route('currentGiveaway', {
    path: '/giveaway',
    waitOn: function() {
      return [
        Meteor.subscribe('giveaways')
      ]
    }
  });
  this.route('prices', {
    path: '/e/prices',
    waitOn: function() {
      return [
        Meteor.subscribe('pricesAdmin', Meteor.userId())
      ]
    }
  });
});
