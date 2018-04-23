const app = require('../../server');
const request = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Event = mongoose.model('Event');

let user;
let eventName;

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
        eventName = new Event({
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
      describe('Test to create.', () => {
          it('Should be able to create a new event.', () => {
              eventName.create((err) => {
                  should.exist(err);
              });
          });    
      });
      afterEach((done) => {
          Event.remove(() => {
              done();
          });
      });
});

