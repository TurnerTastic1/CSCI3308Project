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

const getUserGroup = async (user_id, username, friend_id) => {
    const messages = await getUserMessages(user_id, username);

    let group = [];
    for (let i = 0; i < messages.length; i++) {
        if (messages[i][0].sender_id === friend_id && messages[i][0].receiver_id === user_id) {
            group = (messages[i]);
        } else if (messages[i][0].sender_id === user_id && messages[i][0].receiver_id === friend_id) {
            group = (messages[i]);
        }
    }
    return group;
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

app.post('/messages/startNew', async (req, res) => {
    // This checks if the user is logged in
    if (!req.session.user) {
        //console.log("Not logged in!");
        return res.status(400).render('pages/login', {
          message: "Log in to view!"
        });
    }

    if (req.body.username == '') return res.redirect('/message/messages');
    
    if (req.body.username == req.session.user.username) return res.redirect('/message/messages');

    const data = {
        username: req.body.username
    }

    const dbResponse = await db.getUserByUsername(data);

    if (dbResponse.status === "error") {
        console.log("Error retrieving user." + dbResponse.message + " " + dbResponse.error);
        return res.redirect('/message/messages');
    }

    const sendData = {
        sender_id: req.session.user.user_id,
        receiver_id: dbResponse.data.user_id,
        message: "Hello there!",
        date_sent: new Date()
    };

    const dbResponse2 = await db.sendMessage(sendData);

    if (dbResponse2.status === "error") console.log("Error sending message." + dbResponse2.message + " " + dbResponse2.error);
    return res.redirect('/message/messages');
});

app.post('/messages/discuss', async (req, res) => {
    // This checks if the user is logged in
    if (!req.session.user) {
        //console.log("Not logged in!");
        return res.status(400).render('pages/login', {
          message: "Log in to view!"
        });
    }

    const messages = JSON.parse(req.body.message_data);

    return res.status(200).render('pages/messages/discuss', {
        user: req.session.user,
        messages: messages
    }); 
});

app.post('/messages/send', async (req, res) => {
    // This checks if the user is logged in
    if (!req.session.user) {
        //console.log("Not logged in!");
        return res.status(400).render('pages/login', {
          message: "Log in to view!"
        });
    }
    
    let receiver_data = JSON.parse(req.body.message_group);
    
    if (receiver_data[0].sender_id == req.session.user.user_id) {
        receiver_data = receiver_data[0].receiver_data;
    } else {
        receiver_data = receiver_data[0].sender_data;
    }
    
    const data = {
        sender_id: req.session.user.user_id,
        receiver_id: receiver_data.user_id,
        message: req.body.MessageToSend,
        date_sent: new Date()
    };

    const dbResponse = await db.sendMessage(data);
    const messages = await getUserGroup(req.session.user.user_id, req.session.user.username, receiver_data.user_id);
    
    if (dbResponse.status === "success") {
        return res.status(200).render('pages/messages/discuss', {
            user: req.session.user,
            messages: messages
        });
    } else {
        console.log("Error sending message." + dbResponse.message + " " + dbResponse.error);
        const friends = await getUserFriends(req.session.user.user_id);
        const messages = await getUserMessages(req.session.user.user_id, req.session.user.username);
        return res.status(400).render('pages/messages/messages', {
            user: req.session.user,
            friends: friends,
            messages: messages,
            message: "Error sending message."
        });
    }
});

module.exports = app;
