DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL,
    home_address VARCHAR(100),
    phone VARCHAR(100)
);

DROP TABLE IF EXISTS trips CASCADE;
CREATE TABLE trips(
    trips_id SERIAL PRIMARY KEY NOT NULL,
    user_id SERIAL NOT NULL,
    departing CHAR(60) NOT NULL,
    destination CHAR(60) NOT NULL,
    purpose VARCHAR(200),
    time DATE NOT NULL,
    seats INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (user_id)
);