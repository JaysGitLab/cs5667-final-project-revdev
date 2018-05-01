const Reservation = require('mongoose').model('Reservation');
const Event = require('mongoose').model('Event');
const calendarAPI = require('./calendar.server.controller');

function getErrorMessage(err) {
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return err.message;
  }
}

exports.renderCreateRes = function (req, res) {

  /*event = new Event({
    eventType: 'Birthday Party',
    numberOfPeopleFrom: 0,
    numberOfPeopleTo: 30,
    cost: 25,
    deposit: 0,
    reminderEmail: 3,
    freeCancelation: 5,
    maxNumberOfDays: 1
  });
  event.save((err) => {
    if(err)
      console.log('Event could not be saved');
    else
      console.log('Event is saved');
  });*/

  if (req.user) {
    Event.find({}, '', function (err, events) {
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

exports.createRes = function (req, res) {
  const reservation = new Reservation(req.body);
  reservation.startTime = new Date(req.body.startTime);
  reservation.endTime = new Date(req.body.endTime);
  var event = Event.find({}, '');
  console.log('TEST -->> ' + event);

  /*reservation.save((err) => {
    if (err) {
      req.flash('error', getErrorMessage(err));
      return res.redirect('/createRes');
    } else {
      calendarAPI.createEvent(req);
      // req.flash('info', 'Reservation requested');
      return res.redirect('/');
    }
  });*/
  calendarAPI.createEvent(req, reservation);
  return res.redirect('/');
};
