package com.desk_sharing.services;

import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Room;
import com.desk_sharing.model.DatesAndTimesDTO;
import com.desk_sharing.model.RoomDTO;
import com.desk_sharing.repositories.DeskRepository;
import com.desk_sharing.repositories.RoomRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class RoomService {
    private final DeskRepository deskRepository;
    private final RoomRepository roomRepository;
    private final FloorService floorService;
    private final DeskService deskService;
    private final RoomTypeService roomTypeService;
    private final RoomStatusService roomStatusService;

    public Room saveRoom(RoomDTO roomDTO) {
        final Room newRoom = new Room();
        newRoom.setRoomType(roomTypeService.getRoomTypeByRoomTypeName(roomDTO.getType()));
        newRoom.setFloor(floorService.getFloorByFloorId(roomDTO.getFloor_id()));
        newRoom.setX(roomDTO.getX());
        newRoom.setY(roomDTO.getY());
        newRoom.setRoomStatus(roomStatusService.getRoomStatusByRoomStatusName(roomDTO.getStatus()));
        newRoom.setRemark(roomDTO.getRemark());
        return roomRepository.save(newRoom);
    }

    public Room updateRoom(RoomDTO roomDTO) {
        final Room room = roomRepository.findById(roomDTO.getRoom_id())
            .orElseThrow(()-> new EntityNotFoundException("Room not found in RoomService.updateRoom : " + roomDTO.getRoom_id()));
        room.setRemark(roomDTO.getRemark());
        room.setRoomStatus(roomStatusService.getRoomStatusByRoomStatusName(roomDTO.getStatus()));
        room.setRoomType(roomTypeService.getRoomTypeByRoomTypeName(roomDTO.getType()));
        return roomRepository.save(room);
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getAllRoomsByFloorId(Long floor_id) {
        return roomRepository.getAllRoomsByFloorId(floor_id);
    }
    
    public final List<Room> getAllRoomsByActiveStatus() {
        return roomRepository.findAllByStatus("enable");
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }


    
    public List<Room> getByMinimalAmountOfWorkstations(int minimalAmountOfWorkstations) {
        return roomRepository.getByMinimalAmountOfWorkstations(minimalAmountOfWorkstations);
    };

    public List<Room> getByMinimalAmountOfWorkstationsAndFreeOnDate(int minimalAmountOfWorkstations, DatesAndTimesDTO datesAndTimesDTO) {

        return roomRepository.getByMinimalAmountOfWorkstationsAndFreeOnDate(
            minimalAmountOfWorkstations,
            datesAndTimesDTO.getDates(),
            SeriesService.timestringToTime(datesAndTimesDTO.getStartTime()),
            SeriesService.timestringToTime(datesAndTimesDTO.getEndTime())
        );
    };

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
            // Delete desks for this room.
            final List<Desk> desksPerRoom = deskRepository.findByRoomId(id);
            for (Desk desk: desksPerRoom) {
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
