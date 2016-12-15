Template.editGiveaway.onRendered(function() {
  var e = Giveaways.findOne();
  if (e) {
    document.getElementById("title").value = e.title;
    document.getElementById("image").value = e.image;
    document.getElementById("description").value = e.description;
    document.getElementById("link").value = e.link;
  }
});

Template.editGiveaway.events({
  'submit form': function(e, t) {
    e.preventDefault();
    var title = e.target.title.value;
    var description = e.target.title.value;
    var image = e.target.image.value;
    var link = e.target.link.value;
    //var bots = JSON.parse("[" + e.target.botsnames.value + "]");
      Meteor.call('updateGiveaway', title, description, image, link, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result == true) {
            return sweetAlert("", "Updated!", "success");
          }

        }
      });
  },
  'click .removeGiveaway': function(e) {
    e.preventDefault();
    Meteor.call("removeGiveaway", function(e, r) {
      if (e) {
        return console.log(e);
      }
      if (r == true) {
        return sweetAlert('', 'Removed', 'success');
      }
    })
  }
});
