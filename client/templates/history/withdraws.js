Session.setDefault('withdraw', null)
Template.withdrawsHistoryAdmin.helpers({
  items: function() {
    return Withdraws.find({offertype: 'withdraw'});
  },
  withdraw: function() {
    var withdraw = Session.get('withdraw');
    if (withdraw != null) {
      return withdraw;
    }
  }
});

Template.withdrawsHistoryAdmin.events({
  'submit #findWithdraw': function(e) {
    e.preventDefault();
    var withdrawId = e.target.withdrawid.value;
    Meteor.call('findWithdrawById', withdrawId, function(err, result) {
      if (!err) {
        Session.set('withdraw', result)
      }
    });
  },
  'click .cancelOffer': function(e) {
    e.preventDefault();
    let withdraw = Session.get('withdraw')
    if (withdraw && withdraw._id == this._id) {
      Session.set('withdraw', null);
    }
    Meteor.call('cancelOffer', this._id, function(err, result) {
      if (err) {
        return console.log(err);
      }
      return sweetAlert('', 'Done!', 'success');
    });
  }
});
