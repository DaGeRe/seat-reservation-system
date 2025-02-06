package com.desk_sharing.services;

import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Room;
import com.desk_sharing.repositories.DeskRepository;
import com.desk_sharing.repositories.RoomRepository;
import com.desk_sharing.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    DeskRepository deskRepository;

    @Autowired
    RoomRepository roomRepository;

    @Autowired
    BookingRepository bookingRepository;

    @Autowired
    DeskService deskService;

    public Room saveRoom(Room room) {
        if (room.getBuilding() == null) {
            room.setBuilding("Bautzner Str. 19a/b");
        }
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    
    public List<Room> getAllRoomsByActiveStatus() {
        return roomRepository.findAllByStatus("enable");
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Room updateRoom(Long id, Room room) {
        room.setId(id);
        return roomRepository.save(room);
    }
    
    public Room updateRoomStatus(Long id, String status) {
    	Optional<Room> findById = roomRepository.findById(id);
    	if(findById.isPresent()) {
    		Room room = findById.get();
    		room.setStatus(status);
    		return roomRepository.save(room);
    	}
    	return null;
        
    }
    
    public Room updateRoomType(Long id, String type) {
    	Optional<Room> findById = roomRepository.findById(id);
    	if(findById.isPresent()) {
    		Room room = findById.get();
    		room.setType(type);
    		return roomRepository.save(room);
    	}
    	return null;
    }

    public Room updateRoomFloor(Long id, String floor) {
    	Optional<Room> findById = roomRepository.findById(id);
    	if(findById.isPresent()) {
    		Room room = findById.get();
    		room.setFloor(floor);
    		return roomRepository.save(room);
    	}
    	return null;
    }

    public Room updateRoomRemark(Long id, String remark) {
    	Optional<Room> findById = roomRepository.findById(id);
    	if(findById.isPresent()) {
    		Room room = findById.get();
    		room.setRemark(remark);
    		return roomRepository.save(room);
    	}
    	return null;
    }
    

    public int deleteRoom(Long id) {
        List<Desk> desksPerRoom = deskRepository.findByRoomId(id);
        if (desksPerRoom.size() > 0) {
            return desksPerRoom.size();
        }
        else {
            try {
                roomRepository.deleteById(id);
                return 0;
            } catch (Exception e) {
                e.printStackTrace();
                return -1;
            }
        }
    }

    public boolean deleteRoomFf(Long id) {
        try {
            List<Desk> desksPerRoom = deskRepository.findByRoomId(id);
            for (Desk desk: desksPerRoom) {
                /*List<Booking> bookingsPerDesk = bookingRepository.getBookingsByDeskId(desk.getId());
                for (Booking booking: bookingsPerDesk) {
                    bookingRepository.deleteById(booking.getId());
                }
                deskRepository.deleteById(desk.getId());*/
                deskService.deleteDeskFf(desk.getId());
            }
            roomRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
