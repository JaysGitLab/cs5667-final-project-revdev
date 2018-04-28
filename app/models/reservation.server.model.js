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
    min: Date(this.startTime)
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

function endTimeMax(endTime) {
  var startTime = this.startTime;
  Event.findOne({_id: this.eventType}, function (err, event) {
    if (err) {
      return handleError(err);
    }
    return new Date(startTime.getTime() + (event.maxNumberOfDays * 24 * 60 * 60 * 1000));
  });
}

mongoose.model('Reservation', ReservationSchema);
