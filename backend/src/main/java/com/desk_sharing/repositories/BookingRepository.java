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

	@Query(value="select * from bookings where day=:myDate", nativeQuery = true)
	List<Booking> getBookingForDate(@Param("myDate") Date myDate);

	@Query(value="select booking_id, day, begin, end, email, desks.remark, rooms.remark, rooms.building, bookings.series_id " 
		+ "from bookings " 
		+ "left join series on bookings.series_id=series.series_id "
		+ "join desks on bookings.desk_id=desks.desk_id "
		+ "join rooms on bookings.room_id=rooms.room_id "
		+ "join users on bookings.user_id=users.id", nativeQuery = true)
	List<Object[]> getEveryBooking();

	@Query(value="select booking_id, day, begin, end, email, desks.remark, rooms.remark, rooms.building, bookings.series_id " 
		+ "from bookings " 
		+ "left join series on bookings.series_id=series.series_id "
		+ "join desks on bookings.desk_id=desks.desk_id "
		+ "join rooms on bookings.room_id=rooms.room_id "
		+ "join users on bookings.user_id=users.id "
		+ " where email like :email ", nativeQuery = true)
	List<Object[]> getEveryBookingForEmail(@Param("email") String email);

	@Query(value="select booking_id, day, begin, end, email, desks.remark, rooms.remark, rooms.building, bookings.series_id " 
		+ "from bookings " 
		+ "left join series on bookings.series_id=series.series_id "
		+ "join desks on bookings.desk_id=desks.desk_id "
		+ "join rooms on bookings.room_id=rooms.room_id "
		+ "join users on bookings.user_id=users.id "
		+ "where day like :date ", nativeQuery = true)
	List<Object[]> getEveryBookingForDate(@Param("date") String date);

	@Query(value="select booking_id, day, begin, end, email, desks.remark, rooms.remark, rooms.building, bookings.series_id " 
		+ "from bookings " 
		+ "left join series on bookings.series_id=series.series_id "
		+ "join desks on bookings.desk_id=desks.desk_id "
		+ "join rooms on bookings.room_id=rooms.room_id "
		+ "join users on bookings.user_id=users.id "
		+ "where desks.remark like :deskRemark ", nativeQuery = true)
	List<Object[]> getEveryBookingForDeskRemark(@Param("deskRemark") String deskRemark);

	@Query(value="select booking_id, day, begin, end, email, desks.remark, rooms.remark, rooms.building, bookings.series_id " 
		+ "from bookings " 
		+ "left join series on bookings.series_id=series.series_id "
		+ "join desks on bookings.desk_id=desks.desk_id "
		+ "join rooms on bookings.room_id=rooms.room_id "
		+ "join users on bookings.user_id=users.id "
		+ "where rooms.remark like :RoomRemark ", nativeQuery = true)
	List<Object[]> getEveryBookingForRoomRemark(@Param("RoomRemark") String RoomRemark);
	
	@Query(value="select * from bookings " +
	" where user_id = (select id from users where email=:email) " + 
	" and desk_id = (select desk_id from desks where remark=:deskRemark) " +
	" and day=:day",
	nativeQuery = true)
	List<Booking> selectBookingsByUserDeskAndDay(@Param("email") String email, @Param("deskRemark") String deskRemark, @Param("day") Date day);

	@Modifying
	@Query(value="delete from bookings where series_id=:seriesId" , nativeQuery = true)
	void deleteBookingsBySeriesId(@Param("seriesId") long seriesId);

	@Query(value="select * from bookings where desk_id=:deskId", nativeQuery = true)
	List<Booking> getBookingsByDeskId(@Param("deskId") Long roomId);

	@Query(value="select * from bookings where user_id=:userId", nativeQuery = true)
	List<Booking> getBookingsByUserId(@Param("userId") int roomId);
}
