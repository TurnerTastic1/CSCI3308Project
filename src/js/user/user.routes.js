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
    
    // Prepping data for DB
    const data = {
        username: req.session.user.username
    };
    // Querying DB
    const dbResponse = await db.userInfo(data);
    // Check if user exists and assign user if no error
    if (dbResponse == undefined) {
        return res.render('pages/profile', {
            user: "No user found!"
        });
    }

    res.render('pages/profile', {
        user: dbResponse.user
    }); 
});

module.exports = app;