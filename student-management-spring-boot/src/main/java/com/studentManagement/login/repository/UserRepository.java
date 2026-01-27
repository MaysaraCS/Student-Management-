package com.studentManagement.login.repository;

import com.studentManagement.login.entity.Role;
import com.studentManagement.login.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndRole(String username, Role role);

    List<User> findByRole(Role role);

    boolean existsByUsername(String username);
}