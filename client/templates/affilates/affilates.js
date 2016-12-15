Template.affiliates.helpers({
  affilates: function() {
    if (Meteor.user().profile.affilates.length > 0) {
      var aff = Meteor.user().profile.affilates;
      var arr = [];
      _.each(aff, function(item) {
        console.log(item.date);
        arr.push(item);
      });
      return arr;
    }
  }
});
Template.affiliates.events({
  'click .collectBonus': function(e) {
    e.preventDefault();
    Meteor.call('collectAffilateBonus', Meteor.user()._id, function(err, result) {
      if (result == true) {
        return sweetAlert("", "Success!", "success");
      } else if (result == "nothing_to_collect") {
        return sweetAlert('', "Nothing to collect", "error");
      }
    });
  },
  'submit #editPromocode': function(e, t) {
    e.preventDefault();
    var promocode = e.target.promocode.value;
    if (promocode == "") return;
    Meteor.call('editPromocode', Meteor.user()._id, promocode, function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "You have changed your referall link", "success");
        } else if (result == "already_in_use") {
          return sweetAlert("Sorry", "This code already in use", "error");
        }
      }
    });
  }
});
