package com.desk_sharing.model;

import java.sql.Date;
import java.sql.Time;

import lombok.Data;

import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class RangeDTO {
    private String startDate;
    private String endDate;
    private String startTime;
    private String endTime;
    private String frequency;
}
