const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

////////////////////////////////////////////////////////
// MIDDLEWARE

// middleware to add body to request object, otherwise returns undefined

// middleware using morgan for request logging, returns a function
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// middleware to parse json from request body
app.use(express.json());

// middleware to serve static files
app.use(express.static(`${__dirname}/public`));

// middleware to add request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// middleware for route controllers and handlers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  // whenever we pass an argument inside next function, it will assume there was an error, skip the next middlewares and send the err object to the global error handling middleware
  next(err);
});

// middleware for global error handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
