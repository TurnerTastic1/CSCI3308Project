INSERT INTO users (username, password, home_address, phone) VALUES
('Jack', '$2a$12$O8To4sHwosWxK6eVpHp0Y.gAziMUaFkmeKf4mejzOh0C8s7dgof0G', '848 cleveland rd', '6302090010'),
('Turner', '$2a$12$O8To4sHwosWxK6eVpHp0Y.gAziMUaFkmeKf4mejzOh0C8s7dgof0G', '19 Broccoli rd', '6302090012'),
('Mia','$2a$12$O8To4sHwosWxK6eVpHp0Y.gAziMUaFkmeKf4mejzOh0C8s7dgof0G', '232 pear street', '6302090011');

INSERT INTO trips (user_id, departing, destination, purpose, time, seats) VALUES
(1, 'Boulder', 'red rocks', 'concert', 'Wed Mar 16 00:00:00 2016', 5),
(1, 'Boulder2', 'red rocks2', 'concert2', 'Wed Mar 16 00:00:00 2017', 2),
(2, 'Boulder3', 'red rocks3', 'concert3', 'Wed Mar 16 00:00:00 2018', 3);

INSERT INTO friends (user_id, friend_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(2, 3),
(3, 1),
(3, 2);

-- INSERT INTO messages (sender_id, receiver_id, message, date_sent) VALUES
-- (1, 2, 'hello', 'Wed Mar 16 00:00:00 2016'),
-- (1, 3, 'hello2', 'Wed Mar 16 00:00:00 2017'),
-- (2, 1, 'hello3', 'Wed Mar 16 00:00:00 2018'),
-- (2, 3, 'hello4', 'Wed Mar 16 00:00:00 2019'),
-- (3, 1, 'hello5', 'Wed Mar 16 00:00:00 2020'),
-- (3, 2, 'hello6', 'Wed Mar 16 00:00:00 2021');