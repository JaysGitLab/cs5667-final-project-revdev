const Reservation = require('mongoose').model('Reservation');
const passport = require('passport');

function getErrorMessage (err) {
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return 'Unknown server error';
  }
};

exports.createRes = function(req, res) {
  const reservation = new Reservation(req.body);
  reservation.email = req.user.username;

  reservation.save((err) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.status(200).json(reservation);
    }
  });
};