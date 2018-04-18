/**
 * Created by patt on 4/18/18.
 */
const app = require('../../server.js');
const should = require('should');
const mongoose = require('mongoose');
const Event = mongoose.model('Event');

let reservation;

// Inform test tool that test is going to examine Event model
describe('Reservation Model Unit Tests:', () => {
    // Create new event object
    beforeEach((done) => {
        res = new reservation({
            email: 'beekmanpc@appstate.edu',
            date: new Date('April 18, 2018 00:00:00'),
            startTime: new Date()
        });

        done();
    });
});