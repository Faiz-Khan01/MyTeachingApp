package com.example.myteachingapp.service;

import com.example.myteachingapp.dto.UserDTO;
import com.example.myteachingapp.entity.User;
import com.example.myteachingapp.repository.UserRepository;
import com.example.myteachingapp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    /**
     * NEW: Find user by Email.
     * This is called by UserController /api/users/me
     */
    public UserDTO findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return modelMapper.map(user, UserDTO.class);
    }

    public List<UserDTO> findAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * UPDATED: Update user profile using email as the identifier
     */
    public UserDTO updateUser(String email, UserDTO userDTO) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Update fields (add more as needed, like name or phone)
        user.setEmail(userDTO.getEmail());

        return modelMapper.map(userRepository.save(user), UserDTO.class);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Keep this only if you still need to find by username for specific admin tasks
    public UserDTO findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
        return modelMapper.map(user, UserDTO.class);
    }
}