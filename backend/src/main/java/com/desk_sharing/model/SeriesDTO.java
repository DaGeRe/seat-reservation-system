package com.desk_sharing.model;

import java.sql.Date;
import java.sql.Time;
import java.util.List;

import com.desk_sharing.entities.Booking;
import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Room;
import com.desk_sharing.entities.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class SeriesDTO {
    private Long id;
    private String startDate;
    private String endDate;
    private String startTime;
    private String endTime;
    private String frequency;
    private UserEntity user;
    private Room room;
    private Desk desk;
    private String email;
    private List<Booking> bookings;

/*     public SeriesDTO(String startDate, String endDate, String startTime, String endTime, String frequency) {
        id = 0L;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.frequency = frequency;
        this.user = null;
        this.room = null;
        this.desk = null;
    } */
}
