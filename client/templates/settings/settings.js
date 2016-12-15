Template.settings.onRendered(function() {
  var e = Settings.findOne();
  if (e) {
    document.getElementById("botsnames").value = e.bots;
    document.getElementById("minimalPrice").value = e.minimal_price;
    document.getElementById("disableRoulette").value = e.roulette_active;
    document.getElementById("startBonus").value = e.start_bonus;
    document.getElementById("withdrawsStatus").value = e.withdraws_active;
    document.getElementById("partnerBonus").value = e.partner_bonus;
    document.getElementById("alert").value = e.alert;
    document.getElementById("betToChat").value = e.betToChat;
    document.getElementById("minWithdraw").value = e.minWithdraw;
    document.getElementById("discounts").value = e.discounts;
  }
});
Template.settings.events({
  'submit form': function(e, t) {
    e.preventDefault();
    /*
    var minimalPrice = e.target.minimalPrice.value;
    var disableRoulette = e.target.disableRoulette.value;
    var startBonus = e.target.startBonus.value;
    var withdrawsStatus = e.target.withdrawsStatus.value;
    var partnerBonus = e.target.partnerBonus.value;
    var bots = e.target.botsnames.value;
    var indexAlert = e.target.alert.value;
    var betToChat = e.target.betToChat.value;
    var minWithdraw = e.target.minWithdraw.value;
    var discount = e.target.discount.value;
    */
    const params = {
      minimalPrice: e.target.minimalPrice.value,
      rouletteStatus: e.target.disableRoulette.value,
      startBonus: e.target.startBonus.value,
      withdrawsStatus: e.target.withdrawsStatus.value,
      partnerBonus: e.target.partnerBonus.value,
      bots: e.target.botsnames.value,
      indexAlert: e.target.alert.value,
      betToChat: e.target.betToChat.value,
      minWithdraw: e.target.minWithdraw.value,
      discounts: e.target.discounts.value
    }
      Meteor.call('updateSettings', params, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          return sweetAlert("", "Updated!", "success");
        }
      });

  }
});

Template.settings.helpers({
  settings: function() {
    var e = Settings.findOne();
    if (e) {
      return e;
    }
  }
})
