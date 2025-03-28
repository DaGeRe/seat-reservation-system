package com.desk_sharing.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.desk_sharing.entities.Floor;
import com.desk_sharing.repositories.FloorRepository;
import com.desk_sharing.services.UserService;

@RestController
@RequestMapping("/floors")
public class FloorController {
    @Autowired
    private UserService userService;
    @Autowired 
    FloorRepository floorRepository;

    @GetMapping("getAllFloorsForBuildingId/{building_id}")
    public List<Floor> getAllFloorsForBuildingId(@PathVariable("building_id") Long building_id) {
        userService.logging("getAllFloorsForBuildingId("+building_id+")");
        return floorRepository.getAllFloorsForBuildingId(building_id);
    }
}
