// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require('express'); // To build an application server or API
const app = express();
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server
const bodyParser = require('body-parser');
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const axios = require('axios'); // To make HTTP requests from our server. We'll learn more about it in Part B.

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// database configuration
const dbConfig = {
  host: 'db', // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then(obj => {
    console.log('Database connection successful'); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR:', error.message || error);
  });

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
import authRoutes from "./js/auth.routes";

// *****************************************************
// <!-- Section 4 : API Routes -->
// *****************************************************

// TODO - Include your API routes here

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

app.use('/', authRoutes);

app.post('/login', async (req, res) => {

    const query = `SELECT * FROM users WHERE username=$1 ;`;
    var user = '';

    try {
      const data = await db.one(query, [req.body.username]);
      
      if (data != undefined) {
        user = data;
      } else {
        return console.log("DB did not find user!");
      }
    } catch (error) {
      console.log("Database error - " + error);
      return res.render('pages/register', {
        message: "Incorrect username or password. Please register an account."
      });
    }
    
    try {
        // check if password from request matches with password in DB
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            //save user details in session like in lab 8
            req.session.user = user;
            req.session.save();

            return res.redirect('/home');
        }
    } catch (error) {
        console.log("Login error: " + error);
        return res.render('pages/register', {
          message: "Incorrect username or password. Please register an account."
        });
    }
});

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
})

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests
app.listen(3000);
console.log('Server is listening on port 3000');