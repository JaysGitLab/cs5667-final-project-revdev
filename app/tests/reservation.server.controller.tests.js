const app = require('../../server');
const request = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const Reservation = mongoose.model('Reservation');
const calendarAPI = require('../controllers/calendar.server.controller');

let event, reservation;

describe('Reservation Controller Unit Tests:', () => {
  beforeEach((done) => {
    event = new Event({
      eventType: 'Anniversary Party',
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

  describe('Testing the GET methods', () => {
    it('Should be able to get the create reservation form', (done) => {
      request(app).get('/createRes/')
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html;
          done();
        });
    });
  });

  describe('Testing the POST methods', () => {
    it('Should be able to create a reservation', (done) => {
      request(app).post('/createRes/')
        .field('username', reservation.username)
        .field('startTime', '2018-04-30T16:00')
        .field('endTime', '2018-04-30T17:00')
        .field('areas[]', ['Picnic shelter'])
        .field('eventType', reservation.eventType._id.toString())
        .field('comments', reservation.comments)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html;
          done();
      });
    });
    
    it('Should not be able to create a reservation with longer than max days', (done) => {
      request(app).post('/createRes/')
        .field('username', reservation.username)
        .field('startTime', '2018-04-30T16:00')
        .field('endTime', '2018-05-02T17:00')
        .field('areas[]', ['Picnic shelter'])
        .field('eventType', reservation.eventType._id.toString())
        .field('comments', reservation.comments)
        .expect(302)
        .end((err, res) => {
          res.body.should.be.html;
          done();
      });
    });

    // Test 7 checks time overlap in calender and tries to save a reservation twice
    it('Should not be able to save a second event at the same time', () => {
      reservation.save((err) => {
        should.exist(err);
      });
    });
  });

  afterEach((done) => {
    calendarAPI.removeEvent(reservation.startTime);
    Reservation.remove(() => {
    });
    Event.remove(() => {
    });
    done();
  });
});
