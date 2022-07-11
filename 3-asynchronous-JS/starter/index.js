const fs = require('fs');
const superagent = require('superagent');

// building promise to read file
const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file');
      resolve(data);
    });
  });
};

// building promise to write file
const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('could not write file');
      resolve('success');
    });
  });
};

// promises with async await
const getDocPicture = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    // promise all
    const promise1 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random `
    );
    const promise2 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random `
    );
    const promise3 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random `
    );
    const all = await Promise.all([promise1, promise2, promise3]);
    const imgs = all.map((result) => result.body.message);
    console.log(imgs);

    await writeFilePromise('./dog-img.txt', imgs.join('\n'));
    console.log('random dog image saved to file!');
  } catch (err) {
    console.log('Could not find file');
    throw err;
  }
  return '2/ async function ready';
};

// returning values from promises, using async await
(async () => {
  try {
    console.log('1/ will get dog pictures!');
    const x = await getDocPicture();
    console.log(x);
    console.log('3/ done getting dog pictures!');
  } catch (err) {
    console.log('There has been an ERROR');
  }
})();

// returning values from promises, using .then chaining
/*
console.log('1/ will get dog pictures!');
getDocPicture()
  .then((x) => {
    console.log(x);
    console.log('3/ done getting dog pictures!');
  })
  .catch((err) => console.log(err));
/*

// promises chaining
/*
readFilePromise(`${__dirname}/dog.txt`)
  .then((result) => {
    console.log(`Breed: ${result}`);

    return superagent.get(`https://dog.ceo/api/breed/${result}/images/random `);
  })
  .then((res) => {
    console.log(res.body.message);

    return writeFilePromise('./dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('random dog image saved to file!');
  })
  .catch((err) => {
    console.log(err);
  });
*/
