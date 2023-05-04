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

const testConnection = (verbose) => {
    db.connect()
        .then(obj => {
            if(verbose) console.log('Database connection successful'); // you can view this message in the docker compose logs
            obj.done(); // success, release the connection;
        })
        .catch(error => {
            console.log('ERROR:', error.message || error);
        });
}

testConnection(false);

module.exports = db;