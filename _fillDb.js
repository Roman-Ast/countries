const countriesCatalog = require('./countries/countries');

const Country = require('./models/country');

module.exports = () => {
  countriesCatalog.forEach(el => {
    Country.create(el).then(country => console.log(country.id));
  });
};
