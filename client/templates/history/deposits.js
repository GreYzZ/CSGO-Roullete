Session.setDefault('deposit', null)
Template.depositHistoryAdmin.helpers({
  items: function() {
    return Withdraws.find({offertype: 'income'}, {sort: {date: -1}});
  },
  deposit: function() {
    var deposit = Session.get('deposit');
    if (deposit != null) {
      return deposit;
    }
  }
});

Template.depositHistoryAdmin.events({
  'submit #findDeposit': function(e) {
    e.preventDefault();
    var depositId = e.target.depositid.value;
    console.log(depositId);
    Meteor.call('findDepositById', depositId, function(err, result) {
      if (!err) {
        Session.set('deposit', result)
      }
      if (err) console.log(err);
    });
  },
  'click .cancelOffer': function(e) {
    e.preventDefault();
    let deposit = Session.get('deposit')
    if (deposit && deposit._id == this._id) {
      Session.set('deposit', null);
    }
    Meteor.call('cancelOffer', this._id, function(err, result) {
      if (err) {
        return console.log(err);
      }
      return sweetAlert('', 'Done!', 'success');
    });
  }
});
