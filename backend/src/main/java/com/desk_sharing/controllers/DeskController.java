package com.desk_sharing.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.desk_sharing.entities.Desk;
import com.desk_sharing.model.DeskDTO;
import com.desk_sharing.services.DeskService;
import com.desk_sharing.services.UserService;

@RestController
@RequestMapping("/desks")
public class DeskController {

    @Autowired
    DeskService deskService;

    @Autowired
    UserService userService;

    @PostMapping
    public ResponseEntity<Desk> createDesk(@RequestBody DeskDTO desk) {
        userService.logging("createDesk( " + desk + " )");
        Desk savedDesk = deskService.saveDesk(desk);
        return new ResponseEntity<>(savedDesk, HttpStatus.CREATED);
    }

    @PutMapping("/updateDesk")
    public ResponseEntity<Desk> updateDesk(@RequestBody DeskDTO desk) {
        userService.logging("updateDesk( " + desk + " )");
        Desk updatedDesk = deskService.updateDesk(desk.getDeskId(), desk.getEquipment(), desk.getRemark());
        return new ResponseEntity<>(updatedDesk, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Desk>> getAllDesks() {
        userService.logging("getAllDesks()");
        List<Desk> desks = deskService.getAllDesks();
        return new ResponseEntity<>(desks, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Desk> getDeskById(@PathVariable("id") Long id) {
        userService.logging("getDeskById( " + id + " )");
        Optional<Desk> desk = deskService.getDeskById(id);
        return desk.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/room/{id}")
    public ResponseEntity<List<Desk>> getDeskByRoomId(@PathVariable("id") Long roomId) {
        userService.logging("getDeskByRoomId( " + roomId + " )");
        List<Desk> desks = deskService.getDeskByRoomId(roomId);
        return new ResponseEntity<>(desks, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> deleteDesk(@PathVariable("id") Long id) {
        userService.logging("deleteDesk( " + id + " )");
        int ret = deskService.deleteDesk(id);
        return ResponseEntity.status(HttpStatus.OK).body(ret);
    }

    @DeleteMapping("/ff/{id}")
    public ResponseEntity<Integer> deleteDeskFf(@PathVariable("id") Long id) {
        userService.logging("deleteDeskFf( " + id + " )");
        deskService.deleteDeskFf(id);
        //return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        // The return value 0 means everything was done right.
        return ResponseEntity.status(HttpStatus.OK).body(0);
    }
}