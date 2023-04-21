
const db = require('../dbConnection');

// * DB queries and logic * //

const register = async (data) => {
  const query = `INSERT INTO users (username, password) VALUES ($1, $2) returning *;`;

  try {
      await db.one(query, [data.username, data.password]);
      return { status: "success", message: "User registered." };
    } catch (error) {
      return { status: "error", error: error, message: "Internal server error or username already exists." };
    }
};

const login = async (data) => {
    const query = `SELECT * FROM users WHERE username=$1 ;`;
    var user = '';

    try {
        const potentialUser = await db.one(query, [data.username]);
        
        if (potentialUser != undefined) {
          user = potentialUser;
          return { status: "success", message: "User found successfully.", user: user};
        } else {
          return { status: "error", message: "DB did not find user!" };
        }
      } catch (error) {
        console.log("Database error - " + error);
        return { status: "error", error: error, message: "Incorrect username or password. Please register an account." };
      }
};

//? We can create a function to query the database and use in the future for other routes


module.exports = {
    register,
    login
}