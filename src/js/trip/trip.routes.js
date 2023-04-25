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

const getUserTrips = async (user_id) => {
    const dbResponse = await db.getUserTrips(user_id);
    if (dbResponse.status === "success") {
        return dbResponse.data;
    } else {
        console.log("Error retrieving user trips." + dbResponse.message + " " + dbResponse.error);
        return [];
    }
}

app.get('/my_trips', async (req, res) => {
    if (!req.session.user) {
      return res.status(400).render('pages/login', {
        message: "Log in to view!"
      });
    }

    const trips = await getUserTrips(req.session.user.user_id);
    res.render('pages/my_trips', {
        apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
        data: trips
    });
  });

app.post('/createTrip', async (req, res) => {
    if (!req.session.user) {
        return res.status(400).render('pages/login', {
          message: "Log in to create a trip!"
        });
    }
    let trips = await getUserTrips(req.session.user.user_id);
    if (!req.body.departing || !req.body.destination || !req.body.time || !req.body.seats || !req.body.purpose) {
        return res.status(400).render('pages/my_trips', {
          message: "Please fill out all fields!",
          apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
          data: trips
        });
    }

    const data = {
        user_id: req.session.user.user_id,
        departing: req.body.departing,
        destination: req.body.destination,
        time: req.body.time,
        seats: req.body.seats,
        purpose: req.body.purpose
    }

    const dbResponse = await db.createTrip(data);
    trips = await getUserTrips(req.session.user.user_id);
    if (dbResponse.status === "error") {
        console.log(dbResponse.error);
        return res.status(400).render('pages/my_trips', {
            message: "Trip creation failed!",
            apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
            data: trips
        });
    } else {
        return res.status(200).render('pages/my_trips', {
            message: "Trip created!",
            apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
            data: trips
        })
    }
});


module.exports = app;