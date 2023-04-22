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
    console.log(req.session.user);
    if (!req.session.user) {
        //console.log("Not logged in!");
        return res.status(400).render('pages/login', {
          message: "Log in to view!"
        });
    }

    // ! History of rides will need to be displayed here as well
    return res.status(200).render('pages/profile', {
        user: req.session.user
    }); 
});

app.put('/updateInfo', async (req, res) => {
    if (!req.session.user) {
        //console.log("Not logged in!");
        return res.status(400).render('pages/login', {
          message: "Log in to change user info!"
        });
    }

    const data = {
        username: req.body.username || req.session.user.username,
        home_address: req.body.home_address || req.session.user.home_address,
        phone: req.body.phone || req.session.user.phone,
        user_id: req.session.user.user_id
    }

    const dbResponse = await db.userDataUpdate(data);

    if (dbResponse.status == "success") {
        req.session.user.username = data.username;
        req.session.user.home_address = data.home_address;
        req.session.user.phone = data.phone;
        return res.status(200).redirect('/user/profile');
    } else {
        console.log("Error while updating user info- " + dbResponse.error);
        return res.status(400).render('pages/profile', {
            message: dbResponse.message
        });
    }


});
module.exports = app;