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
    type: Array,
    required: true
  },
  cities: {
    type: Array,
    required: true
  },
  population: {
    type: String,
    required: true
  },
  square: {
    type: String,
    required: true
  },
  flag: {
    type: String,
    required: true
  },
  telCode: {
    type: String,
    required: true
  },
  geoCoordinats: {
    type: Array,
    required: true
  },
  backgroundPic: {
    type: String,
    required: true
  },
  other: {
    type: String,
    required: true
  }
});

schema.set('toJSON', {
  virtuals: true
});
module.exports = mongoose.model('country', schema);
