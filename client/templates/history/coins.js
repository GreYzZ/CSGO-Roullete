Template.coinsTransfersHistory.helpers({
  items: function() {
    return CoinsTransfers.find({}, {sort: {date: -1}});
  }
});