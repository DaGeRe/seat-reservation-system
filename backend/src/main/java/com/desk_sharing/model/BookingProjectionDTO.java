package com.desk_sharing.model;

import java.sql.Date;
import java.sql.Time;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
/**
 * This class bundles necessary properties of a booking.
 * It is needed to enable an overview on every booking based on attributes (e.g.: the email address or the room remark).
 */
public class BookingProjectionDTO {
    private Long booking_id;
    private Date day;
    private Time begin;
    private Time end;
    private String email;
    private String deskRemark;
    private String roomRemark;
    private String building;
    private Long seriesId;
}
