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
            const exercise = user.exercises[user.exercises.length - 1] || user.exercises;  
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
 * GET '/api/exercise/log/?user_id={user_id}&from={from}&to={to}&limit={limit}'
 * Return the user object with a full array of exercise log and total exercise count - 200 
 * Retrieve any part of the exercise log for any user - 200  
 * Date format yyyy-mm-dd, limit - int
 */
router.get('/exercise/log', (req, res, next) => {
    const { user_id, from, to, limit } = req.query; 
    User
        .findById(user_id, err => {
            if (err) next(err);
        })
        .populate('exercises')
        .exec((err, user) => {
            if (err) next(err);
            const { username, exercises } = user;  
            let log = []; 
            if (from) {
                log = exercises.filter(exercise => exercise.date >= new Date(from));
            }
            if (to) {
                log = exercises.filter(exercise => exercise.date <= new Date(to)); // last day is not included!
            }
            if (limit) {
                log = exercises.slice(-limit); 
            } 
            if (!from && !to && !limit) {
                log = exercises;
            }
            res.json({ username, log, count: log.length });
        });                         
});

module.exports = router; 