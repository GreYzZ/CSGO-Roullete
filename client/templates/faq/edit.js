Template.editfaq.helpers({
  faq: function() {
    var s = Settings.findOne();
    if (s) {
      console.log('..');
      return s.faqText;
    }
  }
});
Template.editfaq.events({
  'submit #editFaq': function(e) {
    e.preventDefault();
    console.log(e.target.summernote.value);
    var text = e.target.summernote.value;
    return Meteor.call('editFaq', text, Meteor.user()._id, function(err, result) {
      if (err) {
        console.log(err);
        return sweetAlert('','Error, try again later', 'error');
      }
      return sweetAlert('', 'Saved', 'success');
    })

  }
})
/*
Template.editfaq.rendered = function() {
  $('#fr-view').froalaEditor();
}
*/