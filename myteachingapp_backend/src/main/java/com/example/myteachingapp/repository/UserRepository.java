package com.example.myteachingapp.repository;

import com.example.myteachingapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_courses WHERE user_id = :userId AND course_id = :courseId", nativeQuery = true)
    void unenrollUser(@Param("userId") Long userId, @Param("courseId") Long courseId);
}