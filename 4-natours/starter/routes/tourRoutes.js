const express = require('express');
const tourController = require('../controllers/tourController');

// mounting the router

const router = express.Router();

// param middleware to check if id greater than tours array length
// simple way to check if the tour is present
router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
