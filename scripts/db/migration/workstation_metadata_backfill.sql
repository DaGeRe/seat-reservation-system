UPDATE desks
SET workstation_type = 'Standard'
WHERE workstation_type IS NULL OR workstation_type = '';

UPDATE desks
SET monitors_quantity = 1
WHERE monitors_quantity IS NULL;

UPDATE desks
SET desk_height_adjustable = 0
WHERE desk_height_adjustable IS NULL;

UPDATE desks
SET technology_docking_station = 0
WHERE technology_docking_station IS NULL;

UPDATE desks
SET technology_webcam = 0
WHERE technology_webcam IS NULL;

UPDATE desks
SET technology_headset = 0
WHERE technology_headset IS NULL;

UPDATE desks
SET special_features = ''
WHERE special_features IS NULL OR special_features = '';
