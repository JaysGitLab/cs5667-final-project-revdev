const app = require('../../server.js');
const should = require('should');
const mongoose = require('mongoose');
const calendar = require('../controllers/calendar.server.controller');

var event = {
  'summary': 'Test Event 2',
  'location': 'Green Valley Parkway',
  'description': 'Birthday',
  'start': {
    'dateTime': '2018-04-25T17:00:00-04:00',
    'timeZone': 'America/New_York',
  },
  'end': {
    'dateTime': '2018-04-25T19:00:00-04:00',
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


// Inform test tool that test is going to examine Event model
describe('Calendar Unit Tests:', () => {
  // Create new event object
  beforeEach((done) => {
    // calendar.insertEvent(event);
    done();
  });

  // Testing insert Event method
  describe('Testing the calendar insert event method', () => {
    // Test create an event on a free date
    it('Should be able to save without problems', () => {
      consol.log('Testing ' + event);
      /*calendar.createEvent((event) => {
        sould.not.exist(err)
      });*/
      calendar.createEvent(event);
    });

    // Test 2 checks model validation for event with no eventType
    it('Should not be able to save an event at the same time', () => {
      calendar.createEvent((event) => {
        consol.log('Testing2 ' + event);
        /*event.save((err) => {
          should.exist(err);
        });*/
        calendar.createEvent(event);
      });
    });

    /*// Test 3 checks model validation for duplicated eventType
    it('Should not be able to save an event with duplicated eventType', () => {
        eventB = new Event({
            eventType: 'Birthday Party',
        });

        eventB.save((err) => {
        });

        event.save((err) => {
            should.exist(err);
        });
    });

    // Test 4 checks model validation for event with wrong min/max people count
    it('Should not be able to save an event with wrong min/max people count', () => {
        event.numberOfPeopleFrom = 10;
        event.numberOfPeopleTo = 10;
        event.save((err) => {
            should.exist(err);
        });
    });*/
  });

  // Clean up Event collection
  afterEach((done) => {
    /* calendar.removeEvent((event) => {
      done();
    });*/
    // calendar.removeEvent(event);
    done();
  });
});
