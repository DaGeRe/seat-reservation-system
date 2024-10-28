package com.desk_sharing.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "desks")
public class Desk {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "desk_id", unique = true)
    private Long id;

    @ManyToOne(cascade =  { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;
    
    @Column(name = "equipment", nullable = false)
    private String equipment;

    @Column(name = "remark", nullable = true)
    private String remark;

    public Desk() {
    }

    public Desk(Room room, String equipment) {
        this.room = room;
        this.equipment = equipment;
    }

/*     public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
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
    } */
}
