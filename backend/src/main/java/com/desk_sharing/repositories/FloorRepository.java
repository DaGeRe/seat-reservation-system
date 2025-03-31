package com.desk_sharing.repositories;

import com.desk_sharing.entities.Floor;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FloorRepository extends JpaRepository<Floor, Long> {
    
    @Query(value="select * from floors where building_id=:building_id", nativeQuery=true)
    public List<Floor> getAllFloorsForBuildingId(@Param("building_id") Long building_id);

    @Query(value="select * from floors where floor_id=:floor_id", nativeQuery=true)
    public Floor getFloorByFloorId(@Param("floor_id") Long floor_id);
}
