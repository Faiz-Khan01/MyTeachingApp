package com.example.myteachingapp.controller;

import com.example.myteachingapp.dto.CourseDTO;
import com.example.myteachingapp.service.CourseService;
import com.example.myteachingapp.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        return ResponseEntity.ok(courseService.findAll());
    }

    // NEW: Search endpoint (Matches /api/courses/search?q=...)
    @GetMapping("/search")
    public ResponseEntity<List<CourseDTO>> searchCourses(@RequestParam("q") String query) {
        return ResponseEntity.ok(courseService.search(query));
    }

    // NEW: Category endpoint (Matches /api/courses/category/...)
    @GetMapping("/category/{name}")
    public ResponseEntity<List<CourseDTO>> getByCategory(@PathVariable String name) {
        return ResponseEntity.ok(courseService.findByCategory(name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.findById(id));
    }

    @GetMapping("/{courseId}/enrolled")
    public ResponseEntity<Boolean> isEnrolled(@PathVariable Long courseId, Authentication authentication) {
        if (authentication == null) return ResponseEntity.ok(false);
        return ResponseEntity.ok(enrollmentService.isUserEnrolled(courseId, authentication.getName()));
    }

    @GetMapping("/related/{id}")
    public ResponseEntity<List<CourseDTO>> getRelatedCourses(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.findRelated(id));
    }

    @PostMapping("/{courseId}/enroll")
    public ResponseEntity<String> enrollInCourse(@PathVariable Long courseId, Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Please login first");
        enrollmentService.enroll(courseId, authentication.getName());
        return ResponseEntity.ok("Enrolled successfully");
    }
}