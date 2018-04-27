const app = require('../../server.js');
const should = require('should');
const mongoose = require('mongoose');
const calendar = require('../controllers/calendar.server.controller');

var event;

// Inform test tool that test is going to examine Event model
describe('Calendar Unit Tests:', () => {
    // Create new event object
    beforeEach((done) => {
      event = {
        'summary': 'Test Event 2',
        'location': 'Green Valley Parkway',
        'description': 'Birthday',
        'start': {
          'dateTime': '2018-04-25T17:00:00-06:00',
          'timeZone': 'America/New_York',
        },
        'end': {
          'dateTime': '2018-04-25T19:00:00-06:00',
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
        done();
    });

    // Testing model save method
    describe('Testing the save method', () => {
        // Test 1 uses event object to save new event
        it('Should be able to save without problems', () => {
            calendar.createEvents((event) =>{
              sould.exist(err)
            });
        });

        /*// Test 2 checks model validation for event with no eventType
        it('Should not be able to save an event without an eventType', () => {
            event.eventType = '';
            event.save((err) => {
                should.exist(err);
            });
        });

        // Test 3 checks model validation for duplicated eventType
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
        Event.remove(() => {
            done();
        });
    });
});
