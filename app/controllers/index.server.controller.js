//const calendarAPI = require('./calendar.server.controller');

// Create a new 'render' controller method
exports.render = function (req, res) {
  // Use the 'response' object to render the 'index' view with a 'title' and 'userFullName' properties
  // calendarAPI.createEvent((new Date('04.12.2018')).toISOString());
  var event = {
    'summary': 'Test Event 2',
    'location': 'Green Valley Parkway',
    'description': 'Birthday',
    'start': {
      'dateTime': '2018-04-25T17:00:00-06:00',
      'timeZone': 'America/New_York',
    },
    'end': {
      'dateTime': '2018-04-25T19:00:00-06:00',
      'timeZone': 'America/New_York',
    },
    'attendees': [
      {'email': 'lpage@example.com'},
      {'email': 'sbrin@example.com'},
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };
  console.log('data: ' + event);
  /*calendarAPI.createEvent(event, err => {
    console.log('API Call: ' + err);
  });*/
  // calendarAPI.test(event)
  // console.log('API Call: ' + calendarAPI.test(event));

  res.render('index', {
    title: 'Welcome to Green Valley Community Park',
    headline: 'Reservation System',
    userFullName: req.user ? req.user.fullName : '',
    messages: req.flash('error').concat(req.flash('info'))
  });
};
