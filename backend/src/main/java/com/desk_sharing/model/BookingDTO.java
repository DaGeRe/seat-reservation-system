package com.desk_sharing.model;

import java.sql.Date;
import java.sql.Time;

public class BookingDTO {
    private Long id;
    private int userId;
    private Long roomId;
    private Long deskId;
    private Date day;
    private Time begin;
    private Time end;
    
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public int getUserId() {
        return userId;
    }
    public void setUserId(int userId) {
        this.userId = userId;
    }
    public Long getRoomId() {
        return roomId;
    }
    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }
    public Long getDeskId() {
        return deskId;
    }
    public void setDeskId(Long deskId) {
        this.deskId = deskId;
    }
    public Date getDay() {
        return day;
    }
    public void setDay(Date day) {
        this.day = day;
    }
    public Time getBegin() {
        return begin;
    }
    public void setBegin(Time begin) {
        this.begin = begin;
    }
    public Time getEnd() {
        return end;
    }
    public void setEnd(Time end) {
        this.end = end;
    }

}
