const event = require('../../app/controllers/event.server.controller');

module.exports = function(app) {
  app.route('/create')
    .get(event.list)
    .post(event.create);

  app.get('/eventCreate', event.create);
};