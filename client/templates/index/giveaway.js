Template.giveaway.helpers({
  giveaway: function() {
    var giveaway = Giveaways.findOne();
    if (giveaway) {
      return giveaway;
    }
  }
});
