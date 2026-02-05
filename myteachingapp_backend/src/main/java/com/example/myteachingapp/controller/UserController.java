package com.example.myteachingapp.controller;

import com.example.myteachingapp.dto.CourseDTO;
import com.example.myteachingapp.dto.UserDTO;
import com.example.myteachingapp.service.UserService;
import com.example.myteachingapp.service.EnrollmentService;
import com.example.myteachingapp.entity.User;
import com.example.myteachingapp.entity.Course;
import com.example.myteachingapp.repository.UserRepository;
import com.example.myteachingapp.repository.CourseRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional; // Correct import for Spring transactions
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final EnrollmentService enrollmentService;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    /**
     * Get the logged-in user's profile info.
     */
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        UserDTO user = userService.findByEmail(authentication.getName());
        return ResponseEntity.ok(user);
    }

    /**
     * Enroll in a course.
     */
    @PostMapping("/enroll/{courseId}")
    @Transactional
    public ResponseEntity<?> enrollInCourse(@PathVariable Long courseId, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        user.getEnrolledCourses().add(course);
        userRepository.save(user);

        return ResponseEntity.ok("Successfully enrolled in " + course.getTitle());
    }

    /**
     * Remove (Unenroll) a course from the profile.
     * @Transactional ensures the join table record is deleted correctly.
     */
//    @DeleteMapping("/unenroll/{courseId}")
//    @Transactional
//    public ResponseEntity<?> unenrollFromCourse(@PathVariable Long courseId, Authentication authentication) {
//        User user = userRepository.findByEmail(authentication.getName())
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // Step 1: Manually delete from the join table using the custom query
//        userRepository.unenrollUser(user.getId(), courseId);
//
//        // Step 2: Clear Hibernate's internal cache
//        user.getEnrolledCourses().removeIf(c -> c.getId().equals(courseId));
//
//        return ResponseEntity.ok("Successfully unenrolled");
//    }

    @DeleteMapping("/unenroll/{courseId}")
    public ResponseEntity<?> unenrollFromCourse(@PathVariable Long courseId, Authentication authentication) {
        // Call the service that specifically handles the 'enrollments' table
        enrollmentService.unenroll(courseId, authentication.getName());

        return ResponseEntity.ok("Successfully unenrolled");
    }


    /**
     * Get the list of courses the user is enrolled in.
     */
    @GetMapping("/me/courses")
    public ResponseEntity<List<CourseDTO>> getMyCourses(Authentication authentication) {
        List<CourseDTO> enrolledCourses = enrollmentService.getCoursesByEmail(authentication.getName());
        return ResponseEntity.ok(enrolledCourses);
   }
}