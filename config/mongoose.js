const config = require('./config');
const mongoose = require('mongoose');

module.exports = function() {
  const db = mongoose.connect(config.db);

  require('../app/models/user.server.model');
  require('../app/models/event.server.model');
  require('../app/models/reservation.server.model');

  return db;
};
