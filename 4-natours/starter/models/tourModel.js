const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema(
  {
    createdAt: {
      default: Date.now(),
      type: Date,
    },
    description: {
      required: [true, 'A tour must have a description'],
      trim: true,
      type: String,
    },
    difficulty: {
      required: [true, 'A tour must have a difficulty'],
      type: String,
    },
    duration: {
      required: [true, 'A tour must have a duration'],
      type: Number,
    },
    imageCover: {
      required: [true, 'A tour must have a cover image'],
      type: String,
    },
    images: [String],
    maxGroupSize: {
      required: [true, 'A tour must have a group size'],
      type: Number,
    },
    name: {
      required: [true, 'A tour must have a name'],
      trim: true,
      type: String,
      unique: true,
    },
    ratingsAverage: {
      default: 4.5,
      type: Number,
    },
    ratingsQuantity: {
      default: 0,
      type: Number,
    },
    price: {
      required: [true, 'A tour must have a price'],
      type: Number,
    },
    priceDiscount: Number,
    startDates: [Date],
    summary: {
      trim: true,
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// adding a virtual property, which is not stored in MongoDB
// a regular function is used since we need to access `this`
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
