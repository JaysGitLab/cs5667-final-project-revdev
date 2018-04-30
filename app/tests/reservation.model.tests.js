/**
 * Created by patt on 4/18/18.
 */
const app = require('../../server.js');
const should = require('should');
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const Reservation = mongoose.model('Reservation');

let reservation, event;

// Inform test tool that test is going to examine Event model
describe('Reservation Model Unit Tests:', () => {
  // Create new reservation object
  beforeEach((done) => {
    event = new Event({
      eventType: 'Graduation Party',
      numberOfPeopleFrom: 0,
      numberOfPeopleTo: 30,
      cost: 25,
      deposit: 0,
      reminderEmail: 3,
      freeCancelation: 5,
      maxNumberOfDays: 1
    });

    event.save(() => {
    });

    reservation = new Reservation({
      username: 'beekmanpc@appstate.edu',
      startTime: new Date('April 18, 2018 01:00:00'),
      endTime: new Date('April 18, 2018 03:00:00'),
      areas: ['Picnic shelter'],
      eventType: event, 
      comments: 'test comments'
    });
    done();
  });

  // Testing model save method
  describe('Testing the save method', () => {
    // Test 1 uses reservation object to save new reservation
    it('Should be able to save without problems', () => {
      reservation.save((err) => {
        should.not.exist(err);
      });
    });

    // Test 2 checks model validation for reservation with no email
    it('Should not be able to save a reservation without an email', () => {
      reservation.username = '';
      reservation.save((err) => {
        should.exist(err);
      });
    });

    // Test 3 checks model validation for reservation with no startTime
    it('Should not be able to save a reservation without a startTime', () => {
      reservation.startTime = '';
      reservation.save((err) => {
        should.exist(err);
      });
    });

    // Test 4 checks model validation for reservation with no endTime
    it('Should not be able to save a reservation without an endTime', () => {
      reservation.endTime = '';
      reservation.save((err) => {
        should.exist(err);
      });
    });

    // Test 5 checks model validation for reservation with no eventType
    it('Should not be able to save a reservation without an eventType', () => {
      reservation.eventType = '';
      reservation.save((err) => {
        should.exist(err);
      });
    });

    // Test 6 checks model validation for reservation endTime before startTime
    it('Should not be able to save a reservation with the endTime before startTime', () => {
      reservation.startTime = new Date('April 18, 2018 00:00:00');
      reservation.endTime = new Date('April 10, 2018 00:00:00');
      reservation.save((err) => {
        should.exist(err);
      });
    });

    // Test 7 checks model validation for reservation endTime is within maxNumberOfDays for eventType
    it('Should not be able to save a reservation with duration longer than maxNumberOfDays', () => {
      reservation.startTime = new Date('April 18, 2018 00:00:00');
      // 3 days later when maxNumberOfDays should only be 1 day so April 19th
      reservation.endTime = new Date('April 21, 2018 00:00:00');
      reservation.save((err) => {
        should.exist(err);
      });
    });
  });

  // Clean up Reservation and Event Type collections
  afterEach((done) => {
    Reservation.remove(() => {
    });
    Event.remove(() => {
    });
    done();
  });
});
