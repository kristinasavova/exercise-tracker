const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { Exercise } = require('../models/exercise');

/**
 * GET 'api/exercise/users'
 * Return all users as objects with username and _id - 200
 */

/**
 * POST '/api/exercise/new-user' 
 * Create new user and return an object with username and _id - 200    
 */ 

/**
 * POST '/api/exercise/add'
 * Add exercise to any user by posting user_id, description, duration, and optionally date
 * Return the user object with the exercise fields added - 200   
 */

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