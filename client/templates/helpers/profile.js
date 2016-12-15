UI.registerHelper('chooseHistoryType', function() {
  var current = Session.get('historyType');
  if (current === 'withdraw') {
    return '<a href="#" class="showDepositHistory">Show deposit history</a>'
  } else if (current === 'income') {
    return '<a href="#" class="showWithdrawHistory">Show withdraw history</a>'
  }
});
UI.registerHelper('chooseHistoryTypeHeader', function() {
  var current = Session.get('historyType');
  if (current === 'withdraw') {
    return 'Your withdraws history'
  } else if (current === 'income') {
    return 'Your deposit history'
  }
});

UI.registerHelper('isWaiting', function(status) {
  if (status === 'waiting') {
    return true;
  }
});
UI.registerHelper('isSended', function(status) {
  if (status === 'sended') {
    return true;
  }
});
