const fs = require('fs');
const mkdirp = require('mkdirp');
const readline = require('readline');
const { google } = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
//const TOKEN_PATH = '../../config/env/client_secret.json';
const TOKEN_PATH = './config/env/token.json';
const CLIENT_SECRET = './config/env/client_secret.json';

var _events = [];

exports.listEvents = function(date) {
  // Load client secrets from a local file.
  console.log('loading client secrets');
  fs.readFile(CLIENT_SECRET, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.

    authorize(JSON.parse(content), date, listEvents);
    //authorize(JSON.parse(content), insertEvent);
    console.log('list Events: ' + _events);
  });
};


exports.getEvents = function () {
  return _events;
};


exports.createEvents = function (date) {
  // Load client secrets from a local file.
  console.log('loading client secrets');
  fs.readFile(CLIENT_SECRET, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.

    let event = {
      'summary': 'Test Event 2',
      'location': 'Green Valley Parkway',
      'description': 'Birthday',
      'start': {
        'dateTime': '2018-04-23T17:00:00-06:00',
        'timeZone': 'America/New_York',
      },
      'end': {
        'dateTime': '2018-04-23T19:00:00-06:00',
        'timeZone': 'America/New_York',
      },
      'attendees': [
        {'email': 'lpage@example.com'},
        {'email': 'sbrin@example.com'},
      ],
      'reminders': {
        'useDefault': false,
        'overrides': [
          {'method': 'email', 'minutes': 24 * 60},
          {'method': 'popup', 'minutes': 10},
        ],
      },
    };

    authorize(JSON.parse(content), event, insertEvent);
    //authorize(JSON.parse(content), insertEvent);
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
  console.log('Test ' + credentials.installed);
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      console.log('Wrong Access Token for Calendar API -> ' + err);
      // getAccessToken(oAuth2Client, callback);
      return err;
    }
    console.log('Google Calendar authentication was successful');
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client, data);

  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @date retrn
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param date
 */
function listEvents(auth, date) {
  const calendar = google.calendar({version: 'v3', auth});
  console.log('Listing all events from a certain date');
  console.log(date);
  calendar.events.list({
    calendarId: 'primary',
    timeMin: date,
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, {data}) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        const end = event.end.dateTime || event.end.date;
        _events.push({start: start, end: end});
        console.log(`${start} - ${event.summary}`);
      });
      console.log(_events);
    } else {
      console.log('No upcoming events found.');
    }
  });
}

// Refer to the Node.js quickstart on how to setup the environment:
// https://developers.google.com/calendar/quickstart/node
// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
// stored credentials.

function insertEvent(auth, event) {
  const calendar = google.calendar({version: 'v3', auth});
  console.log('create event -> ' + event);
  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.data.summary);
  });
}