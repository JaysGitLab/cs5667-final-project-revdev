const Event = require('mongoose').model('Event');

function getErrorMessage(err) {
  let message = '';

  if (err.code) {
    switch (err.code) {
      case 11000:
      case 11001: 
        message = 'Event already exists';
        break;
      default: 
        message = 'Something went wrong';
     }
   } else {
     for (var errName in err.errors) {
       if (err.errors[errName].message) {
         message = err.errors[errName].message;
       }
     }
   }
   return message;
};

exports.renderCreateEvent = function(req, res) {
  if (req.user && req.user.admin) {
    res.render('createEvent', {
      title: 'Create an Event',
      user: req.user,
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/');
  }
}; 

exports.createEvent = function(req, res) {
  const event = new Event(req.body);
  event.creator = req.user;
  event.save((err) => {
    if (err) {
      req.flash('error', getErrorMessage(err));
      return res.redirect('/createEvent');
    } else {
      req.flash('info', 'Event created');
      return res.redirect('/');
    }
  });
};
