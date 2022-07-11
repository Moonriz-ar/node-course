const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

///////////////////////////////////////////////////////////
// FILES

// blocking, synchronous way
// const textInput = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textInput);

// const textOut = `This is what we know about the avocado: ${textInput}.\nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written');

// non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('file has been written!');
//       });
//     });
//   });
// });
// console.log('will read file!');

///////////////////////////////////////////////////////////
// SERVER

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObject
      .map((product) => replaceTemplate(templateCard, product))
      .join('');

    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    // product page
  } else if (pathname === '/product') {
    const product = dataObject[query.id];
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const output = replaceTemplate(templateProduct, product);

    res.end(output);

    // api
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);

    // not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h2>page could not be found!</h2>');
  }
});

// the first argument is port,
// second argument is host, default is localhost
// third optional argument is callback function
server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000');
});
