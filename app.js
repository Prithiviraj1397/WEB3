const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// enable cors
app.use(cors());
app.options('*', cors());

//routes
app.use('/user', require('./router/user'));
app.use('/web3', require('./web3'))


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(404, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
