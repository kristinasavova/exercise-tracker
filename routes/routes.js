const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Exercise } = require('../models/exercise');

/**
 * GET 'api/exercise/users'
 * Return all users as objects with username and _id - 200
 */
router.get('/exercise/users', (req, res, next) => {
    User.find({}, '_id username', (err, users) => {
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
        if (user) {
            const { username, _id } = user;
            res.json({ username, _id });
        }
    });
});

/**
 * POST '/api/exercise/add'
 * Add exercise to any user by posting user_id, description, duration, and optionally date
 * Return the user object with the exercise fields added - 200   
 */
router.post('/exercise/add', (req, res, next) => {
    const { userId, description } = req.body; 
    const duration = parseInt(req.body.duration); 
    let date; 
    req.body.date === '' || null ? 
        date = new Date().toDateString() :
        date = new Date(req.body.date).toDateString();
    const exercise = new Exercise(req.body);
    exercise.save(err => {
        if (err) return next(err); 
    });
    User.findOneAndUpdate(
        { _id: userId }, 
        { $push: { exercises: exercise }}, 
        { upsert: true }, (err, user) => {
        if (err) return next(err); 
        if (user) {
            const { _id, username } = user;
            res.json({ _id, username, date, duration, description });
        }
    });
});

/**
 * GET '/api/exercise/log/?user_id={user_id}&from={from}&to={to}&limit={limit}'
 * Return the user object with a full array of exercise log and total exercise count - 200 
 * Retrieve any part of the exercise log for any user - 200  
 */
router.get('/exercise/log', (req, res, next) => {
    const { userId, from, to, limit } = req.query; 
    User
        .findById(userId, err => { 
            if (err) return next(err); 
        })
        .populate({ path: 'exercises', select: '-_id -__v -userId' })
        .exec((err, user) => {
            if (err) return next(err);
            const { username, _id, exercises } = user;  
            let log = []; 
            if (from) {
                log = exercises.filter(exercise => exercise.date >= new Date(from));
            }
            if (to) {
                log = exercises.filter(exercise => exercise.date <= new Date(to)); 
            }
            if (limit) {
                log = exercises.slice(-limit); 
            } 
            if (!from && !to && !limit) {
                log = exercises;
            }
            res.json({ _id, username, count: log.length, log });
    });                         
});  

module.exports = router; 