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
        default: 0
    },
    numberOfPeopleTo: {
        type: Number,
        default: 30,
        validate: [numberOfPeopleValidator, 'Minimum of people must be less than the maximum']
    },
    cost: {
        type: Number,
        default: 0,
        min: [0, 'Cost cannot be negative']
    },
    deposit: {
        type: Number,
        default: 0,
        min: [0, 'Deposit cannot be less than 0 %'],
        max: [100, 'Deposit cannot be more than 100%']
    },
    reminderEmail: {
        type: Number,
        default: 3,
        min: [0, 'Reminder cannot be negative']
    },
    freeCancelation: {
        type: Number,
        default: 5,
        min: [0, 'Free cancelation cannot be negative']
    },
    maxNumberOfDays: {
        type: Number,
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
