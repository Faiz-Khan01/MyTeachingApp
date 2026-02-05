package com.example.myteachingapp.service;

import com.example.myteachingapp.dto.CourseDTO;
import com.example.myteachingapp.entity.Course;
import com.example.myteachingapp.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;

    // --- ADMIN METHODS ---



    // Fixes: Cannot resolve method 'save'
    public CourseDTO save(CourseDTO courseDTO) {
        // Convert incoming DTO to Database Entity
        Course course = convertToEntity(courseDTO);
        // Save to Database
        Course savedCourse = courseRepository.save(course);
        // Return as DTO
        return convertToDTO(savedCourse);
    }

    // Fixes: Cannot resolve method 'deleteById'
    public void deleteById(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    // --- SEARCH & FILTER METHODS ---

//    public List<CourseDTO> search(String query) {
//        return courseRepository.findByTitleContainingIgnoreCase(query)
//                .stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    public List<CourseDTO> findByCategory(String category) {
//        return courseRepository.findByCategoryIgnoreCase(category)
//                .stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }


    // Detects keywords like "MERN" in Title OR Description
    public List<CourseDTO> search(String query) {
        // Assuming your Repository has findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase
        return courseRepository.searchByKeyword(query)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Handles category filtering (e.g., "datascience")
    public List<CourseDTO> findByCategory(String category) {
        return courseRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // --- READ METHODS ---

    public List<CourseDTO> findAll() {
        return courseRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CourseDTO findById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return convertToDTO(course);
    }

    public List<CourseDTO> findRelated(Long id) {
        return courseRepository.findRelatedCourses(id).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // --- MAPPING HELPERS ---



    private CourseDTO convertToDTO(Course course) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setPrice(course.getPrice());
        dto.setInstructorName(course.getInstructorName());
        dto.setImageUrl(course.getImageUrl());
        dto.setCategory(course.getCategory());
        return dto;
    }

    private Course convertToEntity(CourseDTO dto) {
        Course course = new Course();
        // If ID exists, JPA will UPDATE. If ID is null, JPA will INSERT.
        course.setId(dto.getId());
        course.setTitle(dto.getTitle());
        course.setDescription(dto.getDescription());
        course.setPrice(dto.getPrice());
        course.setInstructorName(dto.getInstructorName());
        course.setImageUrl(dto.getImageUrl());
        course.setCategory(dto.getCategory());
        return course;
    }
}