package com.desk_sharing.repositories;

import com.desk_sharing.entities.Booking;
import com.desk_sharing.entities.Desk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface DeskRepository extends JpaRepository<Desk, Long> {
    List<Desk> findByRoomId(Long roomId);

/*     @Query(value="select * from desks where room_id=:roomId", nativeQuery = true)
	List<Desk> getBookingForDate(@Param("roomId") Long roomId); */
}
