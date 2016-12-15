Template.prices.helpers({
  prices: function() {
    return Prices.find({});
  }
});

Template.prices.events({
  'submit #changePrice': function(e) {
    e.preventDefault();
    var price = e.target.price.value;
    return Meteor.call('changeItemPrice', this.name, price, function(err, result) {
      if (err) return console.log(err);
      if (result) {
        return sweetAlert("", "Done", "success");
      }
    });
  }
});