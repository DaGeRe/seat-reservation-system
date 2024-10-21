package com.desk_sharing.entities;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import com.desk_sharing.entities.UserEntity;
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
    
    @Column(name = "day", nullable = false)
    private Date day; // yyyy-mm-dd
    
    private boolean bookingInProgress;
    
    private LocalDateTime lockExpiryTime;
    
    @Column(name = "begin", nullable = false)
    private Time begin; // hh:mm:ss
    
    @Column(name = "end", nullable = false)
    private Time end;

    public Booking() {}
    
    public Booking(UserEntity user, Room room, Desk desk, Date day, Time begin, Time end) {
        this.user = user;
        this.room = room;
        this.desk = desk;
        this.day = day;
        this.begin = begin;
        this.end = end;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public Desk getDesk() {
        return desk;
    }

    public void setDesk(Desk desk) {
        this.desk = desk;
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

	public boolean isBookingInProgress() {
		return bookingInProgress;
	}

	public void setBookingInProgress(boolean bookingInProgress) {
		this.bookingInProgress = bookingInProgress;
	}

	public LocalDateTime getLockExpiryTime() {
		return lockExpiryTime;
	}

	public void setLockExpiryTime(LocalDateTime lockExpiryTime) {
		this.lockExpiryTime = lockExpiryTime;
	}
    
}
