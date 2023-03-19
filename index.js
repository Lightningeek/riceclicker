const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const session = require('express-session');

app.use(session({
  secret: process.env['KEY'],
  resave: false,
  saveUninitialized: true
}));

const isAuthenticated = (req, res, next) => {
  const { user } = req.session;

  if (user) {
    next();
  } else {
    if (req.originalUrl !== '/login') {
      res.redirect('/login');
    } else {
      next();
    }
  }
};

const clearUserSession = (req, res, next) => {
  if (req.path === '/logout') {
    req.session.user = undefined;
  }
  next();
};

app.use(clearUserSession);

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/style.css'));
});

app.use(isAuthenticated);

app.get('/login', (req, res) => {
  res.render('login');
});

// Handle POST request for the login form
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === process.env['USERNAME'] && password === process.env['PASSWORD']) {
    req.session.user = { username }; 
    res.redirect('/');
  } else {
    res.send('Invalid username or password');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/login');
});

app.use(express.static(path.join(__dirname, '')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
