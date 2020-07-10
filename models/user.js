const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({  
    username: {
        type: String,
        trim: true,
        unique: true 
    }, 
    exercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
    }]
}); 

const User = mongoose.model('User', UserSchema);

module.exports.User = User; 