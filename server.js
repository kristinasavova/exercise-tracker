const express = require('express');
const app = express();
const routes = require('./routes/routes');
require('dotenv').config();

const cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI || 
    `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_KEY}@ks-ujl29.mongodb.net/exercise-tracker?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', err => console.error(err));
db.once('open', () => console.log('Database is connected'));

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.use('/api', routes);

// 404 Error middleware
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err); 
});

// Global Error Handler
app.use((err, req, res, next) => {
    let errCode, errMessage;
    if (err.errors) {
        // Mongoose validation error
        errCode = 400 // bad request
        const keys = Object.keys(err.errors);
        // Report the first validation error
        errMessage = err.errors[keys[0]].message;
    } else {
        // Generic or custom error
        errCode = err.status || 500;
        errMessage = err.message || 'Internal Server Error';
    }
    console.log(err);
    res.status(errCode).json({ error: errMessage });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Express is listening on port ' + listener.address().port);
});
