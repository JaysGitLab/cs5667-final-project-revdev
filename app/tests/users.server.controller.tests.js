const app = require('../../server');
const request = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const User - mongoose.model('User');

let user, userB;

describe('User Controller Unit Tests:', () => {
  beforeEach((done) => {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      username: 'test@test.com',
      password: 'password',
    });
  });

  describe('Testing the GET methods', () => {
    it('Should be able to get the signup form', (done) => {
      request(app).get('/signup/')
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html();
          done();
        });
    });

    it('Should be able to get the signin form', (done) => {
      request(app).get('/signin/')
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html();
          done();
        });
    });
  };

  describe('Testing the POST methods', () => {
    it('Should be able to signup', (done) => {
      request(app).post('/signup/')
        .field('firstName', user.firstName)
        .field('lastName', user.lastName)
        .field('username', user.username)
        .field('password', user.password)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html();
          done();
      });
    });
  
    it('Should be able to signup', (done) => {
      userB = new User({
        firstName: 'Jane',
        lastName: 'Doe',
        displayName: 'Jane Doe',
        username: 'jane@email.com',
        password: 'password',
      });

      userB.save(() => {});
    
      request(app).post('/signin/')
        .field('firstName', userB.firstName)
        .field('lastName', userB.lastName)
        .field('username', userB.username)
        .field('password', userB.password)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html();
          done();
        });
      });
  });

  afterEach((done) => {
    User.remove(() => {
      done();
    });
  });
});
