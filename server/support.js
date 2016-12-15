Meteor.methods({
  createSupportTicket: function(userId, content, email, category) {
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return;
    var ticket = {
      userid: userId,
      content: content,
      email: email,
      status: 'in_progress',
      category: category,
      date: new Date()
    }
    try {
      Support.insert(ticket);
      return true;
    } catch (err) {
      return console.log(err);
    }
  },
  markResolved: function(ticketId) {
    var ticket = Support.findOne({_id: ticketId});
    if (!ticket) return;
    try {
      Support.update(ticket, {$set: {status: 'resolved'}});
      return true;
    } catch (err) {
      console.log(err);
    }
  },
  unmarkResolved: function(ticketId) {
    var ticket = Support.findOne({_id: ticketId});
    if (!ticket) return;
    try {
      Support.update(ticket, {$set: {status: 'in_progress'}});
      return true;
    } catch (err) {
      console.log(err);
    }
  }
});