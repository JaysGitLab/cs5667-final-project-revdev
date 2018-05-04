const app = require('../../server');
const request = require('supertest');
const should = require('should');
const mongoose = require('mongoose');
const User = mongoose.model('User');

let user, userB;

describe('User Controller Unit Tests:', () => {
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
    
    userB = new User({
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '828-555-1234',
      displayName: 'Jane Doe',
      username: 'jane@email.com',
      password: 'password',
      provider: 'local',
    });

    userB.save(() => {});

    done();
  });

  describe('Testing the GET methods', () => {
    it('Should be able to get the signup form', (done) => {
      request(app).get('/signup/')
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html;
          done();
        });
    });

    it('Should be able to get the signin form', (done) => {
      request(app).get('/signin/')
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html;
          done();
        });
    });
    
    it('Should be able to get the update user form', (done) => {
      request(app).get('/updateUser/')
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html;
          done();
        });
    });
  });

  describe('Testing the POST methods', () => {
    it('Should be able to signup', (done) => {
      request(app).post('/signup/')
        .field('firstName', user.firstName)
        .field('lastName', user.lastName)
        .field('phone', user.phone)
        .field('username', user.username)
        .field('password', user.password)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html;
          done();
      });
    });
  
    it('Should be able to signin', (done) => {
      request(app).post('/signin/')
        .field('username', userB.username)
        .field('password', userB.password)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html;
          done();
        });
    });
    
    it('Should be able to update user', (done) => {
      userB.firstName = 'JaneNew';

      request(app).post('/signin/')
        .field('firstName', userB.firstName)
        .field('lastName', userB.lastName)
        .field('phone', userB.phone)
        .field('username', userB.username)
        .field('password', userB.password)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.html;
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
