// ********************************************************
// * This file contains the routes for the auth endpoints *
// * For example, login, register, etc. *
// ********************************************************

const express = require('express'); // To build an application server or API
const app = express.Router();
// const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords

// db import
const db = require('./authQueries');


app.post('/register', async (req, res) => {
    // * Input validation section * Logic is handled in this file
    if (!req.body.username || !req.body.password) {
      // console.log("Error - Missing username or password");
      return res.status(400).render('pages/register', {
        message: "Missing username or password!"
      });
    }

    const hash = await bcrypt.hash(req.body.password, 10);

    // * DB section * Logic is handled in the queries.js file
    const data = {
      username: req.body.username,
      password: hash,
      home_address: req.body.home_address,
      phone: req.body.phone
    };
    
    const dbResponse = await db.register(data);

    // * Response section * Logic is handled in this file
    if (dbResponse.status == "success") 
        return res.redirect('/login');
    else {
        console.log("Error - " + dbResponse.error);
        return res.status(400).render('pages/register', {
            message: dbResponse.message
        });
    }
});

app.post('/login', async (req, res) => {
    // * Input validation section * Logic is handled in this file
    if (!req.body.username || !req.body.password) {
        // console.log("Error - Missing username or password");
        return res.status(400).render('pages/login', {
          message: "Missing username or password!"
        });
      }
    

    // * DB section * Logic is handled in the queries.js file
    // Prepping data for DB
    const data = {
        username: req.body.username
    };
    // Querying DB
    const dbResponse = await db.login(data);
    // Check if user exists and assign user if no error
    if (dbResponse.status == "error") {
        return res.status(400, dbResponse.message).render('pages/register', {
          message: dbResponse.message
        });
    }

    const user = dbResponse.user;
    
    // * Password section * Logic is handled in this file
    // Password checking logic and session setting
    try {
        // check if password from request matches with password in DB
        const match = await bcrypt.compare(req.body.password, user.password);

        if (match) {
            //save user details in session like in lab 8
            req.session.user = user;
            req.session.save();
            
            return res.redirect('/user/profile');
        } else {
          console.log("Incorrect username or password. Please try again or register an account.");
            return res.status(400, 'Incorrect username or password').render('pages/login', {
                message: "Incorrect username or password. Please try again or register an account."
            });
        }
    } catch (error) {
      console.log("Login error: " + error);
      res.statusMessage = JSON.stringify(error);
      return res.status(400, JSON.stringify(error)).render('pages/register', {
        message: "Incorrect username or password. Please register an account."
      });
    }
});

app.get('/logout', (req, res) => {
  if (!req.session.user) {
    return res.status(401).render('pages/home', {
      message: "Can't logout if you arent logged in :)"
    });
  }

  req.session.destroy();
  res.status(200).render('pages/home', {
      message: "Logged out Successfully"
  });
});

module.exports = app;