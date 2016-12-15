UI.registerHelper('affilateLevel', function() {
  var affilates = Meteor.user().profile.affilates.length;
  if (affilates >= 0 && affilates < 50) {
    var str = '<span style="color: #cd7f32; font-weight: bold;">Bronze</span> (1 coin per 300 bet)';
    return str;
  } else if (affilates >= 50 && affilates < 100) {
    var str = '<span style="color: #c0c0c0; font-weight: bold;">Silver</span> (1 coin per 200 bet)';
    return str;
  } else if (affilates >= 100) {
    var str = '<span style="color: #ffd700; font-weight: bold;">Gold</span> (1 coin per 100 bet)'
    return str;
  }

});
UI.registerHelper('alreadyAffilated', function() {
  if (Meteor.user().profile.affilated == true) {
    return true;
  } else {
    return false;
  }
});

UI.registerHelper('depositors', function() {
  if (Meteor.user().profile.affilates.length > 0) {
      var aff = Meteor.user().profile.affilates;
      var total = 0;
      _.each(aff, function(item) {
        if (item.deposited == true) {
          total += 1;
        }
      });
      if (total > 0 && total < 50) {
        var str = '' + total + '/50'
        return str;
      } else if (total >= 50 && total < 150) {
        var str = '' + total + '/150';
        return str;
      } else if (total >= 150) {
        return '' + total
      } else if (total == 0) {
        return '0/50'
      }
    } else {
      return '0/50';
    }
})