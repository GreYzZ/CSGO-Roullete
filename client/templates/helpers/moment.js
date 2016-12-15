UI.registerHelper('formatTime', function(time) {
  return moment(time).format("MMMM Do YYYY, h:mm:ss a")
});