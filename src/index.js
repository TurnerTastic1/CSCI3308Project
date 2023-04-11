// ********************************************************
const express = require('express'); // To build an application server or API
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.

// ********************************************************
app.set('view engine', 'ejs'); // set the view engine to EJS
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// * Page rendering routes * //
app.get('/', (req, res) => {
    res.redirect('/login')
});

app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

// *****************************************************
// * API routes * //
// * Importing the post routes * //
const authRoutes = require("./js/auth/auth.routes");
const userRoutes = require("./js/user/user.routes");
const apiRoutes = require("./js/services/api.service");

// * Routes for all authentication is localhost:3000/auth + the route located on auth.routes.js * //
// * For example, localhost:3000/auth/register will route to the register page * // 
app.use('/auth', authRoutes);

app.use('/user', userRoutes);

// app.use('/api', apiRoutes);


// *****************************************************
// * starting the server and keeping the connection open to listen for more requests * //
try {
  app.listen(3000);
  console.log('Server is listening on port 3000');
} catch (error) {
  console.log('Server failed to start: ' + error);
}
