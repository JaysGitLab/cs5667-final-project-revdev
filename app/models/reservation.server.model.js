/**
 * Created by patt on 4/18/18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// https://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose
const ReservationSchema = new Schema({
  email: {
    type: String,
    required: 'Email is required',
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  dateCreated: {
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
    required: 'End Time required',
    validate: [dateValidator, 'Start Date must be less than End Date']
  },
  areas: String,
  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'Event Type required',
    ref: 'Event'
  },
  purpose: String,
  comments: String
});

// function that validate the startTime and endTime
function dateValidator(value) {
  // `this` is the mongoose document
  return this.startTime <= value;
}


mongoose.model('Reservation', ReservationSchema);
