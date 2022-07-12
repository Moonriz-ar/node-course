const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

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

/////////////////////////////////////////////////////////
// GET TOURS DATA FROM JSON FILE

// this is a synchronous operation, it is ok because it is at top level, and only will be called when the server is initialized.
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

////////////////////////////////////////////////////////
// HANDLER FUNCTIONS

const getAllTours = (req, res) => {
  console.log('time', req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const id = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (parseInt(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  if (parseInt(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//////////////////////////////////////////////////////////
// ROUTE HANDLING

// alternative way to do route handling
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// more concise way to do route handling
app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

////////////////////////////////////////////////////////
// SET UP SERVER TO LISTEN FOR REQUESTS

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
