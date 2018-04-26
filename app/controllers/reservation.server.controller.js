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
    Event.find({}, '', function(err, events) {
      if (err) {
        res.redirect('/');
      } else {
        res.render('createRes', {
        title: 'Create a Reservation',
        user: req.user,
        eventTypes: events,
        messages: req.flash('error') || req.flash('info')
        });
      }
    })
  } else {
    return res.redirect('/');
  }
};

exports.createRes = function(req, res) {
  const reservation = new Reservation(req.body);
  reservation.startTime = new Date(req.body.startTime);
  reservation.endTime = new Date(req.body.endTime);

  reservation.save((err) => {
    if (err) {
      req.flash('error', getErrorMessage(err));
      return res.redirect('/createRes');
    } else {
      req.flash('info', 'Reservation requested');
      return res.redirect('/');
    }
  });
};

exports.list = function(req, res) {
  Reservation.find().exec((err, listReservation) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.status(200).json(listReservation);
    }
  });
};

exports.renderList = function(req, res) {
  Reservation.find().exec((err, listReservation) => {
    if (err) {
      return res.redirect('/');
    } else {
      res.render('listRes', {
      title: 'View all Reservations',
      list: res.status(200).json(listReservation),
      messages: req.flash('error')
      });
    }
  });
};