package com.example.myteachingapp.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private String instructorName;
    private Double price;

    @JsonProperty("imageUrl") // Ensures the JSON key sent to React is exactly "imageUrl"
    private String imageUrl; // Course image
    private String category; // ADD THIS FIELD
    private List<CourseDTO> relatedCourses; // Related courses

}