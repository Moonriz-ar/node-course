require('dotenv').config();

const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

// connect to local mongodb
const DB = process.env.DATABASE_LOCAL;

// connect to mongodb atlas service
// const DB = process.env.DATABASE_ATLAS.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data successfully loaded!');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('tour collection documents deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// in console from root: node dev-data/data/import-dev-data.js --import
if (process.argv[2] === '--import') {
  importData();

  // in console from root: node dev-data/data/import-dev-data.js --delete
} else if (process.argv[2] === '--delete') {
  deleteData();
}
