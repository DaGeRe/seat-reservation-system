package com.desk_sharing.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.desk_sharing.entities.Booking;
import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Series;
import com.desk_sharing.entities.Booking;
import com.desk_sharing.model.RangeDTO;
import com.desk_sharing.model.SeriesDTO;
import com.desk_sharing.services.SeriesService;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/series")
public class SeriesController {
    @Autowired 
    SeriesService seriesService;

    @PostMapping("/datesbetween")
    public ResponseEntity<List<Date>> datesbetween(@RequestBody RangeDTO rangeDTO) {
        final List<Date> dates = seriesService.getDatesBetween(rangeDTO);
        return new ResponseEntity<List<Date>>(dates, HttpStatus.OK);
    };
    
    @PostMapping("/desks")
    public ResponseEntity<List<Desk>> getDesksForDates(@RequestBody RangeDTO rangeDTO) {
        final List<Desk> desks = seriesService.getDesksForDates(rangeDTO);
        return new ResponseEntity<List<Desk>>(desks, HttpStatus.OK);
    };

    @PostMapping
    public ResponseEntity<SeriesDTO> createSeries(@RequestBody SeriesDTO series) {
        return new ResponseEntity<SeriesDTO>(seriesService.createSeries(series), HttpStatus.OK);
    }
    
    @GetMapping("/{email}")
    public List<SeriesDTO> findSeriesForEmail(@PathVariable("email") String email) {
        return seriesService.findSeriesForEmail(email);
    }


    
}
