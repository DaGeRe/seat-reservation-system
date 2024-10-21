package com.desk_sharing.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.desk_sharing.entities.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    UserEntity findByEmail(String email);
    boolean existsByEmail(String email);
}