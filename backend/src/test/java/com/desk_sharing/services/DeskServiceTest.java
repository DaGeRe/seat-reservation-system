package com.desk_sharing.services;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Equipment;
import com.desk_sharing.entities.Room;
import com.desk_sharing.model.DeskDTO;
import com.desk_sharing.repositories.BookingRepository;
import com.desk_sharing.repositories.DeskRepository;
import com.desk_sharing.repositories.RoomRepository;
import com.desk_sharing.repositories.SeriesRepository;

@ExtendWith(MockitoExtension.class)
class DeskServiceTest {

    @Mock DeskRepository deskRepository;
    @Mock BookingRepository bookingRepository;
    @Mock SeriesRepository seriesRepository;
    @Mock SeriesService seriesService;
    @Mock EquipmentService equipmentService;
    @Mock RoomRepository roomRepository;

    @InjectMocks DeskService deskService;

    @Test
    void saveDesk_setsFixedTrue_whenDtoFixedIsTrue() {
        DeskDTO dto = deskDto(10L, "With equipment", "Desk 1", true);
        Room room = room(10L);
        Equipment equipment = equipment("With equipment");

        when(roomRepository.findById(10L)).thenReturn(Optional.of(room));
        when(equipmentService.getEquipmentByEquipmentName("With equipment")).thenReturn(equipment);
        when(deskRepository.findByRoomId(10L)).thenReturn(List.of());
        when(deskRepository.save(any(Desk.class))).thenAnswer(inv -> inv.getArgument(0));

        Desk saved = deskService.saveDesk(dto);

        assertThat(saved.isFixed()).isTrue();
        assertThat(saved.getDeskNumberInRoom()).isEqualTo(1L);
    }

    @Test
    void saveDesk_keepsDefaultFixedFalse_whenDtoFixedIsNull() {
        DeskDTO dto = deskDto(10L, "With equipment", "Desk 2", null);
        Room room = room(10L);
        Equipment equipment = equipment("With equipment");

        when(roomRepository.findById(10L)).thenReturn(Optional.of(room));
        when(equipmentService.getEquipmentByEquipmentName("With equipment")).thenReturn(equipment);
        when(deskRepository.findByRoomId(10L)).thenReturn(List.of());
        when(deskRepository.save(any(Desk.class))).thenAnswer(inv -> inv.getArgument(0));

        Desk saved = deskService.saveDesk(dto);

        assertThat(saved.isFixed()).isFalse();
        assertThat(saved.getDeskNumberInRoom()).isEqualTo(1L);
    }

    private static DeskDTO deskDto(Long roomId, String equipment, String remark, Boolean fixed) {
        DeskDTO dto = new DeskDTO();
        dto.setRoomId(roomId);
        dto.setEquipment(equipment);
        dto.setRemark(remark);
        dto.setFixed(fixed);
        return dto;
    }

    private static Room room(Long id) {
        Room room = new Room();
        room.setId(id);
        return room;
    }

    private static Equipment equipment(String name) {
        Equipment equipment = new Equipment();
        equipment.setEquipmentName(name);
        return equipment;
    }
}
