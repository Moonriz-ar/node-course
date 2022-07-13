const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

////////////////////////////////////////////////////////
// MIDDLEWARE

// middleware to add body to request object, otherwise returns undefined

// middleware using morgan for request logging, returns a function
app.use(morgan('dev'));

// middleware to parse json from request body
app.use(express.json());

// middleware just to show a console.log
app.use((req, res, next) => {
  console.log('hello from the middleware');
  next();
});

// middleware to add request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// middleware for route controllers and handlers

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
