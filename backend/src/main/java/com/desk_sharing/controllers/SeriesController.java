package com.desk_sharing.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.desk_sharing.entities.Booking;
import com.desk_sharing.model.RangeDTO;
import com.desk_sharing.model.SeriesDTO;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/series")
public class SeriesController {
    @PostMapping("/datesbetween")
    public ResponseEntity<List<Date>> datesbetween(@RequestBody RangeDTO rangeDTO) {
/*         System.out.println(rangeDTO.getStartDate());
        System.out.println(rangeDTO.getEndDate());
        System.out.println(rangeDTO.getStartTime());
        System.out.println(rangeDTO.getEndTime());
        System.out.println(rangeDTO.getFrequency()); */
        return new ResponseEntity<List<Date>>(new ArrayList<>(), HttpStatus.OK);
    }
    
}
