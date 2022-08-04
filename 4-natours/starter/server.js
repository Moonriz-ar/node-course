require('dotenv').config();

process.on('uncaughtException', (err, origin) => {
  console.log('Uncaught exception', err, 'exception origin', origin);
  process.exit(1);
});

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
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled rejection at: ', promise, 'reason: ', reason);
  server.close(() => {
    process.exit(1);
  });
});
