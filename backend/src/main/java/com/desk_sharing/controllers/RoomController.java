package com.desk_sharing.controllers;

import com.desk_sharing.entities.Room;
import com.desk_sharing.services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rooms")
public class RoomController {

    @Autowired
    RoomService roomService;

    @PostMapping("/create")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        Room savedRoom = roomService.saveRoom(room);
        return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        List<Room> rooms = roomService.getAllRooms();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }
    
    @GetMapping("/status")
    public ResponseEntity<List<Room>> getAllRoomsByActiveStatus() {
        List<Room> rooms = roomService.getAllRoomsByActiveStatus();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable("id") Long id) {
        Optional<Room> room = roomService.getRoomById(id);
        return room.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable("id") Long id, @RequestBody Room room) {
        Room updatedRoom = roomService.updateRoom(id, room);
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }

    @PutMapping("/{id}/floor/{floor}")
    public ResponseEntity<Room> updateRoomFloor(@PathVariable("id") Long id, @PathVariable("floor") String floor) {
        Room updatedRoom = roomService.updateRoomFloor(id, floor);
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }
    
    @PutMapping("/{id}/type/{type}")
    public ResponseEntity<Room> updateRoomType(@PathVariable("id") Long id, @PathVariable("type") String type) {
        Room updatedRoom = roomService.updateRoomType(id, type);
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }
    
    @PutMapping("/{id}/{status}")
    public ResponseEntity<Room> updateRoomStatus(@PathVariable("id") Long id, @PathVariable("status") String status) {
        Room updatedRoom = roomService.updateRoomStatus(id, status);
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable("id") Long id) {
        roomService.deleteRoom(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
