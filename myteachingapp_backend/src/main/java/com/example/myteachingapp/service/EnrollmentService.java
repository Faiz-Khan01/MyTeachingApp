//package com.example.myteachingapp.service;
//
//import com.example.myteachingapp.dto.CourseDTO;
//import com.example.myteachingapp.entity.*;
//import com.example.myteachingapp.repository.*;
//import lombok.RequiredArgsConstructor;
//import org.modelmapper.ModelMapper;
//import org.springframework.stereotype.Service;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class EnrollmentService {
//
//    private final EnrollmentRepository enrollmentRepository;
//    private final UserRepository userRepository;
//    private final CourseRepository courseRepository;
//    private final ModelMapper modelMapper;
//
//    public void enroll(Long courseId, String email) {
//        // 1. Find user by Email
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found: " + email));
//
//        // 2. Find course by ID
//        Course course = courseRepository.findById(courseId)
//                .orElseThrow(() -> new RuntimeException("Course not found"));
//
//        // 3. Check enrollment using EMAIL method
//        if (enrollmentRepository.existsByUserEmailAndCourseId(email, courseId)) {
//            throw new RuntimeException("You are already enrolled in this course.");
//        }
//
//        // 4. Save new Enrollment
//        Enrollment enrollment = new Enrollment();
//        enrollment.setUser(user);
//        enrollment.setCourse(course);
//        enrollmentRepository.save(enrollment);
//    }
//
//    public List<CourseDTO> getCoursesByEmail(String email) {
//        // Changed method name to getCoursesByEmail for clarity
//        return enrollmentRepository.findByUserEmail(email).stream()
//                .map(enrollment -> {
//                    Course course = enrollment.getCourse(); // Ensure @Data is on Enrollment entity
//                    return modelMapper.map(course, CourseDTO.class);
//                })
//                .collect(Collectors.toList());
//    }
//
//    public boolean isUserEnrolled(Long courseId, String email) {
//        // Use the new Email repository method
//        return enrollmentRepository.existsByUserEmailAndCourseId(email, courseId);
//    }
//}


package com.example.myteachingapp.service;

import com.example.myteachingapp.dto.CourseDTO;
import com.example.myteachingapp.entity.*;
import com.example.myteachingapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Ensure this is imported

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public void enroll(Long courseId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (enrollmentRepository.existsByUserEmailAndCourseId(email, courseId)) {
            throw new RuntimeException("You are already enrolled in this course.");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);
        enrollmentRepository.save(enrollment);
    }

    // ADD THIS: The logic to handle unenrollment
    @Transactional
    public void unenroll(Long courseId, String email) {
        if (!enrollmentRepository.existsByUserEmailAndCourseId(email, courseId)) {
            throw new RuntimeException("Enrollment not found for this user and course.");
        }
        enrollmentRepository.deleteByUserEmailAndCourseId(email, courseId);
    }

    public List<CourseDTO> getCoursesByEmail(String email) {
        return enrollmentRepository.findByUserEmail(email).stream()
                .map(enrollment -> modelMapper.map(enrollment.getCourse(), CourseDTO.class))
                .collect(Collectors.toList());
    }

    public boolean isUserEnrolled(Long courseId, String email) {
        return enrollmentRepository.existsByUserEmailAndCourseId(email, courseId);
    }
}