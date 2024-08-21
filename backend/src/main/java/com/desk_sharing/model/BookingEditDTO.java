package com.desk_sharing.model;

import java.sql.Time;

public class BookingEditDTO {
	private Long id;
    private Time begin;
    private Time end;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
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
