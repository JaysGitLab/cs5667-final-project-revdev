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
    validate: [dateValidator, 'End Date/Time must be valid']
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

function dateValidator(endTime) {
  if (this.startTime === null || endTime === null || this.eventType === null || this.startTime > endTime) {
    return false;
  }
  var startTime = this.startTime;
  var maxEndDate = new Date();
  Event.findOne({_id: this.eventType._id}, function (err, event) {
    if (err) {
      return handleError(err);
    }
    if (event === null) {
      return false;
    }
    maxEndDate = new Date(startTime.getTime() + (event.maxNumberOfDays * 24 * 60 * 60 * 1000));
  });
  return endTime.getTime() <= maxEndDate.getTime();
}

mongoose.model('Reservation', ReservationSchema);
