Session.setDefault('show', 'inProgress');
Session.setDefault('category', 'all');

Template.tickets.helpers({
  items: function() {
    if (Session.get('show') == 'inProgress') {
      return Support.find({status: 'in_progress'});
    }
    if (Session.get('show') == 'all') {
      return Support.find();
    }
    if (Session.get('show') == 'resolved') {
      return Support.find({status: 'resolved'});
    }
  },
  problemResolved: function(id) {
    var ticket = Support.findOne({_id: id});
    if (!ticket) return;
    if (ticket.status == "resolved") {
      return true;
    } else {
      return false;
    }
  }
});

Template.tickets.events({
  'click .resolved': function(e) {
    e.preventDefault();
    Meteor.call('markResolved', this._id);
  },
  'click .unresolved': function(e) {
    e.preventDefault();
    Meteor.call('unmarkResolved', this._id);
  },
  'click .showAll': function(e) {
    e.preventDefault();
    return Session.set('show', 'all');
  },
  'click .showCurrent': function(e) {
    e.preventDefault();
    return Session.set('show', 'inProgress');
  },
  'click .showResolved': function(e) {
    e.preventDefault();
    return Session.set('show', 'resolved');
  }
})