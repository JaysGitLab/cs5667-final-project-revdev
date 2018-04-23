const calendarAPI = require('./calendar.server.controller');

// Create a new 'render' controller method
exports.render = function (req, res) {
  // Use the 'response' object to render the 'index' view with a 'title' and 'userFullName' properties
  var date = calendarAPI.listEvents((new Date()).toISOString());
  console.log('data: ' + date);

  res.render('index', {
    title: 'Welcome to Green Valley Community Park',
    headline: 'Reservation System',
    userFullName: req.user ? req.user.fullName : '',
    test: calendarAPI.listEvents((new Date()).toISOString())
  });
};
