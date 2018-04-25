const reservation = ('../../app/controllers/reservation.server.controller');

module.exports = function(app) {
  app.route('/createRes')
    .get(function(req, res, next) {
      reservation.renderCreateRes
    })
    .post(function(req, res, next) {
      reservation.createRes
    });
};
