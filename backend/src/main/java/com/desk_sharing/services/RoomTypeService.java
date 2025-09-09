package com.desk_sharing.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.desk_sharing.entities.RoomType;
import com.desk_sharing.repositories.RoomTypeRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RoomTypeService {
    private final RoomTypeRepository roomTypeRepository;
    
    public final List<RoomType> getRoomTypes() {
        return roomTypeRepository.findAll();
    }

    public final RoomType getRoomTypeByRoomTypeId(final Long roomTypeId) {
        return roomTypeRepository.findById(roomTypeId).get();
    }

    public final RoomType getRoomTypeByRoomTypeName(final String roomTypeName) {
        return roomTypeRepository.findByRoomTypeName(roomTypeName);
    }
}
