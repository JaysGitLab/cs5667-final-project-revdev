const Reservation = require('mongoose').model('Reservation');
const Event = require('mongoose').model('Event');

function getErrorMessage (err) {
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return err.message;
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

exports.getEventMaxDays = function(req, res, next) {
  console.log('req body eventType ' + req.body.eventType);
  Event.findOne({_id: req.body.eventType}, 'maxNumberOfDays', function(err, event) {
    if (err) {
      console.log('findone err ' + err);
      next(err);
    } else {
      console.log('event ' + event);
      res.event = event;
      console.log('event res ' + res.event);
      next(req, res);
    }
  });
};

exports.createRes = function(req, res) {
  console.log('createres event ' + res.event);
  const reservation = new Reservation(req.body);
  reservation.startTime = new Date(req.body.startTime);
  reservation.endTime = new Date(req.body.endTime);
  console.log('reservation ' + reservation);
  let maxDays = res.event.maxNumberOfDays;
  let maxEndDate = new Date(reservation.startTime.getTime() + (maxDays * 24 * 60 * 60 * 1000));
  if (reservation.endTime.getTime() > maxEndDate.getTime()) {
    req.flash('error', 'Event duration cannot be longer than max number of days for event type');
    return res.redirect('/createRes');
  }

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
