// ********************************************************
// * This file contains the routes for the user *
// * For example, home, profile, etc. *
// ********************************************************

const express = require('express'); // To build an application server or API
const app = express.Router();

// db import
const db = require('./userQueries');

// *****************************************************
// * Common functions * //
// *****************************************************

const getUserFriends = async (user_id) => {
    const data = {
        user_id: user_id
    };
    const dbResponse = await db.getUserFriends(data);
    if (dbResponse.status === "success") {
        return dbResponse.data;
    } else {
        console.log("Error retrieving user friends." + dbResponse.message + " " + dbResponse.error);
        return [];
    }
}

// *****************************************************
// * Page rendering routes * //
// *****************************************************

app.get('/profile', async (req, res) => {
    // This checks if the user is logged in
    if (!req.session.user) {
        //console.log("Not logged in!");
        return res.status(400).render('pages/login', {
          message: "Log in to view!"
        });
    }

    const friends = await getUserFriends(req.session.user.user_id);

    // ! History of rides will need to be displayed here as well
    return res.status(200).render('pages/profile', {
        user: req.session.user,
        friends: friends
    }); 
});

app.get('/updateInfo', (req, res) => {
    // This checks if the user is logged in
    if (!req.session.user) {
        //console.log("Not logged in!");
        return res.status(400).render('pages/login', {
          message: "Log in to view!"
        });
    }

    return res.status(200).render('pages/updateInfo', {
        user: req.session.user
    });
});

app.post('/updateInfo', async (req, res) => {
    if (!req.session.user) { 
        return res.status(400).render('pages/login', {
          message: "Log in to change user info!"
        });
    }
    // console.log("Updating user info...");

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
        req.session.save();
        
        return res.status(200).redirect('/user/profile');
    } else {
        const friends = await getUserFriends(req.session.user.user_id);
        console.log("Error while updating user info- " + dbResponse.error);
        return res.status(400).render('pages/profile', {
            message: dbResponse.message,
            user: req.session.user,
            friends: friends
        });
    }


});

module.exports = app;