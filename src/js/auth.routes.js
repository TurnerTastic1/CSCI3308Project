const express = require('express'); // To build an application server or API
const app = express.Router();
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords
const pgp = require('pg-promise')(); // To connect to the Postgres DB from the node server

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



    

app.post('/register', async (req, res) => {
    if (!req.body.username || !req.body.password) {
      console.log("Error - Missing username or password");
      return res.render('pages/register', {
        message: "Missing username or password!"
      });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const query = `INSERT INTO users (username, password) VALUES ($1, $2) returning *;`;

    try {
      await db.one(query, [req.body.username, hash]);
      return res.redirect('/login');
    } catch (error) {
      return res.render('pages/register', {
        message: "Internal server error or username already exists."
      });
    }
});

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

module.exports = app;