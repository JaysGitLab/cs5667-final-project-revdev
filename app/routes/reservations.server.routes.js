const reservation = ('../../app/controllers/reservation.server.controller.js');

module.exports = function(app) {
  app.route('/createRes')
    .get(reservation.renderCreateRes)
    .post(reservation.createRes);
};
