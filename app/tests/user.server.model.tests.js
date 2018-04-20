const app = require('../../server.js');
const should = require('should');
const mongoose = require('mongoose');
const User = mongoose.model('User');

let user;

// Inform test tool that test is going to examine User model
describe('User Model Unit Tests:', () => {
  // Create new user object
  beforeEach((done) => {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      phone: '828-555-1234',
      username: 'test@test.com',
      password: 'password',
      provider: 'local',
    });

    done();
  });

  // Testing model save method
  describe('Testing the save method', () => {
    // Test 1 uses user object to save new user 
    it('Should be able to save without problems', () => {
      user.save((err) => {
        should.not.exist(err);
      });
    });

    // Test 2 checks model validation for user with no username 
    it('Should not be able to save a user without an username', () => {
      user.username = '';
      user.save((err) => {
        should.exist(err);
      });
    });
    
    // Test 3 checks model validation for duplicated username 
    it('Should not be able to save a user with duplicated username', () => {
      userB = new User({
        firstName: 'Full',
        lastName: 'Name',
        phone: '828-555-1234',
        username: 'test@test.com',
        password: 'password',
        provider: 'local',
      });

      userB.save((err) => {});

      user.save((err) => {
        should.exist(err);
      });
    });
    
    // Test 4 checks model validation for improperly formatted username 
    it('Should not be able to save a user with improperly formed username', () => {
      user.username = 'username';
      user.save((err) => {
        should.exist(err);
      });
    });
    
    // Test 5 checks model validation for user with password less than 6 characters 
    it('Should not be able to save a user with password less than 6 characters', () => {
      user.password = 'pass';
      user.save((err) => {
        should.exist(err);
      });
    });
  });

  // Clean up User collection
  afterEach((done) => {
    User.remove(() => {
        done();
    });
  });
});
