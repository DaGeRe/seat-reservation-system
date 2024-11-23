package com.desk_sharing.model;

import java.sql.Date;
import java.sql.Time;

import lombok.Data;

import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class RangeDTO {
    private Date startDate;
    private Date endDate;
    private Time startTime;
    private Time endTime;
    private String frequency;
}
