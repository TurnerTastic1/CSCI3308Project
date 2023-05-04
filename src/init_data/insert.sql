INSERT INTO users (username, password, home_address, phone) VALUES
('Jack', '$2a$12$O8To4sHwosWxK6eVpHp0Y.gAziMUaFkmeKf4mejzOh0C8s7dgof0G', '848 cleveland rd', '6302090010'),
('Turner', '$2a$12$O8To4sHwosWxK6eVpHp0Y.gAziMUaFkmeKf4mejzOh0C8s7dgof0G', '19 Broccoli rd', '6302090012'),
('Mia','$2a$12$O8To4sHwosWxK6eVpHp0Y.gAziMUaFkmeKf4mejzOh0C8s7dgof0G', '232 pear street', '6302090011');

INSERT INTO trips (user_id, departing, departing_lat, departing_long, destination, destination_lat, destination_long, purpose, time, seats) VALUES
(1, 'University of Colorado Boulder, Boulder, Colorado, États-Unis', 40.00758099999999, -105.2659417, 'Red Rocks Park and Amphitheatre, West Alameda Parkway, Morrison, Colorado, États-Unis', 39.6655381, -105.2052116, 'Concert', '2023-04-22 19:10:25-07', 5),
(1, 'Breckenridge, Colorado, États-Unis', 39.4816537, -106.0383518, 'Downtown Littleton Station, South Rio Grande Street, Littleton, Colorado, États-Unis', 39.6119058, -105.0152241, 'Breck weekend ride back', '2023-05-14 09:10:25-07', 2),
(2, 'Longmont, Colorado, États-Unis', 40.1672068, -105.1019275, 'Denver International Airport (DEN), Peña Blvd, Denver, Colorado, États-Unis', 39.8563629, -104.6764131, 'Escape from Longmont', '2023-08-22 10:10:25-07', 3);

INSERT INTO friends (user_id, friend_id) VALUES
(1, 2),
(1, 3),
(2, 1),
(2, 3),
(3, 1),
(3, 2);

INSERT INTO messages (sender_id, receiver_id, message, date_sent) VALUES
(1, 2, 'hello', 'Wed Mar 16 00:00:00 2016'),
(1, 3, 'hello2', 'Wed Mar 16 00:00:00 2017'),
(2, 1, 'hello3', 'Wed Mar 16 00:00:00 2018'),
(2, 3, 'hello4', 'Wed Mar 16 00:00:00 2019'),
(3, 1, 'hello5', 'Wed Mar 16 00:00:00 2020'),
(3, 2, 'hello6', 'Wed Mar 16 00:00:00 2021');