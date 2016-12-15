Session.set('chatRoom', 'default');
Template.chat.helpers({
  messages: function() {
    return Messages.find({}, {sort: {time: 1}}).fetch();
  },
  roomName: function() {
    return Session.get('chatRoom');
  }
});

Template.chat.events({
  'click .banUser': function(e) {
    Meteor.call('banChat', this.userId, function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "Good job, mate!", "success");
        }
      }
    });
  },
  'click .unbanUser': function(e) {
    Meteor.call('unbanChat', this.userId, function(err, result) {
      if (!err) {
        if (result == true) {
          return sweetAlert("Success!", "User chat unbanned!", "success");
        }
      }
    });
  },
  'click .removeMessage': function(e) {
    e.preventDefault();
    userId = Meteor.user()._id;
    Meteor.call('removeMessage', this._id, userId, function(err, result) {
      if (result == true) {
        console.log('removed;');
      }
    });
  },
  'click .selectRoom': function(event, template) {
    let room = event.currentTarget.dataset.name;
    const group = Meteor.user().profile.group;
    if (group != 'default') {
      return Session.set('chatRoom', room);
    }
  }
});
Template.chat.rendered = function() {
  Tracker.autorun(function() {
    var messages = Messages.find().fetch();
    if (messages)
      var elem = document.getElementById('messages');
      if (elem) {
        elem.scrollTop = elem.scrollHeight;
      }
  });
}

Template.input.events({
  'keydown input#message': function(event) {
    if (event.which == 13) {
      if (Meteor.user()) {
        var steamid = Meteor.user().profile.id;
      } else {
        return;
      }
      var message = document.getElementById('message');
      if (message.value !== '') {
        const room = Session.get('chatRoom');
        Meteor.call('insertMessage', Meteor.user()._id, Meteor.user().profile.username, message.value, room, function(err, result) {
          if (!err) {
            if (result == "chat_banned" && message.value == "rly?") {
              return sweetAlert('Yes!', "!!!!!!!", "warning");
            }
            if (result == "chat_banned") {
              return sweetAlert('Ahh', "You have a ban chat!", "error");
            }
            if (result == "bet_to_chat") {
              return sweetAlert('', "Please place at least one bet to send messages", "error");
            }
            document.getElementById('message').value = '';
            message.value = '';
          } else {
            console.log(err);
          }
        });
      }
    }
  }
});
