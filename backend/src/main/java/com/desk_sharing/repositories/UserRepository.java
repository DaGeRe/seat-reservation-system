package com.desk_sharing.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.desk_sharing.entities.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    UserEntity findByEmail(String email);
    boolean existsByEmail(String email);

    @Query(value="select  from buildings where building_id = :building_id and used=True ", nativeQuery=true)
    public Object[] getDefaultBuildingAndFloorForUserId(@Param("building_id") Integer id);
}