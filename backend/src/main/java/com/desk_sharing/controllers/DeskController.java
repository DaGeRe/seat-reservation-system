package com.desk_sharing.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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

@RestController
@RequestMapping("/desks")
public class DeskController {

    @Autowired
    DeskService deskService;

    @PostMapping
    public ResponseEntity<Desk> createDesk(@RequestBody DeskDTO desk) {
        Desk savedDesk = deskService.saveDesk(desk);
        return new ResponseEntity<>(savedDesk, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Desk>> getAllDesks() {
        List<Desk> desks = deskService.getAllDesks();
        return new ResponseEntity<>(desks, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Desk> getDeskById(@PathVariable("id") Long id) {
        Optional<Desk> desk = deskService.getDeskById(id);
        return desk.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/room/{id}")
    public ResponseEntity<List<Desk>> getDeskByRoomId(@PathVariable("id") Long roomId) {
        List<Desk> desks = deskService.getDeskByRoomId(roomId);
        return new ResponseEntity<>(desks, HttpStatus.OK);
    }

    @PutMapping("/{id}/{equipment}")
    public ResponseEntity<Desk> updateDesk(@PathVariable("id") Long id, @PathVariable("equipment") String equipment) {
    	Desk updatedDesk = deskService.updateDesk(id, equipment);
        return new ResponseEntity<>(updatedDesk, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDesk(@PathVariable("id") Long id) {
        deskService.deleteDesk(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/ff/{id}")
    public ResponseEntity<Void> deleteDeskFf(@PathVariable("id") Long id) {
        deskService.deleteDeskFf(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}