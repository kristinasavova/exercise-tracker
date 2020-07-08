const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({  
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true 
    }, 
    createdAt: {
        type: Date, 
        default: Date.now 
    }
}); 

const User = mongoose.model('User', UserSchema);

module.exports.User = User; 