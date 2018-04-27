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
    required: 'End Date/Time required'
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

ReservationSchema.pre('save', function(next) {
  let maxNumberOfDays = 0;
  let startTime = this.startTime;
  let endTime = this.endTime;
  if (this.eventType) {
    Event.findOne({_id: this.eventType}, 'maxNumberOfDays', function(err, eventT) {
      if (err) {
        next(err);
      } else {
        if (eventT !== null) {
          let maxEndDate = new Date(startTime.getTime() + (eventT.maxNumberOfDays * 24 * 60 * 60 * 1000));
          if (!(startTime.getTime() <= endTime.getTime())) {
            var error = new Error('Start Date/Time must be before End Date/Time');
            next(error);
          } else if (!(endTime.getTime() <= maxEndDate.getTime())) {
            var error = new Error('Duration cannot be longer than maximum days for purpose');
            next(error);
          } else {
            next();
          }
        } else {
          next(new Error('Purpose does not exist'));
        }
      }
    });
  } else {
    next(new Error('Purpose is required'));
  }
});

mongoose.model('Reservation', ReservationSchema);
