const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
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
  // whenever we pass an argument inside next function, it will assume there was an error, skip the next middlewares and send the err object to the global error handling middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// middleware for global error handling
app.use(globalErrorHandler);

module.exports = app;
