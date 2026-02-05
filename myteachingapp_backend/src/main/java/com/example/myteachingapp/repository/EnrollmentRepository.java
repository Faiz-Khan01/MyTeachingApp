package com.example.myteachingapp.repository;

import com.example.myteachingapp.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    // Logic: Look at Enrollment -> User -> Email
    List<Enrollment> findByUserEmail(String email);

    // Logic: Check if an enrollment exists for this specific Email and Course ID
    boolean existsByUserEmailAndCourseId(String email, Long courseId);


    // ADD THIS: This method physically removes the record from the database
    void deleteByUserEmailAndCourseId(String email, Long courseId);
}