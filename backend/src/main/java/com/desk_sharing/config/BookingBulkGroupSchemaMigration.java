package com.desk_sharing.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;

@Component
@AllArgsConstructor
public class BookingBulkGroupSchemaMigration {
    private static final Logger logger = LoggerFactory.getLogger(BookingBulkGroupSchemaMigration.class);
    private static final String TABLE_NAME = "bookings";
    private static final String COLUMN_NAME = "bulk_group_id";
    private static final String INDEX_NAME = "idx_bookings_bulk_group_id";

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void ensureBulkGroupColumn() {
        try {
            final Integer tableExists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.TABLES "
                    + "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?",
                Integer.class,
                TABLE_NAME
            );
            if (tableExists == null || tableExists == 0) {
                logger.info("Booking bulk-group schema migration skipped: table '{}' not found yet.", TABLE_NAME);
                return;
            }

            final Integer columnExists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.COLUMNS "
                    + "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?",
                Integer.class,
                TABLE_NAME,
                COLUMN_NAME
            );
            if (columnExists == null || columnExists == 0) {
                jdbcTemplate.execute(
                    "ALTER TABLE " + TABLE_NAME + " ADD COLUMN " + COLUMN_NAME + " VARCHAR(36) NULL"
                );
                logger.info("Booking bulk-group schema migration added '{}.{}'.", TABLE_NAME, COLUMN_NAME);
            }

            final Integer indexExists = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.STATISTICS "
                    + "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?",
                Integer.class,
                TABLE_NAME,
                INDEX_NAME
            );
            if (indexExists == null || indexExists == 0) {
                jdbcTemplate.execute(
                    "CREATE INDEX " + INDEX_NAME + " ON " + TABLE_NAME + " (" + COLUMN_NAME + ")"
                );
                logger.info("Booking bulk-group schema migration added index '{}'.", INDEX_NAME);
            }
        } catch (Exception ex) {
            logger.error("Booking bulk-group schema migration failed.", ex);
        }
    }
}
