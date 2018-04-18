const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    event_type: {
        type: String,
        unique: true,
        required: 'Type is required'
    },
    number_of_people_from: {
        type: Number,
        default: 0
    },
    number_of_people_to: {
        type: Number,
        default: 30
    },
    cost: {
        type: Number,
        default: 0
    },
    deposit: {
        type: Number,
        default: 0
    },
    reminder_email: {
        type: Number,
        default: 3
    },
    free_cancelation: {
        type: Number,
        default: 5
    },
    max_number_of_days: {
        type: Number,
        default: 1
    }
});

mongoose.model('Event', EventSchema);
