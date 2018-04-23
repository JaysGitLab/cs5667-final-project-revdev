/**
 * Created by patt on 4/18/18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// https://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose
const ReservationSchema = new Schema({
  username: {
    type: String,
    required: 'Email is required',
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  dateCreated: {
    type: Date,
    default: Date.now()
  },
  startTime: {
    type: Date,
    required: 'Start Date/Time required'
  },
  endTime: {
    type: Date,
    required: 'End Date/Time required',
    validate: [dateValidator, 'Start Date/Time must be less than End Date/Time']
  },
  areas: {
    type: String,
    enum: ['Picnic shelter', 'Lower field']
  },
  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    required: 'Event Type required',
    ref: 'Event'
  },
  purpose: String,
  comments: String
});

// function that validates the startTime is before the end time and that the year and month match
// it also checks that the endTime date is within the max number of days of the event.
function dateValidator(value) {
  // `this` is the mongoose document
  return (this.startTime <= value) && (this.startTime.getFullYear() === value.getFullYear()) &&
         (this.startTime.getMonth() === value.getMonth()) && 
         (value.getDate() + value.eventType.maxNumberOfDays <= this.startTime.getDate());
}

mongoose.model('Reservation', ReservationSchema);
