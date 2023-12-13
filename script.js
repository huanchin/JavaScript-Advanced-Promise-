'use strict';

// const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const renderCountry = function (data, className = '') {
  const html = `
          <article class="country ${className}">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
              <h3 class="country__name">${data.name}</h3>
              <h4 class="country__region">${data.region}</h4>
              <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
              <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
              <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
          </article>
    `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMsg = 'Somthing went wrong') {
  return fetch(url).then(response => {
    /*** reject promise (throwing errors) manually ***/
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    /*** return data if fulfilled ***/
    return response.json();
  });
};

/****** Promise.all *******/
const get3Countries = async function (c1, c2, c3) {
  try {
    // running promises in sequence
    // const [data1] = await getJSON(`https://restcountries.com/v2/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v2/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v2/name/${c3}`);
    // console.log([data1.capital, data2.capital, data3.capital]);

    // running promises in parallel (at the same time)
    // if one of the promises rejects, then the whole promise.all rejects as well(promise.all short circuits)
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v2/name/${c1}`),
      getJSON(`https://restcountries.com/v2/name/${c2}`),
      getJSON(`https://restcountries.com/v2/name/${c3}`),
    ]);

    console.log(data.map(el => el[0].capital));
  } catch (err) {
    console.log(err);
  }
};

get3Countries('portugal', 'canada', 'tanzania');

/***** Promise.race ******/
// The Promise.race() static method takes an iterable of promises as input and returns a single Promise. This returned promise settles with the eventual state of the first promise that settles.
// if the wining promise is a fulfilled promise, then the fulfillment value of this whole race promise is gonna be the fulfillment value of the winning promise
// example 1
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v2/name/italy`),
    getJSON(`https://restcountries.com/v2/name/egypt`),
    getJSON(`https://restcountries.com/v2/name/mexico`),
  ]);
  console.log(res[0]);
})();

// example 2
const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long!`));
    }, sec * 1000);
  });
};

Promise.race([getJSON(`https://restcountries.com/v2/name/japan`), timeout(1)])
  .then(res => console.log(res))
  .catch(err => console.error(err));

/****** Promise.allSettled ******/
// compare to Promise.all: Promise.allSettled does not short circuit
Promise.allSettled([Promise.resolve('Susccess'), Promise.reject('Error'), Promise.resolve('Another Success')]).then(res => console.log(res));

Promise.all([Promise.resolve('Susccess'), Promise.reject('Error'), Promise.resolve('Another Success')])
  .then(res => console.log(res))
  .catch(err => console.error(err));

/******* Promise.any *******/
// return first fulfilled and rejected promise is ignored
Promise.any([Promise.resolve('Susccess'), Promise.reject('Error'), Promise.resolve('Another Success')])
  .then(res => console.log(res))
  .catch(err => console.error(err));
