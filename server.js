const express = require('express');
const app = express();
const routes = require('./routes/routes');
const cors = require('cors');
const mongoose = require('mongoose');
const corsOptions = {
    origin: 'https://exercise-tracker-rest-api.herokuapp.com/',
    optionsSuccessStatus: 200
};

require('dotenv').config();

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
        ssl: true
});

const db = mongoose.connection;

db.on('error', err => console.error(err));
db.once('open', () => console.log('Database is connected'));

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

app.set ('port', process.env.PORT || 3000);
const server = app.listen (app.get ('port'), () => {
    console.log (`Express is listening on port ${server.address ().port}`);
});
