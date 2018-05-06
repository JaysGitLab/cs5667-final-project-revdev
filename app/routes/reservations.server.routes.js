const reservation = require('../../app/controllers/reservation.server.controller');

module.exports = function(app) {
  app.route('/createRes')
    .get(reservation.renderCreateRes)
    .post(reservation.getEventMaxDays, reservation.createRes)
  app.route('/listRes')
     .get(reservation.getList, reservation.getNameFromEventId, reservation.renderList);
};
