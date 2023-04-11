// ********************************************************
// * This file contains the routes for the user *
// * For example, home, profile, etc. *
// ********************************************************

const express = require('express'); // To build an application server or API
const app = express.Router();
const session = require('express-session'); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require('bcrypt'); //  To hash passwords

app.get('/home', (req, res) => {
    // This checks if the user is logged in
    if (!req.session.user) {
        console.log("Not logged in!");
        return res.render('pages/login', {
          message: "Log in to view!"
        });
    }

    res.render('pages/home', {
        user: req.session.user
    }); 
});

module.exports = app;