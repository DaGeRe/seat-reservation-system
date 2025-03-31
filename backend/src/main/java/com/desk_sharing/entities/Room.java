package com.desk_sharing.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Data
@Table(name = "rooms")
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id", unique = true)
    private Long id;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "building", nullable = true)
    private String building;

    
    @ManyToOne(cascade =  { CascadeType.PERSIST })
    @JoinColumn(name = "floor_id", nullable = true)
    private Floor floorObj;

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

    public Room(String type, int x, int y) {
        this.type = type;
        this.x = x;
        this.y = y;
    }
}
