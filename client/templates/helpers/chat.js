UI.registerHelper('notInDefaultGroup', function() {
  if (!Meteor.user()) return;
  const group = Meteor.user().profile.group;
    if (group != 'default') {
      return true;
    } else {
      return false;
    }
});
UI.registerHelper('handleChatRooms', function() {
  let currentRoom = Session.get('chatRoom');
  let fieldDefault = '<li><a href="#" class="selectRoom" data-name="default">Default</a></li>';
  let fieldAdmins = '<li><a href="#" class="selectRoom" data-name="admins">Admins</a></li>';
  let fieldModerators = '<li><a href="#" class="selectRoom" data-name="moderators">Moderators</a></li>';
  if (currentRoom && currentRoom === 'default') {
    return fieldAdmins + fieldModerators;
  } else if (currentRoom && currentRoom === 'admins') {
    return fieldDefault + fieldModerators;
  } else if (currentRoom && currentRoom === 'moderators') {
    return fieldDefault + fieldAdmins;
  }
});
