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
  secret: 'XKIY1FsYZ4NV#WH$pbI8%5eBXTwjunxMUJDvx@eb0W7v7Bzt$E',
  resave: false,
  saveUninitialized: true
}));

// Middleware to check if user is authenticated
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

// Middleware to clear user session on logout
const clearUserSession = (req, res, next) => {
  if (req.path === '/logout') {
    req.session.user = undefined;
  }
  next();
};

// Add middleware to clear user session on logout
app.use(clearUserSession);

// Set up a route for the CSS file
app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/style.css'));
});

// Middleware to check if user is authenticated
app.use(isAuthenticated);

// Handle GET request for the login page
app.get('/login', (req, res) => {
  res.render('login');
});

// Handle POST request for the login form
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are valid
  if (username === 'admin' && password === 'password') {
    req.session.user = { username }; // Save the user in the session
    res.redirect('/'); // Redirect to the index page
  } else {
    res.send('Invalid username or password');
  }
});

// Handle GET request for the index page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Handle GET request for logout page
app.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/login');
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '')));

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
