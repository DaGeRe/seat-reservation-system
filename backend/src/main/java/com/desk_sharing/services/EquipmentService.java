package com.desk_sharing.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.desk_sharing.entities.Equipment;
import com.desk_sharing.repositories.EquipmentRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class EquipmentService {
    private final EquipmentRepository equipmentRepository;
    
    public final List<Equipment> getEquipments() {
        return equipmentRepository.findAll();
    }

    public final Equipment getEquipmentByEquipmentId(final Long equipmentId) throws EntityNotFoundException{
        //return equipmentRepository.findById(equipmentId).get();
        return equipmentRepository.findById(equipmentId)
            .orElseThrow(() -> new EntityNotFoundException("Equipment not found in EquipmentService.getEquipmentByEquipmentId : " + equipmentId));
    }

    public final Equipment getEquipmentByEquipmentName(final String equipmentName) {
        return equipmentRepository.findByEquipmentName(equipmentName);
    }
}
