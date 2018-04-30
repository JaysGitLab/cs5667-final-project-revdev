const event = require('../../app/controllers/events.server.controller');

module.exports = function(app) {
  app.route('/create')
    .get(event.renderEvent)
    .post(event.create);
};
