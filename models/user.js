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

UserSchema.pre('findOne', function() {
    // `this` is an instance of mongoose.Query
    this.populate({ path: 'exercises', select: '-_id -__v -userId' });
  });

const User = mongoose.model('User', UserSchema);

module.exports.User = User; 