Template.history.helpers({
  items: function() {
    var games = Games.find({calculated: true}, {sort: {date: -1}, limit: 10}).fetch();
    var rdy = _.sortBy(games, "date");
    return rdy;
  }
});