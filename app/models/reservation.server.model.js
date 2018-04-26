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
  // Calculate maximum end date based on eventType
  // `this` is the mongoose document
  let maxEndDate = new Date(this.startTime.getTime() + (this.eventType.maxNumberOfDays * 24 * 60 * 60 * 1000));
  return (this.startTime <= value) && (value <= maxEndDate);
}

mongoose.model('Reservation', ReservationSchema);
