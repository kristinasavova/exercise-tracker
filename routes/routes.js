const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Exercise } = require('../models/exercise');

/**
 * GET 'api/exercise/users'
 * Return all users as objects with username and _id - 200
 */
router.get('/exercise/users', (req, res, next) => {
    User.find({}, '_id username', { sort: { username: 1 }}, (err, users) => {
        if (err) return next(err);  
        res.json({ users }); 
    });
});

/**
 * POST '/api/exercise/new-user' 
 * Create new user and return an object with username and _id - 200    
 */ 
router.post('/exercise/new-user', (req, res, next) => {
    User.create({ username: req.body.username }, (err, user) => {
        if (err) return next(err);
        res.json({
            id: user._id,
            username: user.username
        });
    });
});

/**
 * POST '/api/exercise/add'
 * Add exercise to any user by posting user_id, description, duration, and optionally date
 * Return the user object with the exercise fields added - 200   
 */
router.post('/exercise/add', (req, res, next) => {
    if (req.body.date === '') req.body.date = undefined;  
    User.findById(req.body.userId, (err, user) => {
        if (err) return next(err);
        Exercise.create(req.body, (err, exercise) => {
            if (err) return next(err); 
            res.json({
                userId: user._id,
                username: user.username,
                exercise: {
                    description: exercise.description,
                    duration: exercise.duration, 
                    date: exercise.date   
                }
            });
        });
    });
});

/**
 * GET '/api/exercise/log/:user_id'
 * Return the user object with a full array of exercise log and total exercise count - 200  
 */

/**
 * GET '/api/exercise/log/:user_id:from:to:limit'
 * Retrieve any part of the exercise log for any user - 200 
 * Date format yyyy-mm-dd, limit - int
 */

module.exports = router; 