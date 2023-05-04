// ********************************************************
// * This file contains the routes for the user *
// * For example, home, profile, etc. *
// ********************************************************

const express = require('express'); // To build an application server or API
const app = express.Router();

// db import
const db = require('./userQueries');
const tripDB = require('../trip/tripQueries');

const getUserHistory = async (user_id) => {
    const data = {
        user_id: user_id
    };
    const dbResponse = await tripDB.getUserHistory(data);
    if (dbResponse.status === "success") {
        return dbResponse.data;
    } else {
        console.log("Error retrieving user history." + dbResponse.message + " " + dbResponse.error);
        return [];
    }
};

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
        return res.status(401).render('pages/login', {
          message: "Log in to view!"
        });
    }

    const friends = await getUserFriends(req.session.user.user_id);
    const history = await getUserHistory(req.session.user.user_id);

    // ! History of rides will need to be displayed here as well
    return res.status(200).render('pages/profile', {
        user: req.session.user,
        friends: friends,
        history: history
    }); 
});

app.get('/updateInfo', (req, res) => {
    // This checks if the user is logged in
    if (!req.session.user) {
        //console.log("Not logged in!");
        return res.status(401).render('pages/login', {
          message: "Log in to view!"
        });
    }

    return res.status(200).render('pages/updateInfo', {
        user: req.session.user
    });
});

// *****************************************************
// * API CRUD routes * //
// *****************************************************

app.post('/updateInfo', async (req, res) => {
    if (!req.session.user) { 
        return res.status(401).render('pages/login', {
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

app.post('/addFriend', async (req, res) => {
    if (!req.session.user) { 
        return res.status(400).render('pages/login', {
          message: "Log in to add a friend!"
        });
    }

    if (!req.body.username) {
        const friends = await getUserFriends(req.session.user.user_id);
        return res.status(400).render('pages/profile', {
            message: "Please enter a username.",
            user: req.session.user,
            friends: friends
        });
    }

    const data = {
        username: req.body.username,
        user_id: req.session.user.user_id
    }

    const dbResponse = await db.addFriend(data);

    if (dbResponse.status == "success") {
        return res.status(200).redirect('/user/profile');
    } else {
        const friends = await getUserFriends(req.session.user.user_id);
        console.log("Error while adding friend- " + dbResponse.error);
        return res.status(400).render('pages/profile', {
            message: dbResponse.message,
            user: req.session.user,
            friends: friends
        });
    }
});

app.post('/removeFriend', async (req, res) => {
    if (!req.session.user) { 
        return res.status(400).render('pages/login', {
          message: "Log in to remove a friend!"
        });
    }

    if (!req.body.user_id) {
        const friends = await getUserFriends(req.session.user.user_id);
        return res.status(400).render('pages/profile', {
            message: "Invalid user id. - Internal Server Error - Please try again later.",
            user: req.session.user,
            friends: friends
        });
    }

    const data = {
        friend_id: req.body.user_id,
        user_id: req.session.user.user_id
    }

    const dbResponse = await db.removeFriend(data);

    if (dbResponse.status == "success") {
        return res.status(200).redirect('/user/profile');
    } else {
        const friends = await getUserFriends(req.session.user.user_id);
        console.log("Error while removing friend - " + dbResponse.error);
        return res.status(400).render('pages/profile', {
            message: dbResponse.message,
            user: req.session.user,
            friends: friends
        });
    }
});

// *****************************************************
// * API Messaging routes * //
// *****************************************************



module.exports = app;
