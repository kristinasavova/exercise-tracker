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
        if (user) {
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
        }
    });
});

/**
 * GET '/api/exercise/log/:user_id'
 * Return the user object with a full array of exercise log and total exercise count - 200  
 */
router.get('/exercise/log/:user_id', (req, res, next) => {
    User.findById(req.params.user_id, (err, user) => {
        if (err) next(err);
        if (user) {
            Exercise.find({ userId: user._id }, (err, exercises) => {
                if (err) next(err);
                res.json({
                    userId: user._id,
                    username: user.username,
                    exerciseCount: exercises.length,  
                    exercises
                });
            });
        }
    });
});

/**
 * GET '/api/exercise/log/:user_id:from:to:limit'
 * Retrieve any part of the exercise log for any user - 200 
 * Date format yyyy-mm-dd, limit - int
 */
router.get('/exercise/log/:user_id/:from?/:to?/:limit?', (req, res, next) => {
    const { user_id, from, to, limit } = req.params;
    User.findById(user_id, (err, user) => {
        if (err) next(err);
        if (user) {
            const { _id, username } = user;
            if (from && to && limit) {
                Exercise.find({ 
                    userId: _id, 
                    date: { $gte: from, $lte: to }, 
                    duration: { $lte: limit } 
                }, (err, exercises) => {
                    if (err) next(err);
                    res.json({ userId: _id, username, exercises });
                });
            } else if (from && to) {
                Exercise.find({ 
                    userId: _id, 
                    date: { $gte: from, $lte: to }
                }, (err, exercises) => {
                    if (err) next(err);
                    res.json({ userId: _id, username, exercises });
                });
            } else if (from) {
                Exercise.find({ userId: _id, date: { $gte: from }}, (err, exercises) => {
                    if (err) next(err);
                    res.json({ userId: _id, username, exercises });
                });
            }
        }
    });
});

module.exports = router; 