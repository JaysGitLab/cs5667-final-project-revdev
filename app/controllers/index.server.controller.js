const calendarAPI = require('./calendar.server.controller');

// Create a new 'render' controller method
exports.render = function (req, res) {
  // Use the 'response' object to render the 'index' view with a 'title' and 'userFullName' properties
  calendarAPI.listEvents((new Date('04.12.2018')).toISOString());
  var eventList = calendarAPI.getEvents();
  console.log('data: ' + eventList);

  res.render('index', {
    title: 'Welcome to Green Valley Community Park',
    headline: 'Reservation System',
    userFullName: req.user ? req.user.fullName : '',
    test: calendarAPI.getEvents()
  });
};
