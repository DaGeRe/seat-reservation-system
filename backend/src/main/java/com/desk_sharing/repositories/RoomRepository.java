package com.desk_sharing.repositories;

import com.desk_sharing.entities.Room;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

	List<Room> findAllByStatus(String status);
	@Query(value=""
    + "select * from rooms where remark = :roomRemark "
    ,nativeQuery=true)
    public Room findByRoomRemark(@Param("roomRemark") String roomRemark);
}
