// ********************************************************
const express = require('express'); // To build an application server or API
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const db = require('./js/dbConnection');

// ********************************************************
app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    store: new (require('connect-pg-simple')(session))({
      pgPromise: db,
      createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    name: 'sessionid'
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// * Page rendering routes * //
app.get('/welcome', (req, res) => {
  res.status(200).json({status: "success", message: "Welcome!"});
});

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.get('/home', (req, res) => {
  res.render('pages/home');
});


// * Static resource routes * //
app.use('/images', express.static('resources/img'));
app.use('/styles', express.static('resources/css'));
app.use('/modal', express.static('js/modal'));
app.use('/maps', express.static('js/map'));


// *****************************************************
// * API routes * //
// * Importing the post routes * //
const authRoutes = require("./js/auth/auth.routes");
const userRoutes = require("./js/user/user.routes");
const tripRoutes = require("./js/trip/trip.routes");
const messageRoutes = require("./js/message/message.routes");

// * Routes for all authentication is localhost:3000/auth + the route located on auth.routes.js * //
// * For example, localhost:3000/auth/register will route to the register page * // 
app.use('/auth', authRoutes);

app.use('/user', userRoutes);

app.use('/trip', tripRoutes);

app.use('/message', messageRoutes);

// *****************************************************
// * starting the server and keeping the connection open to listen for more requests * //
try {
  module.exports = app.listen(3000);
  console.log('Server is listening on port 3000');
} catch (error) {
  console.log('Server failed to start: ' + error);
}



