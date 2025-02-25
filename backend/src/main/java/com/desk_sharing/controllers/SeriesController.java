package com.desk_sharing.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Room;
import com.desk_sharing.entities.Series;
import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.model.DatesAndTimesDTO;
import com.desk_sharing.model.RangeDTO;
import com.desk_sharing.model.SeriesDTO;
import com.desk_sharing.model.SeriesDTOWithDeskRemark;
import com.desk_sharing.repositories.DeskRepository;
import com.desk_sharing.repositories.SeriesRepository;
import com.desk_sharing.repositories.UserRepository;
import com.desk_sharing.services.SeriesService;
import com.desk_sharing.services.UserService;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/series")
public class SeriesController {
    @Autowired 
    private SeriesService seriesService;

    @Autowired 
    private SeriesRepository seriesRepository;
    
    @Autowired
    private DeskRepository deskRepository;

    @Autowired
    private UserService userService;
    
    @PostMapping("/desksForDatesAndTimes")
    public ResponseEntity<List<Desk>> getDesksForDatesAndTimes(@RequestBody DatesAndTimesDTO datesAndTimesDTO) {
        userService.logging("getDesksForDatesAndTimes( " + datesAndTimesDTO + " )");
        final List<Desk> desks = seriesService.getDesksForDatesAndTimes(datesAndTimesDTO);
        return new ResponseEntity<List<Desk>>(desks, HttpStatus.OK);
    };

    @PostMapping("/dates")
    public ResponseEntity<List<Date>> getDatesForRange(@RequestBody RangeDTO rangeDTO) {
        userService.logging("getDatesForRange( " + rangeDTO + " )");
        final List<Date> dates = seriesService.getDatesBetween(rangeDTO);
    
        return new ResponseEntity<List<Date>>(dates, HttpStatus.OK);
    };

    @PostMapping
    public ResponseEntity<Boolean> createSeries(@RequestBody SeriesDTO seriesDto) {
        userService.logging("createSeries( " + seriesDto + " )");
        return new ResponseEntity<Boolean>(seriesService.createSeries(seriesDto), HttpStatus.OK);
    }

    @PostMapping("/createSeriesForDeskRemark")
    public ResponseEntity<String> createSeriesForDeskRemark(@RequestBody SeriesDTOWithDeskRemark seriesDTOWithDeskRemark) {
        userService.logging("createSeriesForDeskRemark()");
        final String deskRemark = seriesDTOWithDeskRemark.getDeskRemark();
        final Desk desk = deskRepository.findByDeskRemark(deskRemark);
        if (desk == null) {
            return new ResponseEntity<String>("cannot find desk", HttpStatus.OK);
        }
        final Room room = desk.getRoom();
        if (room == null) {
            return new ResponseEntity<String>("cannot find room", HttpStatus.OK);
        }
        final SeriesDTO seriesDTO = new SeriesDTO(
            0L, 
            seriesDTOWithDeskRemark.getRangeDTO(), 
            seriesDTOWithDeskRemark.getDates(), 
            room, 
            desk,
            seriesDTOWithDeskRemark.getEmail()
        );

        // Check if there is allready an series.
        final List<Series> existingSeries = seriesRepository.getAllSeriesForPreventDuplicates(
            seriesDTOWithDeskRemark.getRangeDTO().getStartDate(),
            /*seriesDTOWithDeskRemark.getRangeDTO().getEndDate(),
            seriesDTOWithDeskRemark.getRangeDTO().getStartTime(),
            seriesDTOWithDeskRemark.getRangeDTO().getEndTime(),*/
            room.getId(),
            desk.getId(),
            seriesDTOWithDeskRemark.getEmail()
        );
        System.out.println("seriesDTOWithDeskRemark.getRangeDTO().getStartDate(): " + seriesDTOWithDeskRemark.getRangeDTO().getStartDate());
        System.out.println("existingSeries.size(): " + existingSeries.size());

        if (existingSeries.size()>0) {
            return new ResponseEntity<String>("series already there", HttpStatus.OK);
        }

        final boolean ret = seriesService.createSeries(seriesDTO);
        if (ret) {
            return new ResponseEntity<String>("OK", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("cannot create series", HttpStatus.OK);
        }
        //return new ResponseEntity<Boolean>(seriesService.createSeries(seriesDto), HttpStatus.OK);
        
    }
    
    @GetMapping("/{email}")
    public List<SeriesDTO> findSeriesForEmail(@PathVariable("email") String email) {
        userService.logging("findSeriesForEmail( " + email + " )");
        return seriesService.findSeriesForEmail(email);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> deleteById(@PathVariable("id") Long id) {
        userService.logging("deleteById( " + id + " )");
        final int returnValue = seriesService.deleteById(id);
        return new ResponseEntity<Integer>(returnValue, HttpStatus.OK);
    }    
}
