package com.desk_sharing.controllers;

import com.desk_sharing.entities.Room;
import com.desk_sharing.services.RoomService;
import com.desk_sharing.services.UserService;

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

    @Autowired
    UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        userService.logging("createRoom( " + room + " )");
        Room savedRoom = roomService.saveRoom(room);
        return new ResponseEntity<>(savedRoom, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        userService.logging("getAllRooms()");
        List<Room> rooms = roomService.getAllRooms();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }
    
    @GetMapping("/status")
    public ResponseEntity<List<Room>> getAllRoomsByActiveStatus() {
        userService.logging("getAllRoomsByActiveStatus()");
        List<Room> rooms = roomService.getAllRoomsByActiveStatus();
        return new ResponseEntity<>(rooms, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable("id") Long id) {
        userService.logging("getRoomById( + " + id + " )");
        Optional<Room> room = roomService.getRoomById(id);
        return room.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable("id") Long id, @RequestBody Room room) {
        userService.logging("updateRoom( + " + id + ", " + room + " )");
        Room updatedRoom = roomService.updateRoom(id, room);
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }

    @PutMapping("/{id}/floor/{floor}")
    public ResponseEntity<Room> updateRoomFloor(@PathVariable("id") Long id, @PathVariable("floor") String floor) {
        userService.logging("updateRoomFloor( + " + id + ", " + floor + " )");
        Room updatedRoom = roomService.updateRoomFloor(id, floor);
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }

    @PutMapping("/{id}/remark/{remark}")
    public ResponseEntity<Room> updateRoomRemark(@PathVariable("id") Long id, @PathVariable("remark") String remark) {
        userService.logging("updateRoomRemark( + " + id + ", " + remark + " )");
        Room updatedRoom = roomService.updateRoomRemark(id, remark);
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }
    
    @PutMapping("/{id}/type/{type}")
    public ResponseEntity<Room> updateRoomType(@PathVariable("id") Long id, @PathVariable("type") String type) {
        userService.logging("updateRoomType( + " + id + ", " + type + " )");
        Room updatedRoom = roomService.updateRoomType(id, type);
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }
    
    @PutMapping("/{id}/{status}")
    public ResponseEntity<Room> updateRoomStatus(@PathVariable("id") Long id, @PathVariable("status") String status) {
        userService.logging("updateRoomStatus( + " + id + ", " + status + " )");
        Room updatedRoom = roomService.updateRoomStatus(id, status);
        return new ResponseEntity<>(updatedRoom, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> deleteRoom(@PathVariable("id") Long id) {
        userService.logging("deleteRoom( + " + id + " )");
        int ret = roomService.deleteRoom(id);
        return ResponseEntity.status(HttpStatus.OK).body(ret);
    } 
    
    @DeleteMapping("/ff/{id}")
    public boolean deleteRoomFf(@PathVariable("id") Long id) {
        userService.logging("deleteRoomFf( + " + id + " )");
        return roomService.deleteRoomFf(id);
    }
}
