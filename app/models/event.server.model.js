const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  eventType: {
    type: String,
    unique: true,
    required: 'Type is required'
  },
  numberOfPeopleFrom: {
    type: Number,
    required: 'Min people is required',
    default: 0
  },
  numberOfPeopleTo: {
    type: Number,
    required: 'Max people is required',
    default: 30,
    validate: [numberOfPeopleValidator, 'Minimum number of people must be less than the maximum']
  },
  cost: {
    type: Number,
    required: 'Cost is required',
    default: 0,
    min: [0, 'Cost cannot be negative']
  },
  deposit: {
    type: Number,
    required: 'Deposit % is required',
    default: 0,
    min: [0, 'Deposit cannot be less than 0%'],
    max: [100, 'Deposit cannot be more than 100%']
  },
  reminderEmail: {
    type: Number,
    required: 'Email reminder days is required',
    default: 3,
    min: [0, 'Reminder cannot be negative']
  },
  freeCancelation: {
    type: Number,
    required: 'Free cancelation days is required',
    default: 5,
    min: [0, 'Free cancelation cannot be negative']
  },
  maxNumberOfDays: {
    type: Number,
    required: 'Max days is required',
    default: 1,
    min: [1, 'Maximum number of days cannot be less than 1']
  }
});

mongoose.model('Event', EventSchema);

// function that validate the startDate and endDate
function numberOfPeopleValidator(value) {
  // `this` is the mongoose document
  return this.numberOfPeopleFrom < value;
}
