UI.registerHelper('isSoundDisabled', function() {
  var sound = Session.get('sound');
  if (sound === false) {
    console.log('sound disabled');
    return false;
  } else {
    console.log('sound enabled');
    return true;
  }
});
