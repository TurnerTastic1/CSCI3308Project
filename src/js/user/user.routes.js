// ********************************************************
// * This file contains the routes for the user *
// * For example, home, profile, etc. *
// ********************************************************

const express = require('express'); // To build an application server or API
const app = express.Router();

// db import
const db = require('./userQueries');

// *****************************************************
// * Page rendering routes * //
// *****************************************************

// ! This is testing the DB connection ! //
app.get('/profile', async (req, res) => {
    // This checks if the user is logged in
    if (!req.session.user) {
        console.log("Not logged in!");
        return res.render('pages/login', {
          message: "Log in to view!"
        });
    }
    console.log(req.session.user);

    res.render('pages/profile', {
        user: req.session.user
    }); 
});

module.exports = app;