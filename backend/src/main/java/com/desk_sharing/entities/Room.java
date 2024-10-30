package com.desk_sharing.entities;

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

    @Column(name = "building", nullable = true)
    private String building;

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
