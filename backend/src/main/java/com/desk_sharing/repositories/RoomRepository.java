package com.desk_sharing.repositories;

import com.desk_sharing.entities.Room;
import com.desk_sharing.entities.Booking;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.*;
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

	List<Room> findAllByStatus(String status);

}
