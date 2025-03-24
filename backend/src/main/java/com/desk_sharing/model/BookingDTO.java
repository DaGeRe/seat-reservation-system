package com.desk_sharing.model;

import java.sql.Date;
import java.sql.Time;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class BookingDTO {
    private Long id;
    private int userId;
    private Long roomId;
    private Long deskId;
    private Date day;
    private Time begin;
    private Time end;
    

    

}
