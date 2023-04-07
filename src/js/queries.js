//! File used for common DB queries and DB setup is ONLY done here

const pgp = require('pg-promise')();

//? database configuration and connection
const dbConfig = {
    host: 'db', // the database server
    port: 5432, // the database port
    database: process.env.POSTGRES_DB, // the database name
    user: process.env.POSTGRES_USER, // the user account to connect with
    password: process.env.POSTGRES_PASSWORD, // the password of the user account
};
  
const db = pgp(dbConfig);
  
// test your database
db.connect()
    .then(obj => {
        console.log('Database connection successful'); // you can view this message in the docker compose logs
        obj.done(); // success, release the connection;
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
    });

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