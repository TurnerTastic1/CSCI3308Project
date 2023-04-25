// ********************************************************
// * This file contains the routes for the Trips *
// * For example, create, update, join, etc. *
// ********************************************************

const express = require('express'); // To build an application server or API
const app = express.Router();

const db = require('./tripQueries');

// *****************************************************
// * Page rendering routes * //
// *****************************************************


app.post('/createTrip', (req, res) => {
    if (!req.session.user) {
        return res.status(400).render('pages/login', {
          message: "Log in to create a trip!"
        });
    }

    if (!req.body.departing || !req.body.destination || !req.body.time || !req.body.seats || !req.body.purpose) {
        return res.status(400).render('pages/my_trips', {
          message: "Please fill out all fields!",
          apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API
        });
    }

    return res.status(200).render('pages/my_trips', {
        message: "Trip created!",
        apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API
    })
});


module.exports = app;