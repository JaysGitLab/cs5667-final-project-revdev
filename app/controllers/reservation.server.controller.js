const mongoose = require('mongoose');
const Reservation = mongoose.model('Reservation');
const Event = mongoose.model('Event');
const JSON = require('circular-json');

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
          messages: req.flash('error').concat(req.flash('info'))
        });
      }
    })
  } else {
    return res.redirect('/');
  }
};

exports.getEventMaxDays = function(req, res, next) {
  Event.findOne({_id: req.body.eventType}, 'maxNumberOfDays', function(err, event) {
    if (err) {
      req.flash('error', getErrorMessage(err));
      return res.redirect('/createRes');
    } else {
      res.event = event;
      next();
    }
  });
};

exports.createRes = function(req, res) {
  const reservation = new Reservation(req.body);
  reservation.startTime = new Date(req.body.startTime);
  reservation.endTime = new Date(req.body.endTime);
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
    }
    req.flash('error', 'Reservation requested');
    return res.redirect('/');
  });
};

function getNameFromEventId (id, fn) {
  obj_id = mongoose.Types.ObjectId(id);
  Event.findById(obj_id, 'eventType').exec(function(err, eType) {
    if (err) return handleError(err);
    fn(eType.eventType);
  })
};


exports.renderList = function(req, res) {
  Reservation.find().exec((err, listReservation) => {
    if (err) {
      return res.redirect('/');
    } else {
      var stringRes = []
      for (var i=0; i<listReservation.length;i++) {
        jsonString = JSON.stringify(listReservation[i]);
        jsonString = jsonString.split("\",\"");
        var new_string;
        // There is some weird scoping issue happening here, it correctly gets the information
        // but it can't be accessed outside the scope of the callback function.
        getNameFromEventId(jsonString[5].substr(12,), function(string5){
          this.new_string = string5;
          console.log(this.new_string); // 'Birthday'
        });
        console.log(this.new_string); // undefined
        jsonString[5] = new_string;
        stringRes.push(jsonString);
      }
      res.render('listRes', {
      title: 'View all Reservations',
      list: stringRes,
      messages: req.flash('error')
      });
    }
  });
};