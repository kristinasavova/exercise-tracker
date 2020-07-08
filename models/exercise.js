const mongoose = require('mongoose');
const { User } = require('./user');

const ExerciseSchema = new mongoose.Schema({
    user_id: {    // insert array of references to user documents  
        type: [User._id], 
        required: true 
    }, 
    description: {
        type: Text,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports.Exercise = Exercise;