package com.desk_sharing.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.desk_sharing.entities.Role;
import org.springframework.stereotype.Repository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(String name);
}