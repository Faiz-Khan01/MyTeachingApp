package com.example.myteachingapp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "courses")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Maps to instructor_name in your MySQL table
    @Column(name = "instructor_name")
    private String instructorName;

    private Double price;

    // Maps to the image_url column you just added in MySQL
    @Column(name = "image_url")
    private String imageUrl;

    // ADD THIS FIELD
    private String category;
}