// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

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

// Importing the post routes
const authRoutes = require("./js/auth.routes");

// *****************************************************
// <!-- Section 4 : API Routes -->
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

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.render('pages/login', {
        message: "Logged out Successfully"
    });
});

// * API routes * //

//? Route for all authroutes is localhost:3000/auth + the route located on auth.routes.js
// For example, localhost:3000/auth/register will route to the register page
app.use('/auth', authRoutes);


/**
 * This is the route to the discover page
 * It will make a call to the TicketMaster API
 * and display the results on the page
 */
app.get('/home', (req, res) => {
    // This checks if the user is logged in
    if (!req.session.user) {
        console.log("Not logged in!");
        return res.render('pages/login', {
          message: "Log in to view!"
        });
    }
    res.render('pages/home'); 
});

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');