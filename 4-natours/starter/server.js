require('dotenv').config();

const app = require('./app');
const mongoose = require('mongoose');

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
