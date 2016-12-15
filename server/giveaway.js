Meteor.methods({
  updateGiveaway: function(title, description, image, link) {
    var giveawayCount = Giveaways.find().count();
    if (giveawayCount > 0) {
      return "already_exists";
    }
    Giveaways.insert({
      title: title,
      description: description,
      image: image,
      date: new Date(),
      link: link
    });
    return true;
  },
  removeGiveaway: function() {
    var g = Giveaways.findOne();
    if (!g) return;
    Giveaways.remove(g);
    return true;
  }
})
//https://embed.gyazo.com/160cc5b83500051ba5f31a4e9148d15f.png
