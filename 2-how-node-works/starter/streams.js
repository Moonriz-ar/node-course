const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // solution 1 - load the whole file in memory, slow and resource intensive
  //   fs.readFile('./test-file.txt', (err, data) => {
  //     if (err) console.log(err);
  //     res.end(data);
  //   });

  // solution 2 - using streams.
  //   const readable = fs.createReadStream('./test-file.txt');
  //   readable.on('data', (chunk) => {
  //     res.write(chunk);
  //   });
  //   readable.on('end', () => {
  //     res.end();
  //   });
  //   readable.on('error', (err) => {
  //     console.log(err);
  //     res.statusCode = 500;
  //     res.end('File not found!');
  //   });

  // solution 3 - using stream with pipe operator
  const readable = fs.createReadStream('./test.file.txt');
  readable.pipe(res);
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening...');
});
