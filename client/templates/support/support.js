Template.support.events({
  'submit #support': function(e) {
    e.preventDefault();
    var content = e.target.content.value;
    var email = e.target.email.value;
    var category = e.target.category.value;
    if (content == "") {
      return sweetAlert('', 'All fields are required', 'error');
    }
    if (email == "") {
      return sweetAlert('', 'All fields are required', 'error');
    }
    console.log(content);
    console.log(email);
    Meteor.call("createSupportTicket", Meteor.user()._id, content, email, category, function(err, result) {
      if (result == true) {
        e.target.content.value = "";
        e.target.email.value = "";
        return sweetAlert('', "We'll contact you soon", 'success');
      }
    })
  }
})