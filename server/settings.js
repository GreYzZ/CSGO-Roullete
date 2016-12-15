Meteor.startup(function() {
  const e = Settings.find().count();
  if (e == 0) {
    const opt = {
      roulette_active: true,
      withdraws_active: true,
      start_bonus: 0,
      minimal_price: 0,
      partner_bonus: 0,
      bots: [],
      alert: 'welcome',
      faqText: ['Faq text here. You can edit this in admin panel!'],
      tosText: ['Terms of conditions text here, you can edit it in admin panel!'],
      betToChat: 0,
      minWithdraw: 0,
      discounts: []
    }
    Settings.insert(opt);
  }
});

Meteor.methods({
  updateSettings: function(params) {
    const e = Settings.findOne();
    if (e) {
      Settings.update(e, {$set: {
        minimal_price: params.minimalPrice,
        roulette_active: params.rouletteStatus,
        withdraws_active: params.withdrawsStatus,
        start_bonus: params.startBonus,
        partner_bonus: params.partnerBonus,
        bots: params.bots,
        alert: params.indexAlert,
        betToChat: params.betToChat,
        minWithdraw: params.minWithdraw,
        discounts: params.discounts
      }});
      return true
    }
  }
});
