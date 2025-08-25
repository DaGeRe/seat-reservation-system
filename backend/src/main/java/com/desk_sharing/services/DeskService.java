package com.desk_sharing.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Room;
import com.desk_sharing.entities.Series;
import com.desk_sharing.entities.Booking;
import com.desk_sharing.model.DeskDTO;
import com.desk_sharing.repositories.DeskRepository;
import com.desk_sharing.repositories.RoomRepository;
import com.desk_sharing.repositories.SeriesRepository;

import lombok.AllArgsConstructor;

import com.desk_sharing.repositories.BookingRepository;

@Service
@AllArgsConstructor
public class DeskService {
    private final DeskRepository deskRepository;
    private final BookingRepository bookingRepository;
    private final SeriesRepository seriesRepository;
    private final SeriesService seriesService;
    private final RoomRepository roomRepository;

    public Desk saveDesk(DeskDTO deskDto) {
        Optional<Room> optional = roomRepository.findById(deskDto.getRoomId());
        if(optional.isPresent()) {
    	    Desk desk = new Desk();
    	    desk.setRoom(optional.get());
    		desk.setEquipment(deskDto.getEquipment());
            desk.setRemark(deskDto.getRemark());
            List<Desk> allDesksInCurrentRoomn = deskRepository.findByRoomId(desk.getRoom().getId());
            Long newDeskNumberInRoom = 1 + allDesksInCurrentRoomn.stream()
            .filter(d -> d.getDeskNumberInRoom() != null)
            .map(Desk::getDeskNumberInRoom)
            .max(Long::compareTo)
            .orElse((long)0);
            desk.setDeskNumberInRoom((long)newDeskNumberInRoom);
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

    public int deleteDesk(Long id) {
        List<Booking> bookingsPerDesk = bookingRepository.getBookingsByDeskId(id);
        if (bookingsPerDesk.size() > 0) {
            return bookingsPerDesk.size();
        }
        else {
            try {
                deskRepository.deleteById(id);
                return 0;
            }
            catch (Exception e) {
                e.printStackTrace();
                return -1;
            }
        }
        
    }

    public boolean deleteDeskFf(Long id) {
        try {
            List<Booking> bookingsPerDesk = bookingRepository.getBookingsByDeskId(id);
            for (Booking booking: bookingsPerDesk) {
                bookingRepository.deleteById(booking.getId());
            }

            // Delete series.
            List<Series> seriesLst = seriesRepository.findByDeskId(id);
            for (Series series: seriesLst) {
                seriesService.deleteById(series.getId());
            }
            
            deskRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}