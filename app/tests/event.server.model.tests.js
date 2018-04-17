const app = require('../../server.js');
const should = require('should');
const mongoose = require('mongoose');
const Event = mongoose.model('Event');

let event;

// Inform test tool that test is going to examine Event model
describe('Event Model Unit Tests:', () => {
    // Create new event object
    beforeEach((done) => {
        event = new Event({
            eventType: 'Birthday Party',
            numberOfPeopleFrom: 0,
            numberOfPeopleTo: 30,
            cost: 25,
            deposit: 0,
            reminderEmail: 3,
            freeCancelation: 5,
            maxNumberOfDays: 1
        });

        done();
    });

    // Testing model save method
    describe('Testing the save method', () => {
        // Test 1 uses event object to save new event
        it('Should be able to save without problems', () => {
            event.save((err) => {
                should.not.exist(err);
            });
        });

        // Test 2 checks model validation for event with no email
        it('Should not be able to save a event without an email', () => {
            event.eventType = '';
            event.save((err) => {
                should.exist(err);
            });
        });

        // Test 3 checks model validation for duplicated eventType
        it('Should not be able to save a event with duplicated eventType', () => {
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
        it('Should not be able to save a event without wront min/max people count', () => {
            event.numberOfPeopleFrom = 10;
            event.numberOfPeopleTo = 10;
            event.save((err) => {
                should.exist(err);
            });
        });
    });

    // Clean up Event collection
    afterEach((done) => {
        Event.remove(() => {
            done();
        });
    });
});
