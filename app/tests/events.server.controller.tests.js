const app = require('../../server');
const request = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');

let user, event;

describe('Event Controller Unit Tests:', () => {
  beforeEach((done) => {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      phone: '123-456-7890',
      displayName: 'Full Name',
      username: 'test@test.com',
      password: 'password',
      provider: 'local',
    });

    event = new Event({
      eventType: 'Birthday',
      numberOfPeopleFrom: 4,
      numberOfPeopleTo: 2,
      cost: 25,
      deposit: 25,
      reminderEmail: 1,
      freeCancelation: 1,
      maxNumberOfDays: 2,
    });
    user.save(() => {});
    done();
  });

  describe('Testing the GET methods', () => {
    it('Should be able to get the create event form', (done) => {
      request(app).get('/createEvent/')
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html;
          done();
        });
    });
  });

  describe('Testing the POST methods', () => {
    it('Should be able to create an event', (done) => {
      request(app).post('/createRes/')
        .field('eventType', event.eventType)
        .field('numberOfPeopleFrom', event.numberOfPeopleFrom)
        .field('numberOfPeopleTo', event.numberOfPeopleTo)
        .field('cost', event.cost)
        .field('deposit', event.deposit)
        .field('reminderEmail', event.reminderEmail)
        .field('freeCancelation', event.freeCancelation)
        .field('maxNumberOfDays', event.maxNumberOfDays)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html;
          done();
      });
    });
  });

  afterEach((done) => {
    User.remove(() => {
    });
    Event.remove(() => {
    });
    done();
  });
});
