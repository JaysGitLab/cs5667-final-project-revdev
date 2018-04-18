/**
 * Created by patt on 4/18/18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationSchema = new Schema({
  email: {
    type: String,
    required: 'Email is required',
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  date: {
    type: Date,
    required: 'Reservation Date required',
    default: Date.now()
  },
  startTime: {
    type: Date,
    required: 'Start Time required'
  },
  endTime: {
    type: Date,
    required: 'End Time required'
  },
  areas: String,
  eventType: {
    type: String,
    required: 'Event Type required'
  },
  purpose: String,
  comments: String
});

mongoose.model('Reservation', ReservationSchema);
