package com.example.myteachingapp.repository;

import com.example.myteachingapp.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // 1. THIS FIXES THE ERROR: Custom query to search keywords like 'MERN'
    // It looks inside both Title and Description
    @Query("SELECT c FROM Course c WHERE " +
            "LOWER(c.title) LIKE LOWER(concat('%', :query, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(concat('%', :query, '%'))")
    List<Course> searchByKeyword(@Param("query") String query);

    // 2. Used for your Search Bar (Title only)
    List<Course> findByTitleContainingIgnoreCase(String title);

    // 3. Used for your Dropdowns (e.g., 'datascience')
    List<Course> findByCategoryIgnoreCase(String category);

    // 4. Fixed Related Courses logic to use Category instead of just random IDs
    @Query("SELECT c FROM Course c WHERE c.category = " +
            "(SELECT c2.category FROM Course c2 WHERE c2.id = :id) " +
            "AND c.id <> :id")
    List<Course> findRelatedCourses(@Param("id") Long id);
}