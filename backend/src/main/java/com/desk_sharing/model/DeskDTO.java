package com.desk_sharing.model;

public class DeskDTO {

	private Long roomId;
	private String equipment;
	private String remark;
	private Long deskId;

	public Long getRoomId() {
		return roomId;
	}

	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}

	public String getEquipment() {
		return equipment;
	}
	
	public void setEquipment(String equipment) {
		this.equipment = equipment;
	}
	public String getRemark() {
		return remark;
	}
	
	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getDeskId() {
		return deskId;
	}

	public void setDeskId(Long deskId) {
		this.deskId = deskId;
	}
}
