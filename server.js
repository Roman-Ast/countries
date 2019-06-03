const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const path = require('path');

// feeling the base
//require('./_fillDb')();
const app = express();

const Country = require('./models/country');
// database
const database = () => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.set('debug', true);

    mongoose.connection
      .on('error', error => reject(error))
      .on('close', () => console.log('Database connection closed.'))
      .once('open', () => resolve(mongoose.connections[0]));

    mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });
  });
};

// set
app.set('view engine', 'ejs');

// use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);
const recordInDb = [];
// get requests
// main page
app.get('/', (req, res) => {
  res.render('index', {
    valueOfSelect: 'default',
    valueOfInput: 'search'
  });
});
app.get('/find', (req, res) => {
  res.render('find', {
    country: recordInDb,
    valueOfSelect: 'default',
    valueOfInput: 'search'
  });
});

// post requests
app.post('/', async (req, res) => {
  const record = await Country.findOne({ [req.body.type]: req.body.name });

  try {
    recordInDb.splice(0, recordInDb.length);
    recordInDb.push(record);
    if (record) {
      res.json({
        ok: true
      });
    } else {
      res.json({
        ok: false
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

database()
  .then(info => {
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    app.listen(config.PORT, () =>
      console.log(`Example app listening on port ${config.PORT}!`)
    );
  })
  .catch(error => {
    console.error('Unable to connect to database');
    throw new Error(error);
  });
