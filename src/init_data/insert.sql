INSERT INTO users (username, password, home_address, phone) VALUES
('Jack', '$2a$12$O8To4sHwosWxK6eVpHp0Y.gAziMUaFkmeKf4mejzOh0C8s7dgof0G', '848 cleveland rd', '6302090010'),
('Turner', '$2a$12$O8To4sHwosWxK6eVpHp0Y.gAziMUaFkmeKf4mejzOh0C8s7dgof0G', '19 Broccoli rd', '6302090012'),
('Mia','$2a$12$O8To4sHwosWxK6eVpHp0Y.gAziMUaFkmeKf4mejzOh0C8s7dgof0G', '232 pear street', '6302090011');

INSERT INTO trips (user_id, departing, destination, purpose, time, seats) VALUES
(1, 'Boulder', 'red rocks', 'concert', 'Wed Mar 16 00:00:00 2016', 5),
(1, 'Boulder2', 'red rocks2', 'concert2', 'Wed Mar 16 00:00:00 2017', 2),
(2, 'Boulder3', 'red rocks3', 'concert3', 'Wed Mar 16 00:00:00 2018', 3);