/**
 * Created by patt on 4/18/18.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Event = require('mongoose').model('Event');

// https://stackoverflow.com/questions/18001478/referencing-another-schema-in-mongoose
const ReservationSchema = new Schema({
  username: {
    type: String,
    required: 'Email is required',
    match: [/.+\@.+\..+/, "Please fill a valid email address"]
  },
  created: {
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
    validate: [dateValidator, 'Start Date/Time must be less than End Date/Time and less than max days for event']
  },
  areas: {
    type: [String],
    enum: ['Picnic shelter', 'Lower field']
  },
  eventType: {
    type: Schema.Types.ObjectId,
    required: 'Event Type required',
    ref: 'Event'
  },
  comments: String
});

// Function that validates the startTime is before the end time
// It also checks that the endTime date is within the max number of days of the event
function dateValidator(value) {
  // `this` is the mongoose document
  // Calculate maximum end date based on eventType
  let maxEndDate = new Date(this.startTime.getTime() + (this.eventType.maxNumberOfDays * 24 * 60 * 60 * 1000));
  //return (this.startTime <= value) && (value <= maxEndDate);
  return (this.startTime <= value);
  console.log('startTime: ' + this.startTime.getTime());
  console.log('endTime: ' + this.endTime.getTime());
  console.log('maxNumberOfDay converted: ' + this.eventType.maxNumberOfDays * 24 * 60 * 60 * 1000);
  console.log('maxEndDate: ' + maxEndDate);
}

mongoose.model('Reservation', ReservationSchema);
