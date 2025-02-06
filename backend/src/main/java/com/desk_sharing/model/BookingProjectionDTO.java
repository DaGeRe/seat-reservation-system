package com.desk_sharing.model;

import java.sql.Date;
import java.sql.Time;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class BookingProjectionDTO {
    //select day, begin, end, email, desks.remark, rooms.remark, bookings.series_id 
    private Long booking_id;
    private Date day;
    private Time begin;
    private Time end;
    private String email;
    private String deskRemark;
    private String roomRemark;
    private String building;
    private Long seriesId;

    /*public BookingProjectionDTO(Date day, Time begin, Time end, String email, String deskRemark, String roomRemark, Long seriesId) {
        
    }*/
}
