const mongoose = require('mongoose');
const slugify = require('slugify');

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
    secretTour: {
      type: Boolean,
      default: false,
    },
    slug: String,
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

// VIRTUAL PROPERTY
// adding a virtual property, which is not stored in MongoDB
// a regular function is used since we need to access `this`
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE
// document middleware: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// document middleware: runs after .save() and .create()
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  console.log(docs);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
