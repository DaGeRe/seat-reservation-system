INSERT INTO parking_spots (spot_label, display_label, spot_type, active, covered, manually_blocked, charging_kw)
VALUES
    ('27', '27', 'STANDARD', 0, 0, 0, NULL),
    ('28', '28', 'STANDARD', 0, 0, 0, NULL),
    ('41', '41', 'STANDARD', 0, 0, 0, NULL),
    ('42', '42', 'STANDARD', 0, 0, 0, NULL),
    ('44', '44', 'STANDARD', 0, 0, 0, NULL),
    ('45', '45', 'STANDARD', 0, 0, 0, NULL),
    ('46', '46', 'STANDARD', 0, 0, 0, NULL)
ON DUPLICATE KEY UPDATE
    display_label = VALUES(display_label);
