UI.registerHelper('getUsernameById', function(id) {
  var user = Meteor.users.findOne({_id: id});
  if (!user) return 'undefined';
  if (user && user.profile && user.profile.username) {
    return user.profile.username;
  }
});