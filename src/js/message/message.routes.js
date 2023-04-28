// ********************************************************
// * This file contains the routes for the user *
// * For example, home, profile, etc. *
// ********************************************************

const express = require('express'); // To build an application server or API
const app = express.Router();

// db import
const db = require('./messageQueries');

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
};

const getUserMessages = async (user_id, username) => {
    const data = {
        user_id: user_id,
        username: username
    };
    const dbResponse = await db.getUserMessages(data);
    if (dbResponse.status === "success") {
        return dbResponse.data;
    } else {
        console.log("Error retrieving user messages." + dbResponse.message + " " + dbResponse.error);
        return [];
    }
};

// *****************************************************
// * Page rendering routes * //
// *****************************************************

app.get('/messages', async (req, res) => {
    // This checks if the user is logged in
    if (!req.session.user) {
        //console.log("Not logged in!");
        return res.status(400).render('pages/login', {
          message: "Log in to view!"
        });
    }
    const friends = await getUserFriends(req.session.user.user_id);
    const messages = await getUserMessages(req.session.user.user_id, req.session.user.username);

    return res.status(200).render('pages/messages/messages', {
        user: req.session.user,
        friends: friends,
        messages: messages
    }); 
});

module.exports = app;