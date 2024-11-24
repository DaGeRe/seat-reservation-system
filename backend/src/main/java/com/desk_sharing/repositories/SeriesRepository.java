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

    @Query(
        value = ""
        + " WITH RECURSIVE days AS ( "
        + "     SELECT CAST(:startDate AS DATE) AS curr_Date "
        + "     UNION ALL "
        + "     SELECT DATE_ADD(curr_Date, INTERVAL 1 WEEK) "
        + "     FROM days "
        + "     WHERE DATE_ADD(curr_Date, INTERVAL 1 WEEK) <= CAST(:endDate AS DATE) "
        + " ) "
        + " SELECT curr_Date from days "
        ,nativeQuery = true
    )
    public List<Date> getWeekly(
        @Param("startDate") Date startDate,
        @Param("endDate") Date endDate
    );

    @Query(
        value = ""
        + " WITH RECURSIVE days AS ( "
        + "     SELECT CAST(:startDate AS DATE) AS curr_Date "
        + "     UNION ALL "
        + "     SELECT DATE_ADD(curr_Date, INTERVAL 1 MONTH) "
        + "     FROM days "
        + "     WHERE DATE_ADD(curr_Date, INTERVAL 1 MONTH) <= CAST(:endDate AS DATE) "
        + " ) "
        + " SELECT curr_Date from days "
        ,nativeQuery = true
    )
    public List<Date> getMonthly(
        @Param("startDate") Date startDate,
        @Param("endDate") Date endDate
    );
}