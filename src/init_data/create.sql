DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL,
    home_address VARCHAR(100),
    phone VARCHAR(100)
);


DROP TABLE IF EXISTS ride_History CASCADE;
CREATE TABLE ride_History(
    ride_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    start_address VARCHAR(100) NOT NULL,
    end_address VARCHAR(100) NOT NULL
);