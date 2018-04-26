const Reservation = require('mongoose').model('Reservation');
const Event = require('mongoose').model('Event');

function getErrorMessage (err) {
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return 'Unknown server error';
  }
};

exports.renderCreateRes = function(req, res) {
  if (req.user) {
    Event.find({}, '_id, eventType', function(err, events) {
      if (err) {
        res.redirect('/');
      } else {
        res.render('createRes', {
        title: 'Create a Reservation',
        user: req.user,
        eventTypes: events,
        messages: req.flash('error')
        });
      }
    })
  } else {
    return res.redirect('/');
  }
};

exports.createRes = function(req, res) {
  const reservation = new Reservation(req.body);
  if (Array.isArray(req.body.areas)) {
    reservation.areas = [req.body.areas];
  } else {
    reservation.areas = req.body.areas;
  }
  
  reservation.save((err) => {
    if (err) {
      const message = getErrorMessage(err);
      req.flash('error', message);
      return res.redirect('/createRes');
    } else {
      return res.redirect('/');
    }
  });
};
