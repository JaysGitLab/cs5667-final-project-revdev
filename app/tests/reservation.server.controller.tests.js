const app = require('../../server');
const request = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const Reservation = mongoose.model('Reservation');

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
        .field('eventType', '5ae7aacc8214600d674cd04d')
        .field('comments', reservation.comments)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html;
          done();
      });
    });
  });

  afterEach((done) => {
    Reservation.remove(() => {
    });
    Event.remove(() => {
    });
    done();
  });
});
