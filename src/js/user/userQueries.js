
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

module.exports = {
    userDataUpdate
}