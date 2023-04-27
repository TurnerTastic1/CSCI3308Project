const db = require('../dbConnection');

// * DB queries and logic * //

const getAllTrips = async (data) => {
    // get all trips that user has not created nor is a part of
    const query = `SELECT * FROM trips WHERE user_id != $1;`;
    const params = [data.user_id];
    try {
        const dbResponse = await db.any(query, params);
        const filteredResponse = [];
        for (let i = 0; i < dbResponse.length; i++) {
            const trip_id = dbResponse[i].trip_id;
            const query = `SELECT * FROM users_to_trips WHERE trip_id = $1 AND user_id = $2 ;`;
            const params = [trip_id, data.user_id];
            const dbResponse2 = await db.any(query, params);

            if (dbResponse2.length === 0) filteredResponse.push(dbResponse[i]);
        }
        return { status: "success", message: "All trips retrieved.", data: filteredResponse };
    } catch (error) {
        return { status: "error", error: error, message: "Internal server error." };
    }
}

const getTripByID = async (data) => {
    const query = `SELECT * FROM trips WHERE trip_id=$1;`;
    const params = [data.trip_id];
    
    try {
        const dbResponse = await db.one(query, params);
        return { status: "success", message: "Trip retrieved.", data: dbResponse };
    } catch (error) {
        return { status: "error", error: error, message: "Internal server error." };
    }
}

const getUserTrips = async (data) => {
    const trips = [];
    const params = [data.user_id];
    const relationQuery = `SELECT * FROM users_to_trips WHERE user_id=$1;`;

    try {
        const dbResponse = await db.any(relationQuery, params);
        const tripIDs = [];
        for (let i = 0; i < dbResponse.length; i++) {
            tripIDs.push(dbResponse[i].trip_id);
        }
        for (let i = 0; i < tripIDs.length; i++) {
            const query = `SELECT * FROM trips WHERE trip_id=$1;`;
            const params = [tripIDs[i]];
            const dbResponse = await db.one(query, params);
            trips.push(dbResponse);
        }
    } catch (error) {
        return { status: "error", error: error, message: "Error fetching trips from users_to_trips table." };
    }

    const query = `SELECT * FROM trips WHERE user_id=$1;`;
    try {
        const dbResponse = await db.any(query, params);
        for (let i = 0; i < dbResponse.length; i++) {
            trips.push(dbResponse[i]);
        }
        return { status: "success", message: "User trips retrieved.", data: trips };
    } catch (error) {
        return { status: "error", error: error, message: "Error fetching trips from trip table." };
    }
}

const createTrip = async (data) => {
  const query = `INSERT INTO trips (user_id, departing, destination, time, seats, purpose) VALUES ($1, $2, $3, $4, $5, $6) returning *;`;
  const params = [data.user_id, data.departing, data.destination, data.time, data.seats, data.purpose];
  
  try {
      await db.one(query, params);
      return { status: "success", message: "Trip created." };
  } catch (error) {
      return { status: "error", error: error, message: "Internal server error." };
  }
};

const updateTrip = async (data) => {
  const query = `UPDATE trips SET user_id=$2, departing=$3, destination=$4, time=$5, seats=$6, purpose=$7 WHERE trip_id=$1 returning *;`;
  const params = [data.trip_id, data.user_id, data.departing, data.destination, data.time, data.seats, data.purpose];

  try {
    await db.one(query, params);
    return { status: "success", message: "Trip updated." };
  } catch (error) {
    return { status: "error", error: error, message: "Internal server error." };
  }
};

const deleteTrip = async (data) => {
    const query = `DELETE FROM trips WHERE trip_id=$1 returning *;`;
    const params = [data.trip_id];

    try {
        await db.one(query, params);
        return { status: "success", message: "Trip deleted." };
    } catch (error) {
        return { status: "error", error: error, message: "Internal server error." };
    }
};

const addRiderToTrip = async (data) => {
  const query = `INSERT INTO users_to_trips (user_id, trip_id) VALUES ($1, $2) returning *;`
  const params = [data.user_id, data.trip_id];

  const updateQuery = `UPDATE trips SET seats=seats-1 WHERE trip_id=$1 returning *;`
  try {
    await db.one(query, params);
    await db.one(updateQuery, [data.trip_id]);
    return { status: "success", message: "Rider added to trip." };
  } catch (error) {
      return { status: "error", error: error, message: "Error adding user to join table." };
  }
}

const getRidersForTrip = async (data) => {
  const query = `SELECT * FROM users_to_trips WHERE trip_id=$1`;
  const params = [data.trip_id];

  db.any(query, params)
    .then(data => {
      return data;
    }).catch(error => {
      return { status: "error", error: error, message: "Riders from trip request failed, all is doomed! Panic!" };
    });
}

// const getTripsForRider = async (data) => {
//   const query = `SELECT * FROM users_to_trips WHERE user_id=$1`;
//   const params = [data.user_id];

//   db.any(query, params)
//     .then(data => {
//       return data;
//     }).catch(error => {
//       return { status: "error", error: error, message: "Trips from rider request failed, all is doomed! Panic!" };
//     });
// }

const removeRiderFromTrip = async (data) => {
  const query = `DELETE FROM users_to_trips WHERE user_id=$1 AND trip_id=$2;`
  const params = [data.user_id, data.trip_id];

    const updateQuery = `UPDATE trips SET seats=seats+1 WHERE trip_id=$1 returning *;`
  try {
    await db.any(query, params);
    await db.one(updateQuery, [data.trip_id]);
    return { status: "success", message: "Rider removed from trip." };
  } catch (error) {
      return { status: "error", error: error, message: "Internal server error." };
  }
}

module.exports = {
  getAllTrips,
  getTripByID,
  createTrip,
  updateTrip,
  deleteTrip,
  getUserTrips,
  addRiderToTrip,
  getRidersForTrip,
  removeRiderFromTrip
};
