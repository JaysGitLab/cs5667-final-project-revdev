const event = require('../../app/controllers/events.server.controller');

module.exports = function(app) {
  app.route('/createEvent')
    .get(event.renderCreateEvent)
    .post(event.createEvent);
};
