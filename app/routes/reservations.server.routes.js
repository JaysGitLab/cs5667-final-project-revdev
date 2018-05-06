const reservation = require('../controllers/reservation.server.controller');
const calendar = require('../controllers/calendar.server.controller');

module.exports = function(app) {
  app.route('/createRes')
    .get(reservation.renderCreateRes)
    .post(reservation.getEventMaxDays, calendar.freeBusyStatus, reservation.createRes,
      calendar.createEvent, reservation.redirectReservationPage)
};
