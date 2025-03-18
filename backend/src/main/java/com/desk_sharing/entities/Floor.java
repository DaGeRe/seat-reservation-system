package com.desk_sharing.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
@Table(name = "floors")
public class Floor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "floor_id", unique = true)
    private Long floor_id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "nameOfImg", nullable = true)
    private String nameOfImg;

    @ManyToOne(cascade =  { CascadeType.PERSIST, CascadeType.REMOVE })
    @JoinColumn(name = "building_id", nullable = false)
    private Building building;
}
