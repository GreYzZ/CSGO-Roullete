Meteor.methods({
  insertMessage: function(userid, username, message, room) {
    var user = Meteor.users.findOne({_id: userid});
    var settings = Settings.findOne();
    if (!user) {
      throw new Meteor.Error('cant find user');
    }
    if (user.profile.chatBanned == true) {
      return "chat_banned";
    }
    if (parseInt(settings.betToChat) > 0) {
      if (user.profile.totalBets < parseInt(settings.betToChat)) {
        return "bet_to_chat"
      }
    }
    if (room != 'default') {
      const group = user.profile.group;
      if (group == 'default') {
        throw new Meteor.Error('not permitted', 'user group is default');
      }
    }
    try {
      Messages.insert({userId: user._id, room: room, username: user.profile.username, message: message, userpic: user.profile.avatar, time: new Date()});
    } catch (err) {
      throw new Meteor.Error(err);
    }
  },
  removeMessage: function(messageId, userId) {
    var user = Meteor.users.findOne({_id:userId});
    var message = Messages.findOne({_id: messageId});
    if (!user) return;
    if (user.profile.group == "admin" || user.profile.group == "moderator" || user.profile.group == "superadmin") {
      Messages.remove(message);
      return true;
    } else {
      console.log('wrong permissions');
      return;
    }


  }
});
