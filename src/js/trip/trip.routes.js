// ********************************************************
// * This file contains the routes for the Trips *
// * For example, create, update, join, etc. *
// ********************************************************

const express = require('express'); // To build an application server or API
const app = express.Router();
const db = require('./tripQueries');

// ********************************************************
// * Static resource routes * //
// ********************************************************

app.use('/images', express.static('resources/img'));
app.use('/styles', express.static('resources/css'));
app.use('/modal', express.static('js/modal'));

// *****************************************************
// * Common functions * //
// *****************************************************

const getUserTrips = async (user_id) => {
    const data = {
        user_id: user_id
    };
    const dbResponse = await db.getUserTrips(data);
    if (dbResponse.status === "success") {
        return dbResponse.data;
    } else {
        console.log("Error retrieving user trips." + dbResponse.message + " " + dbResponse.error);
        return [];
    }
};

const getAllTrips = async (user_id) => {
    const data = {
        user_id: user_id
    }
    const dbResponse = await db.getAllTrips(data);
    if (dbResponse.status === "success") {
        return dbResponse.data;
    } else {
        console.log("Error retrieving all trips." + dbResponse.message + " " + dbResponse.error);
        return [];
    }
};

// *****************************************************
// * Page rendering routes * //
// *****************************************************

app.get('/transit', async (req, res) => {
    if (!req.session.user) {
      return res.status(400).render('pages/login', {
        message: "Log in to view!"
      });
    }
    const trips = await getAllTrips(req.session.user.user_id);
    res.render('pages/transit', {
        apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
        data: trips
    });
});

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

app.post('/editTrips', async (req, res) => {
    // This checks if the user is logged in
    if (!req.session.user) {
        //console.log("Not logged in!");
        return res.status(400).render('pages/login', {
          message: "Log in to view!"
        });
    }
    const id = req.body.tripID;
    // console.log(id);
    return res.status(200).render('pages/edit_trip', {
        user: req.session.user,
        tripID: id
    });
});

// *****************************************************
// * Trip crud routes * //
// *****************************************************

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

app.post('/updateTrip', async (req, res) => {
    if (!req.session.user) {
        return res.status(400).render('pages/login', {
          message: "Log in to update a trip!"
        });
    }
    let trips = await getUserTrips(req.session.user.user_id);

    let data = {
        trip_id: req.body.tripID,
    }

    const currentTrip = await db.getTripByID(data);

    if (currentTrip.status === "error") {
        console.log(currentTrip);
        return res.status(400).render('pages/my_trips', {
            message: currentTrip.message,
            apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
            data: trips
        });
    }

    // * Seat validation * //
    if (req.body.seats == "Select a number") {
        req.body.seats = currentTrip.data.seats;
    }

    data = {
        trip_id: req.body.tripID,
        user_id: req.session.user.user_id,
        departing: req.body.departing || currentTrip.data.departing,
        destination: req.body.destination || currentTrip.data.destination,
        time: req.body.time || currentTrip.data.time,
        seats: req.body.seats || currentTrip.data.seats,
        purpose: req.body.purpose || currentTrip.data.purpose
    }

    const dbResponse = await db.updateTrip(data);

    if (dbResponse.status === "error") {
        console.log(dbResponse.error);
        return res.status(400).render('pages/my_trips', {
            message: "Trip update failed!",
            apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
            data: trips
        });
    } else {
        trips = await getUserTrips(req.session.user.user_id);
        return res.status(200).render('pages/my_trips', {
            message: "Trip updated!",
            apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
            data: trips
        })
    }
});

app.post('/deleteTrip', async (req, res) => {
    if (!req.session.user) {
        return res.status(400).render('pages/login', {
          message: "Log in to delete a trip!"
        });
    }
    
    let trips = await getUserTrips(req.session.user.user_id);

    if (!req.body.tripID) {
        return res.status(400).render('pages/my_trips', {
            message: "Internal server error! - No trip ID recieved",
            apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
            data: trips
        });
    }    

    // * Package data to send to db * //
    const data = {
        trip_id: req.body.tripID
    };
    const dbResponse = await db.deleteTrip(data);

    if (dbResponse.status === "error") {
        console.log(dbResponse.error);
        return res.status(400).render('pages/my_trips', {
            message: "Trip deletion failed!",
            apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
            data: trips
        });
    }

    trips = await getUserTrips(req.session.user.user_id);
    return res.render('pages/my_trips', {
        message: "Trip deleted!",
        apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
        data: trips
    })


});

// *****************************************************
// * Trip interaction routes * //
// *****************************************************

app.post('/joinTrip', async (req, res) => {
    if (!req.session.user) {
        return res.status(400).render('pages/login', {
          message: "Log in to join a trip!"
        });
    }
    let trips = await getAllTrips(req.session.user.user_id);
    let data = {
        trip_id: req.body.tripID,
        user_id: req.session.user.user_id
    }

    const dbResponse = await db.addRiderToTrip(data);

    if (dbResponse.status === "error") {
        console.log(dbResponse.error);
        return res.status(400).render('pages/transit', {
            message: dbResponse.message,
            apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
            data: trips
        });
    } else {
        trips = await getAllTrips(req.session.user.user_id);
        return res.status(200).render('pages/transit', {
            message: "Trip joined!",
            apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
            data: trips
        })
    }
});

app.post('/leaveTrip', async (req, res) => {
    if (!req.session.user) {
        return res.status(400).render('pages/login', {
          message: "Log in to leave a trip!"
        });
    }
    let trips = await getUserTrips(req.session.user.user_id);
    let data = {
        trip_id: req.body.tripID,
        user_id: req.session.user.user_id
    }

    const dbResponse = await db.removeRiderFromTrip(data);

    if (dbResponse.status === "error") {
        console.log("Error deleting trip from DB" + dbResponse.error);
        return res.status(400).render('pages/my_trips', {
            message: dbResponse.message,
            apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
            data: trips
        });
    } else {
        trips = await getUserTrips(req.session.user.user_id);
        return res.status(200).render('pages/my_trips', {
            message: "Trip left!",
            apikey: process.env.JUNNG_KIM_GOOGLE_MAP_API,
            data: trips
        })
    }
});

module.exports = app;
