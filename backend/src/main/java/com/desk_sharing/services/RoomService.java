package com.desk_sharing.services;

import com.desk_sharing.entities.Room;
import com.desk_sharing.entities.Booking;
import com.desk_sharing.repositories.RoomRepository;
import com.desk_sharing.repositories.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    RoomRepository roomRepository;

    @Autowired
    BookingRepository bookingRepository;

    public Room saveRoom(Room room) {
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
    

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    public void deleteRoomFf(Long id) {
        System.out.println("Room id " + id);
        System.out.println("deleteRoomFf");
        List<Booking> ls = bookingRepository.getBookingsByRoomId(id);
        System.out.println("ls.size() 1 " + ls.size());
        try {
        //bookingRepository.deleteBookingsByRoomId(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        ls = bookingRepository.getBookingsByRoomId(id);
        System.out.println("ls.size() 2 " + ls.size());
        //deskService.deleteDeskFf();
        //List<Booking> lst = roomRepository.getBookingsByRoomId(id);
    }
}
