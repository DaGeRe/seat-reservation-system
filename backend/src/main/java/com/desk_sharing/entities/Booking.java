package com.desk_sharing.entities;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id", unique = true)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne
    @JoinColumn(name = "desk_id", nullable = false)
    private Desk desk;

    @ManyToOne
    @JoinColumn(name = "series_id", nullable = true)
    private Series series;
    
    @Column(name = "day", nullable = false)
    private Date day; // yyyy-mm-dd
    
    private boolean bookingInProgress;
    
    private LocalDateTime lockExpiryTime;
    
    @Column(name = "begin", nullable = false)
    private Time begin; // hh:mm:ss
    
    @Column(name = "end", nullable = false)
    private Time end;

    
    public Booking(UserEntity user, Room room, Desk desk, Date day, Time begin, Time end) {
        this.user = user;
        this.room = room;
        this.desk = desk;
        this.day = day;
        this.begin = begin;
        this.end = end;
    }
    public Booking(UserEntity user, Room room, Desk desk, Date day, Time begin, Time end, Series series) {
        this.user = user;
        this.room = room;
        this.desk = desk;
        this.day = day;
        this.begin = begin;
        this.end = end;
        this.series = series;
    }
}
