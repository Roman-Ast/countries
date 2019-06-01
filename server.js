const express = require('express');
const bodyParser = require('body-parser');
const server = express();

const arr = ['Hello', 'World', '!'];
// use
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

// set
server.set('view engine', 'ejs');

// get requests
server.get('/', (req, res) => res.render('index', { arr: arr }));
server.get('/send', (req, res) => {
  res.render('send');
});

// post requests
server.post('/send', (req, res) => {
  arr.push(req.body.text);
  res.redirect('/');
});

// listening port
server.listen(5000, () => console.log('Server is started on port 5000!'));
