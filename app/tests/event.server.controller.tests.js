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
                  should.not.exist(err);
              });
          });
		  it('Test should not save with people from less than to.', () => {
			eventName.numberOfPeopleTo = 6;
			eventName.numberOfPeopleFrom = 5;
			eventName.create((err) => {
                  should.exist(err);
              });
		  });
		  it('Test should not save with cost less than 0.', () => {
			eventName.cost = -1;
			eventName.create((err) => {
                  should.exist(err);
              });
		  });
		  it('Test should not save with deposit less than 0.', () => {
			eventName.deposit = -1;
			eventName.create((err) => {
                  should.exist(err);
              });
		  });
		  it('Test should not save with deposit greater than 100.', () => {
			eventName.deposit = 101;
			eventName.create((err) => {
                  should.exist(err);
              });
		  });
		  it('Test should not save with reminder email less than 0.', () => {
			eventName.reminderEmail = -1;
			eventName.create((err) => {
                  should.exist(err);
              });
		  });
		  it('Test should not save with free cancelation less than 0.', () => {
			eventName.freeCancelation = -1;
			eventName.create((err) => {
                  should.exist(err);
              });
		  });
		  it('Test should not save with the max days less than 1.', () => {
			eventName.freeCancelation = 0;
			eventName.create((err) => {
                  should.exist(err);
              });
		  });
		  it('Test should save with only an event type.', () => {
			eventType = 'Birthday';
            numberOfPeopleFrom = null;
            numberOfPeopleTo = null;
            cost = null;
            deposit = null;
            reminderEmail = null;
            freeCancelation = null;
            maxNumberOfDays = null;
			eventName.create((err) => {
                  should.not.exist(err);
              });
		  });
      });
      afterEach((done) => {
		  User.remove(() => {});
          Event.remove(() => {});
		  done();
      });
});

