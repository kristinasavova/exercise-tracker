const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }, 
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        max: 600
    },
    date: {
        required: true,
        type: Date,
        default: Date.now   
    }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports.Exercise = Exercise;