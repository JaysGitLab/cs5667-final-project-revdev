const event = require('../../app/controllers/events.server.controller');

module.exports = function(app) {
  app.route('/create')
    .get(event.list)
    .post(event.create);

  app.get('/eventCreate', event.create);
};