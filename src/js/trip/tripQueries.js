const db = require('../dbConnection');

// * DB queries and logic * //

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


module.exports = {
  createTrip,
  updateTrip
};