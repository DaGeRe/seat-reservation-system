package com.desk_sharing.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.CrudRepository;
import org.springframework.data.repository.CrudRepository;
import com.desk_sharing.entities.UserEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
/*     Optional<UserEntity> findByUsername(String username);
    Boolean existsByUsername(String username); */
    UserEntity findByEmail(String email);
    boolean existsByEmail(String email);
}