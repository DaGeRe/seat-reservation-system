package com.desk_sharing.repositories;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.desk_sharing.entities.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(int user_id);
    List<Booking> findByRoomId(Long room_id);
    List<Booking> findByDeskId(Long desk_id);
    List<Booking> findByDeskIdAndDay(Long deskId, Date day);
	List<Booking> findByRoomIdAndDay(Long roomId, Date day); 
	
	@Query(value = "SELECT * FROM bookings WHERE booking_id != :id AND room_id = :roomId AND desk_id=:deskId AND day=:day AND "
			+ "((:startTime BETWEEN begin AND end) OR (:endTime BETWEEN begin AND end) OR "
			+ "(begin >= :startTime AND begin < :endTime) OR (end > :startTime AND end <= :endTime))"
			, nativeQuery = true)
	List<Booking> getAllBookings(@Param("id") Long id, @Param("roomId") Long roomId,@Param("deskId") Long deskId, 
			@Param("day") Date day, @Param("startTime") Time startTime,
			@Param("endTime") Time endTime);
	
	@Query(value = "SELECT * FROM bookings WHERE room_id = :roomId AND desk_id=:deskId AND day=:day AND "
			+ "((:startTime BETWEEN begin AND end) OR (:endTime BETWEEN begin AND end) OR "
			+ "(begin >= :startTime AND begin < :endTime) OR (end > :startTime AND end <= :endTime))"
			, nativeQuery = true)
	List<Booking> getAllBookingsForPreventDuplicates(@Param("roomId") Long roomId,@Param("deskId") Long deskId, 
			@Param("day") Date day, @Param("startTime") Time startTime,
			@Param("endTime") Time endTime);
	

	List<Booking> findAllByBookingInProgress(boolean inProg);

	@Query(value="select * from bookings where room_id=:roomId;", nativeQuery = true)
	List<Booking> getBookingsByRoomId(@Param("roomId") Long roomId);

	//select current_timestamp, bookings.* from bookings where (day = '2024-09-14') and (CURRENT_TIMESTAMP not between begin and end)  ;
/* 	@Query(value="select * from bookings where day=:day and ;")
	List<Booking> getAllCurrentBookingsForNow(
		@Param("day") Date day, 
		@Param("startTime") Time startTime,
		@Param("endTime") Time endTime
	); */

	@Modifying
	@Query(value="delete from bookings where room_id=:roomId", nativeQuery = true)
	void deleteBookingsByRoomId(@Param("roomId") Long roomId);

	@Modifying
	@Query(value="delete from bookings where desk_id=:deskId", nativeQuery = true)
	void deleteBookingsByDeskId(@Param("deskId") Long roomId);

	@Query(value="select * from bookings where desk_id=:deskId", nativeQuery = true)
	List<Booking> getBookingsByDeskId(@Param("deskId") Long roomId);
}
