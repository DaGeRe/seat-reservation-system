package com.desk_sharing.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Room;
import com.desk_sharing.entities.Booking;
import com.desk_sharing.model.DeskDTO;
import com.desk_sharing.repositories.DeskRepository;
import com.desk_sharing.repositories.BookingRepository;

@Service
public class DeskService {

    @Autowired
    DeskRepository deskRepository;

    @Autowired
    BookingRepository bookingRepository;
    
    @Autowired
    RoomService roomService;

    public Desk saveDesk(DeskDTO deskDto) {
    	Optional<Room> optional = roomService.getRoomById(deskDto.getRoomId());
    	if(optional.isPresent()) {
    		Desk desk = new Desk();
    		//desk.setId(deskDto.getDeskId());
    		desk.setRoom(optional.get());
    		desk.setEquipment(deskDto.getEquipment());
            desk.setRemark(deskDto.getRemark());
    		return deskRepository.save(desk);
    	} else {
    		return null;
    	}
    }

    public List<Desk> getAllDesks() {
        return deskRepository.findAll();
    }

    public Optional<Desk> getDeskById(Long id) {
        return deskRepository.findById(id);
    }

    public List<Desk> getDeskByRoomId(Long roomId) {
        return deskRepository.findByRoomId(roomId);
    }

    public Desk updateDesk(Long id, String equipment, String remark) {
        Optional<Desk> optional = getDeskById(id);
        if(optional.isPresent()) {
        	Desk desk = optional.get();
        	desk.setEquipment(equipment);
            desk.setRemark(remark);
        	return deskRepository.save(desk);
        } 
        return null;
        
    }

    public void deleteDesk(Long id) {
        deskRepository.deleteById(id);
    }

    public void deleteDeskFf(Long id) {
        List<Booking> bookingsPerDesk = bookingRepository.getBookingsByDeskId(id);
        for (Booking booking: bookingsPerDesk) {
            bookingRepository.deleteById(booking.getId());
        }
        deskRepository.deleteById(id);
    }
}