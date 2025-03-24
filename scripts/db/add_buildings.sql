
-- https://www.justiz.sachsen.de/lit/kontakt-anschrift-anreise-3975.html
insert into mydatabase.buildings(name, town, address, used) values ('Außenstelle Zwickau', 'Zwickau', '', 'y');
insert into mydatabase.buildings(name, town, address, used) values ('Außenstelle Chemnitz', 'Chemnitz', '', 'y');
insert into mydatabase.buildings(name, town, address, used) values ('Außenstelle Leipzig', 'Leipzig', '', 'y');
insert into mydatabase.buildings(name, town, address, used) values ('Außenstelle Bautzen', 'Bautzen', '', 'y');
insert into mydatabase.buildings(name, town, address, used) values ('Außenstelle Görlitz', 'Görlitz', '', 'n');
insert into mydatabase.buildings(name, town, address, used) values ('Hauptstelle Dresden,  Bautzner Str.19a/b', 'Dresden', '', 'y');
insert into mydatabase.buildings(name, town, address, used) values ('Hauptstelle Dresden,  Bautzner Str.19c', 'Dresden', '', 'y');

-- Floors for 'Hauptstelle Dresden,  Bautzner Str.19c'
insert into mydatabase.floors(name, name_Of_Img, building_id, ordering) values ('1. Obergeschoss','1. Obergeschoss.png', (select building_id from buildings where name = 'Hauptstelle Dresden,  Bautzner Str.19c' limit 1), 0);
insert into mydatabase.floors(name, name_Of_Img, building_id, ordering) values ('2. Obergeschoss','2. Obergeschoss.png', (select building_id from buildings where name = 'Hauptstelle Dresden,  Bautzner Str.19c' limit 1), 1);
insert into mydatabase.floors(name, name_Of_Img, building_id, ordering) values ('3. Obergeschoss','3. Obergeschoss.png', (select building_id from buildings where name = 'Hauptstelle Dresden,  Bautzner Str.19c' limit 1), 2);

-- Floors for 'Hauptstelle Dresden,  Bautzner Str.19a/b'
insert into mydatabase.floors(name, name_Of_Img, building_id, ordering) values ('Erdgeschoss','Erdgeschoss.png', (select building_id from buildings where name = 'Hauptstelle Dresden,  Bautzner Str.19a/b' limit 1), 0);
insert into mydatabase.floors(name, name_Of_Img, building_id, ordering) values ('1. Obergeschoss','1. Obergeschoss.png', (select building_id from buildings where name = 'Hauptstelle Dresden,  Bautzner Str.19a/b' limit 1), 1);

-- Floors for 'Außenstelle Zwickau'
insert into mydatabase.floors(name, name_Of_Img, building_id, ordering) values ('Dachgeschoss','Dachgeschoss.png', (select building_id from buildings where name = 'Außenstelle Zwickau' limit 1), 0);

-- Floors for 'Außenstelle Chemnitz'
insert into mydatabase.floors(name, name_Of_Img, building_id, ordering) values ('2. Dachgeschoss','2. Dachgeschoss.png', (select building_id from buildings where name = 'Außenstelle Chemnitz' limit 1), 0);
insert into mydatabase.floors(name, name_Of_Img, building_id, ordering) values ('4. Dachgeschoss','4. Dachgeschoss.png', (select building_id from buildings where name = 'Außenstelle Chemnitz' limit 1), 1);

-- Floors for 'Außenstelle Leipzig'
insert into mydatabase.floors(name, name_Of_Img, building_id, ordering) values ('2. Dachgeschoss','2. Dachgeschoss.png', (select building_id from buildings where name = 'Außenstelle Leipzig' limit 1), 0);

-- Floors for 'Außenstelle Bautzen'
insert into mydatabase.floors(name, name_Of_Img, building_id, ordering) values ('1. Dachgeschoss','1. Dachgeschoss.png', (select building_id from buildings where name = 'Außenstelle Bautzen' limit 1), 0);

-- Update rooms for '1. Obergeschoss' in 'Hauptstelle Dresden,  Bautzner Str.19c'
update rooms set floor_id=(select floor_id from floors where name = '1. Obergeschoss' and building_id = (select building_id from buildings where name = 'Hauptstelle Dresden,  Bautzner Str.19c' limit 1) limit 1) where remark in ('Raum 150', 'Raum 152', 'Raum 153', 'Raum 154', 'Raum 156') and building = 'Bautzner Str. 19c';

-- Update rooms for '2. Obergeschoss' in 'Hauptstelle Dresden,  Bautzner Str.19c'
update rooms set floor_id=(select floor_id from floors where name = '2. Obergeschoss' and building_id = (select building_id from buildings where name = 'Hauptstelle Dresden,  Bautzner Str.19c' limit 1) limit 1) where remark in ('Raum 205', 'Raum 207', 'Raum 209', 'Raum 202', 'Raum 201', 'Raum 213', 'Raum 211', 'Raum 210')  and building = 'Bautzner Str. 19c';

-- Update rooms for '3. Obergeschoss' in 'Hauptstelle Dresden,  Bautzner Str.19c'
update rooms set floor_id=(select floor_id from floors where name = '3. Obergeschoss' and building_id = (select building_id from buildings where name = 'Hauptstelle Dresden,  Bautzner Str.19c' limit 1) limit 1) where remark in ('Raum 302', 'Raum 303', 'Raum 306', 'Raum 308')  and building = 'Bautzner Str. 19c';

-- Update rooms for 'Erdgeschoss' in 'Hauptstelle Dresden,  Bautzner Str.19a/b'
update rooms set floor_id=(select floor_id from floors where name = 'Erdgeschoss' and building_id = (select building_id from buildings where name = 'Hauptstelle Dresden,  Bautzner Str.19a/b' limit 1) limit 1) where remark in ('test_remark_room', 'Raum 010', 'Raum 007', 'Raum 027', 'Raum 028', 'Raum 044', 'Raum 033') and building = 'Bautzner Str. 19a/b';

-- Update rooms for '1. Obergeschoss' in 'Hauptstelle Dresden,  Bautzner Str.19a/b'
update rooms set floor_id=(select floor_id from floors where name = '1. Obergeschoss' and building_id = (select building_id from buildings where name = 'Hauptstelle Dresden,  Bautzner Str.19a/b' limit 1) limit 1) where remark in ('Raum 145','Raum 117','Raum 119','Raum 121','Raum 128','Raum 134','Raum 133') and building = 'Bautzner Str. 19a/b';

-- Update rooms for 'Dachgeschoss' in 'Außenstelle Zwickau'
update rooms set floor_id=(select floor_id from floors where name = 'Dachgeschoss' and building_id = (select building_id from buildings where name = 'Außenstelle Zwickau' limit 1) limit 1) where remark = '' and building = 'Zwickau';

-- Update rooms for '2. Dachgeschoss' in 'Außenstelle Chemnitz'
update rooms set floor_id=(select floor_id from floors where name = '2. Dachgeschoss' and building_id = (select building_id from buildings where name = 'Außenstelle Chemnitz' limit 1) limit 1) where remark in ('203', '206', '208', '212') and building = 'Chemnitz';

-- Update rooms for '4. Dachgeschoss' in 'Außenstelle Chemnitz'
update rooms set floor_id=(select floor_id from floors where name = '4. Dachgeschoss' and building_id = (select building_id from buildings where name = 'Außenstelle Chemnitz' limit 1) limit 1) where remark in ('410', '409') and building = 'Chemnitz';

-- Update rooms for '2. Dachgeschoss' in 'Außenstelle Leipzig'
update rooms set floor_id=(select floor_id from floors where name = '2. Dachgeschoss' and building_id = (select building_id from buildings where name = 'Außenstelle Leipzig' limit 1) limit 1) where remark in ('529', '502', '', '554') and building = 'Leipzig';

-- Update rooms for '1. Dachgeschoss' in 'Außenstelle Bautzen'
update rooms set floor_id=(select floor_id from floors where name = '1. Dachgeschoss' and building_id = (select building_id from buildings where name = 'Außenstelle Bautzen' limit 1) limit 1) where remark in ('366') and building = 'Bautzen';
