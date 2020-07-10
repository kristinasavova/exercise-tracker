const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Exercise } = require('../models/exercise');

/**
 * GET 'api/exercise/users'
 * Return all users as objects with username and _id - 200
 */
router.get('/exercise/users', (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) return next(err);  
        res.json(users); 
    });
});

/**
 * POST '/api/exercise/new-user' 
 * Create new user and return an object with username and _id - 200    
 */ 
router.post('/exercise/new-user', (req, res, next) => {
    User.create({ username: req.body.username }, (err, user) => {
        if (err) return next(err);
        res.json(user);
    });
});

/**
 * POST '/api/exercise/add'
 * Add exercise to any user by posting user_id, description, duration, and optionally date
 * Return the user object with the exercise fields added - 200   
 */
router.post('/exercise/add', (req, res, next) => {
    if (req.body.date === '' || null) req.body.date = new Date(); 
    const exercise = new Exercise(req.body);
    exercise.save(err => {
        if (err) next(err); 
    });
    User
        .findOneAndUpdate(
            { _id: req.body.userId }, 
            { $push: { exercises: exercise }}, 
            { upsert: true }, err => {
                if (err) next(err); 
        })
        .populate('exercises')
        .exec((err, user) => {
            if (err) next(err);
            const exercise = user.exercises[user.exercises.length - 1];  
            res.json({
                username: user.username,
                description: exercise.description,
                duration: exercise.duration,
                _id: user._id,
                date: exercise.date.toDateString()
            });
        });
});

/**
 * GET '/api/exercise/log/:user_id'
 * Return the user object with a full array of exercise log and total exercise count - 200  
 */
router.get('/exercise/log/:user_id', (req, res, next) => {
    User
        .findById(req.params.user_id, err => {  // Date => toDateString() !
            if (err) next(err);
        })
        .populate('exercises')
        .exec((err, user) => {
            if (err) next(err);
            res.json({
                _id: user._id,
                username: user.username,
                count: user.exercises.length,
                log: user.exercises
            });
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
            const { _id, username } = user;   // limit - limit of logs per one time
            if (from && to && limit) {          // make one route and use filter
                Exercise.find({                     // add count
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