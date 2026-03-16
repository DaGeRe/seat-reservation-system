-- Scheduled blockings table and new desk columns for time-based blocking
-- Run after defect_management.sql

CREATE TABLE IF NOT EXISTS `scheduled_blockings` (
  `scheduled_blocking_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `defect_id` bigint(20) NOT NULL,
  `desk_id` bigint(20) NOT NULL,
  `start_date_time` datetime NOT NULL,
  `end_date_time` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'SCHEDULED',
  `created_at` datetime NOT NULL,
  `created_by_id` int(11) NOT NULL,
  PRIMARY KEY (`scheduled_blocking_id`),
  KEY `fk_sb_defect` (`defect_id`),
  KEY `fk_sb_desk` (`desk_id`),
  KEY `fk_sb_created_by` (`created_by_id`),
  KEY `idx_sb_status_start` (`status`, `start_date_time`),
  KEY `idx_sb_status_end` (`status`, `end_date_time`),
  CONSTRAINT `fk_sb_defect` FOREIGN KEY (`defect_id`) REFERENCES `defects` (`defect_id`),
  CONSTRAINT `fk_sb_desk` FOREIGN KEY (`desk_id`) REFERENCES `desks` (`desk_id`),
  CONSTRAINT `fk_sb_created_by` FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- New desk columns for scheduled blocking tracking
ALTER TABLE `desks` ADD COLUMN IF NOT EXISTS `blocked_end_date_time` datetime DEFAULT NULL;
ALTER TABLE `desks` ADD COLUMN IF NOT EXISTS `blocked_by_scheduled_blocking_id` bigint(20) DEFAULT NULL;
