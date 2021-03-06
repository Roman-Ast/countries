const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

// feeling the base
//require('./_fillDb')();
const app = express();

const Country = require('./models/country');
const User = require('./models/user');

// database
const database = () => {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.set('debug', true);

    mongoose.connection
      .on('error', error => reject(error))
      .on('close', () => console.log('Database connection closed.'))
      .once('open', () => resolve(mongoose.connections[0]));

    mongoose.connect('mongodb://localhost/countries', { useNewUrlParser: true });
  });
};

// set
app.set('view engine', 'ejs');

// use
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  '/javascripts',
  express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);


let arrayOfCountriesAlreadyInDB;
Country.find({}).then(country => arrayOfCountriesAlreadyInDB = country.slice());


const recordInDb = [];


  // get requests
// main page
app.get('/', async (req, res) => {
  const id = await req.session.userId;
  const login = await req.session.userLogin;
  try {
    res.render('index', {
      valueOfSelect: 'default',
      valueOfInput: 'search',
      recordsFromDb: arrayOfCountriesAlreadyInDB,
      countriesLength: String(arrayOfCountriesAlreadyInDB.length),
      url: {},
      user: { id, login }
    });
  } catch (error) {
    throw new Error(error);
  }
});
app.get('/create', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;

  res.render('create', {
    recordsFromDb: arrayOfCountriesAlreadyInDB,
    countriesLength: String(arrayOfCountriesAlreadyInDB.length),
    valueOfSelect: 'default',
    valueOfInput: 'search',
    url: req.url,
    user: { id, login }
  });
})
app.get('/find', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;

  res.render('find', {
    recordsFromDb: arrayOfCountriesAlreadyInDB,
    countriesLength: String(arrayOfCountriesAlreadyInDB.length),
    country: recordInDb,
    valueOfSelect: 'default',
    valueOfInput: 'search',
    url: req.url,
    user: { id, login }
  });
});

app.get('/chat', (req, res) => {
  const id = req.session.userId;
  const login = req.session.userLogin;

  res.render('chat', {
    recordsFromDb: arrayOfCountriesAlreadyInDB,
    countriesLength: String(arrayOfCountriesAlreadyInDB.length),
    country: recordInDb,
    valueOfSelect: 'default',
    valueOfInput: 'search',
    url: req.url,
    user: { id, login }
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

app.post('/register', (req, res) => {
  const{ login, password } = req.body;
  
  User.findOne({
    login
  }).then(user => {
    if (!user) {
      bcrypt.hash(password, 10, (err, hash) => {
          User.create({
          login,
          password: hash
        }).then(user => {
            req.session.userId = user.id;
            req.session.userLogin = user.login;
            res.json({
              ok: true,
              message: 'пользователь успешно создан!',
            });
          })
          .catch(err => {
            console.log(err);
            res.json({
              ok: false,
              error: 'Ошибка, попробуйте позже!'
            });
          });
      });
    } else {
      res.json({
        ok: false,
        error: 'Имя занято!',
        fields: ['login']
      });
    }
  });
});

app.post('/login', async (req, res) => {
  const { login, password } = req.body;

  const user = await User.findOne({ login: login });

  try {
    if (!user) {
      res.json({
        ok: false,
        message: 'пользователь с таким именем не найден'
      })
    } else {
      bcrypt.compare(password, user.password, function(err, result) {
        if (!result) {
          res.json({
            ok: false,
            message: 'Логин и/или пароль неверны!',
          });
        } else {
          req.session.userId = user.id;
          req.session.userLogin = user.login;
          res.json({
            ok: true,
            message: 'Вы вошли как ' + user.login
          })
        }
      });
    }
  } catch (error) {
    console.log(error); 
  }
})

app.post('/create', async (req, res) => {
  const data = req.body;
  data.author = req.session.userLogin;

  const isInBaseYet = await Country.findOne({ country: data.country });

  if (!isInBaseYet) {
    try {
      const record = await Country.create(data);
      
      if(record){
        res.json({
          ok: true
        })
      }
    } catch (error) {
      res.json({
        ok: false,
        fields:req.body
      });
      throw new Error(error);
    }
  } else {
    res.json({
      ok: false,
      error: 'Такая запись уже есть в базе данных, проверьте данные'
    })
  }

  
})

app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.redirect('/');
    });
  } else {
    res.redirect('/');
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
