Session.setDefault('round', null)
Template.roundHistory.helpers({
  items: function() {
    return AllGamesHistory.find({});
  },
  round: function() {
    var round = Session.get('round');
    if (round != null) {
      return round;
    }
  },
  betsDetails: function() {
    var round = Session.get('round');
    if (round != null) {
      return round.bets;
    }
  }
});

Template.roundHistory.events({
  'submit #findRound': function(e) {
    e.preventDefault();
    var roundId = e.target.roundid.value;
    Meteor.call('findRoundById', roundId, function(err, result) {
      if (!err) {
        Session.set('round', result)
      }
    });
  }
});