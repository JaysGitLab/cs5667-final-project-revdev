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

exports.renderCreateRes = function(req, res, next) {
  if (req.user) {
    res.render('createRes', {
      title: 'Create a Reservation',
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/');
  }
};

exports.createRes = function(req, res, next) {
  const reservation = new Reservation(req.body);
  reservation.username = req.user.username;
  if (Array.isArray(req.body.areas) {
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
