package com.desk_sharing.repositories;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.desk_sharing.entities.Series;


public interface SeriesRepository extends JpaRepository<Series, Long> {
    @Query(
        value = ""
        + " WITH RECURSIVE days AS ( "
        + "     SELECT CAST(:startDate AS DATE) AS curr_Date "
        + "     UNION ALL "
        + "     SELECT DATE_ADD(curr_Date, INTERVAL 1 DAY) "
        + "     FROM days "
        + "     WHERE DATE_ADD(curr_Date, INTERVAL 1 DAY) <= CAST(:endDate AS DATE) "
        + " ) "
        + " SELECT curr_Date from days "
        ,nativeQuery = true
    )
    public List<Date> getDaily(
        @Param("startDate") Date startDate,
        @Param("endDate") Date endDate
    );

    /**
     * Calculates dates between [startDate, endDate] based on weekDay.
     * @param startDate The start of the interval.
     * @param endDate   The end of the interval.
     * @param weekDay   The week day. 0 = monday, ..., 4 = friday
     * @return   Calculated dates between [startDate, endDate] based on weekDay.
     */
    @Query(value = "SELECT DATE(DATE_ADD(:startDate, INTERVAL n DAY)) " +
    "FROM ( " + 
    "    SELECT (t * 10 + u) AS n " +
    "    FROM " +
    "        (SELECT 0 t UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t, " +
    "        (SELECT 0 u UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u " +
    ") numbers " +
    "WHERE DATE_ADD(:startDate, INTERVAL n DAY) <= :endDate " +
    "AND WEEKDAY(DATE_ADD(:startDate, INTERVAL n DAY)) = :weekDay " +
    "ORDER BY DATE(DATE_ADD(:startDate, INTERVAL n DAY)) ASC", 
    nativeQuery = true)
    List<java.sql.Date> findWeekdaysBetween(
        @Param("startDate") Date startDate, 
        @Param("endDate") Date endDate, 
        @Param("weekDay") int weekDay
    );

    @Query(value = "SELECT DATE(DATE_ADD(:startDate, INTERVAL (n * 4) WEEK)) " +
    "FROM ( " + 
    "    SELECT (t * 10 + u) AS n " +
    "    FROM " +
    "        (SELECT 0 t UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t, " +
    "        (SELECT 0 u UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) u " +
    ") numbers " +
    "WHERE DATE_ADD(:startDate, INTERVAL (n * 4) WEEK) <= :endDate " +
    "AND WEEKDAY(DATE_ADD(:startDate, INTERVAL (n * 4) WEEK)) = :weekDay", 
    nativeQuery = true)
    List<java.sql.Date> findWeekdaysEveryFourWeeks(
        @Param("startDate") Date startDate, 
        @Param("endDate") Date endDate, 
        @Param("weekDay") int weekDay
    );

    @Query(value="select * from series where user_id = :user_id ", nativeQuery = true)
    public List<Series> findByUserId(@Param("user_id") Integer user_id);
    @Query(value="select * from series where desk_id = :desk_id ", nativeQuery = true)
    public List<Series> findByDeskId(@Param("desk_id") Long desk_id);
}