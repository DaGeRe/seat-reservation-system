package com.desk_sharing.model;

import java.sql.Date;
import java.sql.Time;

import com.desk_sharing.entities.Desk;
import com.desk_sharing.entities.Room;
import com.desk_sharing.entities.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class SeriesDTO {
    private Long id;
    private Date startDate;
    private Date endDate;
    private Time startTime;
    private Time endTime;
    private String frequency;
    private UserEntity user;
    private Room room;
    private Desk desk;
}
