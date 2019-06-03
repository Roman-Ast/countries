const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  country: {
    type: String,
    required: true
  },
  capital: {
    type: String,
    required: true
  },
  oficialLanguages: {
    type: Array
  },
  cities: {
    type: Array
  },
  population: {
    type: String
  },
  square: {
    type: String
  },
  flag: {
    type: String
  },
  telCode: {
    type: String
  },
  geoCoordinats: {
    type: Array
  },
  backgroundPic: {
    type: String
  },
  other: {
    type: String
  }
});

schema.set('toJSON', {
  virtuals: true
});
module.exports = mongoose.model('country', schema);
