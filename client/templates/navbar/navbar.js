Template.navbar.events({
  'click .login': function(e) {
    e.preventDefault();
    console.log('login');
    Meteor.loginWithSteam();
  },
  'click .logout': function(e) {
    e.preventDefault();
    Meteor.logout();
    return Router.go('/');
  }
})
