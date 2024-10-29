package com.desk_sharing.entities;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.desk_sharing.services.DeskService;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id", unique = true)
    private Long id;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "x", nullable = false)
    private int x;

    @Column(name = "y", nullable = false)
    private int y;

    @Column(name = "floor", nullable = false)
    private String floor;
    
    @Column(name = "status")
    private String status;

    @Column(name = "remark")
    private String remark;

    /** We dont want to have a column with rooms. */
    @Transient
    private List<Desk> desks;

/*     @Transient
    @Autowired
    private DeskService deskService; */

    public Room(String type, int x, int y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }

/*     @PostLoad
    public void initNonPersistentFields() {
        this.desks = deskService.getDeskByRoomId(id);
    } */

/*     public List<Desk> getDesks() {
        return deskService.getDeskByRoomId(id);
    }  */
    

   /*  public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public String getFloor() {
        return floor;
    }

    public void setFloor(String floor) {
        this.floor = floor;
    }

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	} */
}
