Session.setDefault('alreadyBet', false);
Session.setDefault("result", 0);
Session.setDefault('betAmount', 0);
Session.setDefault("sound", false);
Session.setDefault('spinning', false);
Session.setDefault('applied', false);
Session.setDefault('betCount', 0);

Template.index.events({
  'click .clear': function(e) {
    e.preventDefault();
    if (!Meteor.user()) {
      return;
    }
    var alreadyBet = Session.get('alreadyBet');
    if (alreadyBet == true) {
      Meteor.call('clearBet', Meteor.user()._id, function(err, result) {
        if (err) {
          return console.log(err);
        }
        if (result == 'already_started') {
          return sweetAlert('', 'Game already started', )
        }
        Session.set('alreadyBet', false);
        Session.set('applied', false);
        Session.set('betAmount', 0);
      })
    }
  },
  'click .addmoney': function(e) {
    e.preventDefault();
    Meteor.call('addMoney', Meteor.user()._id, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        return sweetAlert('', 'Done.', 'success');
      }
    })
  },
  'click .bet100': function(e) {
    e.preventDefault();
    if (Session.get('betCount') >= 3) {
      return;
    }
    var amount = Session.get('betAmount') + 100;
    Session.set('betAmount', amount);
  },
  'click .bet500': function(e) {
    e.preventDefault();
    if (Session.get('betCount') >= 3) {
      return;
    }
    var amount = Session.get('betAmount') + 500;
    Session.set('betAmount', amount);
  },
  'click .bet1000': function(e) {
    e.preventDefault();
    if (Session.get('betCount') >= 3) {
      return;
    }
    var amount = Session.get('betAmount') + 1000;
    Session.set('betAmount', amount);
  },
  'click .bet10000': function(e) {
    e.preventDefault();
    if (Session.get('betCount') >= 3) {
      return;
    }
    var amount = Session.get('betAmount') + 10000;
    Session.set('betAmount', amount);
  },
  'click .betsemi': function(e) {
    e.preventDefault();
    if (Session.get('betCount') >= 3) {
      return;
    }
    var bet = Meteor.user().profile.money / 2;
    Session.set('betAmount', bet);
  },
  'click .betfull': function(e) {
    e.preventDefault();
    if (Session.get('alreadyBet') == true) {
      return;
    }
    Session.set('betAmount', Meteor.user().profile.money);
  }
});


Template.amountButtons.helpers({
  currentBet: function() {
    return Session.get('betAmount');
  },
  applied: function() {
    return Session.get('applied');
  },
  currentBetsCount: function() {
    return Session.get('betCount');
  }
});

Template.amountButtons.events({
  'click .clearbet': function() {
    return Session.set('betAmount', 0);
  }
})


Template.index.helpers({
  indexAlert: function() {
    var settings = Settings.findOne();
    if (settings) {
      return settings.alert
    }
  },
  usersOnline: function() {
    return Meteor.users.find({"status.online": true}).count();
  },
  result: function() {
    var e = Session.get("result")
    return Session.get("result")
  },
  handleGame: function() {
    var game = Games.findOne({started: true, finished: false});

    if (game) {

      Session.set('spinning', true);
      resetDraw();
      if ([1,2,3,4,5,6,7].indexOf(game) > -1) {
        Session.set('result', 'terrorists, ' + game)
      } else if ([8,9,10,11,12,13,14].indexOf(game) > -1) {
        Session.set('result', 'ct, ' + game)
      } else if (game.result == 0){
        Session.set('result', 'booom');
        var bombSound = new Audio('bomb sound effect.mp3');
        setTimeout(function() {
          if (Session.get("sound") != false) {
            bombSound.play();
          }
        }, 10000)
      }
      spin(game.result);
      setTimeout(function() {
        Session.set('spinning', false);
        Session.set('alreadyBet', false);
        Session.set('applied', false);
        Session.set('betAmount', 0);
        Session.set('betCount', 0);
        progressBarStart();
      }, 10000)
    }
  },
  nextGameTime: function() {
    var game = Games.findOne({started: false, finished: false});
    if (game && Session.get('spinning') != true) {
      return game.date;
    }
  },
  timer: function() {
    return Session.get("time");
  },
  bets: function() {
    var game = Games.findOne({started: false, finished: false, opened: true});
    if (game) {
      return 'Bets opened!';
    } else {
      return 'Bets closed!';
    }
  }
});
function spin(num) {
  var rollingSound = new Audio('rolling sound.mp3');
  var finishedSound = new Audio('t and ct sound effect.mp3');
  if (Session.get("sound") != false) {
    rollingSound.play();
  }
    var res = num;
    if(num > 14) {
    num = num % 14;
    }
    offset = 0;
    oldnum = num;
    if(oldnum > 4) {
      offset = 75;
    }
    if(oldnum > 7) {
      offset=0;
    }
    if(oldnum > 8) {
      num = 16-oldnum;
    }
    if(oldnum > 11) {
      offset = -75;
    }
    if(oldnum == 0) {
      num = 12;
    }

    var x = -(6602 + (num * 150) + (Math.random() * 60) + offset) + $(".bg").width() / 2;
    $(".bg").transition({"background-position": x + "px 0px"}, 10000,"cubic-bezier(0, .84,.11,.99)");
    setTimeout(function() {
      Session.set("userTBets", 0);
      Session.set("userCTBets", 0);
      Session.set("userBombBets", 0);
      if (res !== 0) {
        if (Session.get("sound") != false) {
          finishedSound.play();
        }
      }
    }, 10000)
}
function resetDraw() {
  $(".bg").css({"background-position": $(".bg").width() / 2 + "px 0px"});
}

var clock = 10;
var timeleft = function() {
  if (clock > 0) {
    clock --;
    Session.set('time', clock);
  } else {
    return Meteor.clearInteval(interval);
  }
}

function progressBarStart(id, duration, callback) {
$("#progressbar").progressTimer({
    timeLimit: 49,
    warningThreshold: 10,
    baseStyle: 'progress-bar-info',
    warningStyle: 'progress-bar-warning',
    completeStyle: 'progress-bar-danger',
    onFinish: function() {

    }
});
}

Tracker.autorun(function() {
  var game = Games.findOne({started: false, finished: false});
  if (game) {
    if (game.started == true) {
      console.log("game started");
    }
  }
});
