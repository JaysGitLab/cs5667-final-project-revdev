const Reservation = require('mongoose').model('Reservation');

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
    res.render('createRes', {
      title: 'Create a Reservation',
      user: req.user,
      //eventTypes: db.collection('eventType').find().toArray(), 
      messages: req.flash('error')
    });
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
