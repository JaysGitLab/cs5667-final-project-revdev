process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const configureMongoose = require('./config/mongoose');
const configureExpress = require('./config/express');
const configurePassport = require('./config/passport');
//const configureCalendarAPI = require('./config/calendar');
const db = configureMongoose();
const app = configureExpress();
const passport = configurePassport();
//const calendarAPI = configureCalendarAPI();

app.listen(3000);
module.exports = app;

console.log('Server running at http://localhost:3000');


// google api
// https://developers.google.com/calendar/quickstart/nodejs
// https://www.youtube.com/watch?v=9LSEHrCgxOE
// https://www.youtube.com/watch?v=hoqA63SoAkM