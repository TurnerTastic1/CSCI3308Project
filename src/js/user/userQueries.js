
const db = require('../dbConnection');

// * DB queries and logic * //

// ? testing database connection from multiple db controllers
// Unused in this project but useful for testing
// Parameters: data = {username: "username"}
// const userInfo = async (data) => {
//     const query = `SELECT * FROM users WHERE username=$1 ;`;
//     var user = '';

//     try {
//         const potentialUser = await db.one(query, [data.username]);
        
//         if (potentialUser != undefined) {
//           user = potentialUser;
//           user.username = user.username + " from userQueries.js";
//           return { status: "success", message: "User found successfully.", user: user};
//         } else {
//           return { status: "error", message: "DB did not find user!" };
//         }
//       } catch (error) {
//         console.log("Database error - " + error);
//         return { status: "error", error: error, message: "Internal DB error and user not found" };
//       }
// }

const userDataUpdate = async (data) => {
  const query = `UPDATE users SET username=$1, home_address=$2, phone=$3 WHERE user_id=$4 returning *;`;
  const params = [data.username, data.home_address, data.phone, data.user_id];

  try {
    await db.one(query, params);
    return { status: "success", message: "User updated." };
  } catch (error) {
    return { status: "error", error: error, message: "Internal server error." };
  }
};

module.exports = {
    userDataUpdate
}