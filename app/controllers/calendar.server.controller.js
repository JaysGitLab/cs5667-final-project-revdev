const config = require('../../config/config');

const fs = require('fs');
const mkdirp = require('mkdirp');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = config.tokenPath;
const CLIENT_SECRET = config.clientSecrete;

exports.createEvent = function (req, res, next) {
  // Load client secrets from a local file.
  console.log('loading client secrets');
  console.log('event: ' + res.req.res.event.eventType);

  let event = {
    'summary': res.req.res.event.eventType,
    'location': req.body.areas[0],
    'description': req.body.username + '\n' + req.body.comments,
    'start': {
      'dateTime': new Date(req.body.startTime).toISOString(),
      'timeZone': 'America/New_York',
    },
    'end': {
      'dateTime': new Date(req.body.endTime).toISOString(),
      'timeZone': 'America/New_York',
    },
    'attendees': [
      {'email': req.body.username},
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };
  var secret = fs.readFileSync(CLIENT_SECRET, 'utf8');

  var credentials = JSON.parse(secret);
  // console.log('Test ' + credentials.installed);
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  let token = fs.readFileSync(TOKEN_PATH, 'utf8');
  console.log('Google Calendar authentication was successful');
  oAuth2Client.setCredentials(JSON.parse(token));

  let auth = oAuth2Client;
  const calendar = google.calendar({version: 'v3', auth});
  console.log('create event -> ' + event.summary);
  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  }, function (err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      res.eventCreated = false;
      req.flash('error', 'There was an error contacting the Calendar service: ' + err);
      next(err);
    }
    console.log('Event created: %s', res.req.res.event.eventType);
    res.eventCreated = true;
    next()
  });
};

exports.freeBusyStatus = function (res, req, next) {
  // Load client secrets from a local file.
  console.log('loading client secrets');
  console.log('event: ' + res.res.event.eventType);

  var event = res.body;
  var secret = fs.readFileSync(CLIENT_SECRET, 'utf8');

  var credentials = JSON.parse(secret);
  // console.log('Test ' + credentials.installed);
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  var token = fs.readFileSync(TOKEN_PATH, 'utf8');
  console.log('Google Calendar authentication was successful');
  oAuth2Client.setCredentials(JSON.parse(token));
  var auth = oAuth2Client;

  // event.event
  const startDate = new Date(event.startTime).toISOString(); //new Date('20 April 2018 12:00').toISOString();
  const endDate = new Date(event.endTime).toISOString(); //new Date('22 April 2018 13:00').toISOString();
  // 2018-04-20T16:00:00.000Z
  var calID = 'primary';

  const check = {
    resource: {
      auth: auth,
      timeMin: startDate,
      timeMax: endDate,
      items: [{id: calID}]
    }
  };
  const calendar = google.calendar({version: 'v3', auth});

  calendar.freebusy.query(check, function (err, response) {
    if (err) {
      console.log('error: ' + err);
      next(err);
    } else {
      var events = response.data.calendars['primary']['busy'].length;
      if (events === 0) {
        console.log('No upcoming events found.');
        res.freeBusyStatus = 'Free';
        next();
      } else {
        console.log('busy in here...');
        console.log('Event ' + res.res.event.eventType + ' could not be crated');
        // event.req.flash('error', getErrorMessage(err));
        res.freeBusyStatus = 'Busy';
        res.busyStartTime = startDate;
        res.busyEndTime = endDate;
        next();
      }
    }
  });
};

exports.removeEvent = function (date) {
  // Load client secrets from a local file.
  console.log('loading client secrets');
  fs.readFile(CLIENT_SECRET, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), date, listEvents);
  });
};


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param data
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, data, callback) {
  // console.log('Test ' + credentials.installed);
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      console.log('Wrong Access Token for Calendar API -> ' + err);
      return err;
    }
    console.log('Google Calendar authentication was successful');
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, data);

  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @event retrn
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param event
 */
function listEvents(auth, event) {
  const calendar = google.calendar({version: 'v3', auth});
  console.log('Listing all events from a certain event');
  console.log(event);
  calendar.events.list({
    calendarId: 'primary',
    timeMin: event.start.dateTime, //'2018-04-20T11:00:00-04:00'
    timeMax: event.end.dateTime, //'2018-04-21T20:00:00-04:00'
    maxResults: 1,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = data.items;
    if (events.length) {
      console.log('Upcoming event:');
      console.log(`${events[0].start.dateTime || events[0].start.date} - ${events[0].summary}`);
      deleteEvent(auth, events[0]);
    } else {
      console.log('No upcoming events found to delete.');
    }
  });
}

function deleteEvent(auth, event) {
  const calendar = google.calendar({version: 'v3', auth});
  console.log('delete event -> ' + event.summary);
  calendar.events.delete({
    calendarId: 'primary',
    eventId: event.id,
  }, function (err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event deleted...');
  });
}
