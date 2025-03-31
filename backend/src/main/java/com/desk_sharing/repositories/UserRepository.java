package com.desk_sharing.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.desk_sharing.entities.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    UserEntity findByEmail(String email);
    boolean existsByEmail(String email);

    @Query(value="select floors.* from users join floors on default_floor_id=floor_id where id=:id", nativeQuery=true)
    public List<Object[]> getDefaultFloorForUserId(@Param("id") Integer id);

}