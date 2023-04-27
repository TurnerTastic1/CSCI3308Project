
const db = require('../dbConnection');

// * DB queries and logic * //

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

const getUserFriends = async (data) => {
  const friends = [];
  const params = [data.user_id];
  const relationQuery = `SELECT * FROM friends WHERE user_id=$1;`;

  try {
    const dbResponse = await db.any(relationQuery, params);
    const friendIDs = [];
    for (let i = 0; i < dbResponse.length; i++) {
      friendIDs.push(dbResponse[i].friend_id);
    }
    for (let i = 0; i < friendIDs.length; i++) {
      const query = `SELECT * FROM users WHERE user_id=$1;`;
      const params = [friendIDs[i]];
      const dbResponse = await db.one(query, params);
      friends.push(dbResponse);
    }
    return { status: "success", message: "User friends retrieved.", data: friends };
  } catch (error) {
    return { status: "error", error: error, message: "Error fetching friends from users_to_friends table." };
  }
};

// const addFriend = async (data) => {
//   const userSearchQuery = `SELECT * FROM users WHERE username=$1;`;
//   const searchParams = [data.username];

//   try {
//     const dbResponse = await db.one(userSearchQuery, searchParams);
//     const friend_id = dbResponse.user_id;
//     const query = `INSERT INTO friends (user_id, friend_id) VALUES ($1, $2);`;
//     const params = [data.user_id, friend_id];
//     await db.none(query, params);
//     return { status: "success", message: "Friend added." };
//   } catch (error) {
//     return { status: "error", error: error, message: "Internal server error." };
//   }
// };

module.exports = {
    userDataUpdate,
    getUserFriends
}