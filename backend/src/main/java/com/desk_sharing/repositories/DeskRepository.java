package com.desk_sharing.repositories;

import com.desk_sharing.entities.Desk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

public interface DeskRepository extends JpaRepository<Desk, Long> {
    List<Desk> findByRoomId(Long roomId);
    @Query(value=""
    + "select * from desks "
    ,nativeQuery=true)
    public List<Desk> foo();
/*     @Query(value="select * from desks where room_id=:roomId", nativeQuery = true)
	List<Desk> getBookingForDate(@Param("roomId") Long roomId); */

/*     @Query(value = 
    "SELECT distinct * FROM desks d0 " +
    "WHERE d0.desk_id NOT IN ( " +
    "  SELECT d.desk_id " +
    "  FROM desks d " +
    "  JOIN bookings b ON d.desk_id = b.desk_id " +
    "  WHERE b.day = :day " +
    "  AND ( " +
    "    (b.begin BETWEEN :startTime AND :endTime) " +
    "    OR (b.end BETWEEN :startTime AND :endTime) " +
    "    OR (b.begin <= :endTime AND b.end >= :startTime) " +  // Overlap check
    "  ) " +
    ") ",
    nativeQuery = true)
  List<Desk> getDesksThatHaveNoBookingOnDatesBetweenDays(
    @Param("day") Date day, 
    @Param("startTime") Time startTime, 
    @Param("endTime") Time endTime);
} */
@Query(value = 
"SELECT distinct * FROM desks d0 " +
"WHERE d0.desk_id NOT IN ( " +
"  SELECT d.desk_id " +
"  FROM desks d " +
"  JOIN bookings b ON d.desk_id = b.desk_id " +
"  WHERE b.day IN (:days) " +
"  AND ( " +
"    (b.begin BETWEEN :startTime AND :endTime) " +
"    OR (b.end BETWEEN :startTime AND :endTime) " +
"    OR (b.begin <= :endTime AND b.end >= :startTime) " +  // Overlap check
"  ) " +
") ",
nativeQuery = true)
List<Desk> getDesksThatHaveNoBookingOnDatesBetweenDays(
@Param("days") List<Date> days, 
@Param("startTime") Time startTime, 
@Param("endTime") Time endTime);

@Query(value = 

"  SELECT d.* " +
"  FROM desks d " +
"  JOIN bookings b ON d.desk_id = b.desk_id " +
"  WHERE b.day IN (:days) " +
"  AND ( " +
"    (b.begin BETWEEN :startTime AND :endTime) " +
"    OR (b.end BETWEEN :startTime AND :endTime) " +
"    OR (b.begin <= :endTime AND b.end >= :startTime) " +  // Overlap check
"  ) " 
,nativeQuery = true)
List<Desk> foo(
@Param("days") List<Date> days, 
@Param("startTime") Time startTime, 
@Param("endTime") Time endTime);

}
