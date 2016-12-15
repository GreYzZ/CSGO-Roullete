Template.ref.events({
  'click .confirmAffilate': function(e) {
    e.preventDefault();
    console.log(this);
    /*
    if (Meteor.user().profile.promocode == this._code) {
      return console.log('self');
    }
    */
    Meteor.call('affilateUser', Meteor.user()._id, this.steamid, function(err, result) {
      if (result == true) {
        return Router.go('/profile');
      } else if (result == 'already_affilated') {
        return sweetAlert('You already affilated with this user');
      }
    });
  },
  'click .removeAffilate': function(e) {
    e.preventDefault();
    console.log(this);
    Meteor.call('removeAffilate', Meteor.user()._id, this.steamid, function(err, result) {
      if (result == true) {
        return sweetAlert("", "Success!", "success");
      }
    })
  }
});