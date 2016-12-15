Template.faq.helpers({
  faq: function() {
    var settings = Settings.findOne();
    if (settings) {
      return settings.faqText
    }
  }
});
