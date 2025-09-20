package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.LoginRequestDTO;
import org.example.backend.dto.LoginResponseDTO;
import org.example.backend.dto.UserDTO;
import org.example.backend.entity.User;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.UserRepository;
import org.example.backend.service.UserService;
import org.modelmapper.ModelMapper;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void saveUser(UserDTO userDTO) {
        try {
            // DTO එකෙන් Entity එකට convert කරන්න
            User user = modelMapper.map(userDTO, User.class);

            // Password hash කරන්න
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));

            // Save user
            userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (email, phone, or NIC already exists)");
        }
    }

    @Override
    public void updateUser(UserDTO userDTO) {
        User existingUser = userRepository.findById(userDTO.getUserId())
                .orElseThrow(() -> new ResourseNotFound("User not found with id: " + userDTO.getUserId()));

        try {
            User updatedUser = modelMapper.map(userDTO, User.class);

            // Check if password is updated (optional)
            if (userDTO.getPasswordHash() != null && !userDTO.getPasswordHash().isEmpty()) {
                updatedUser.setPasswordHash(passwordEncoder.encode(userDTO.getPasswordHash()));
            } else {
                // Keep existing password if not updated
                updatedUser.setPasswordHash(existingUser.getPasswordHash());
            }

            userRepository.save(updatedUser);
        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found (email, phone, or NIC already exists)");
        }
    }

    @Override
    public void deleteUser(Integer id) {
        try {
            User existingUser = userRepository.findById(id)
                    .orElseThrow(() -> new ResourseNotFound("User not found with id: " + id));

            userRepository.delete(existingUser);

        } catch (ResourseNotFound ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete user: " + ex.getMessage());
        }
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new ResourseNotFound("User not found with email: " + loginRequestDTO.getEmail()));

        // Compare raw password (NOT secure – better use BCrypt later)
        if (user.getPasswordHash().equals(loginRequestDTO.getPassword())) {
            return new LoginResponseDTO(200, "Login successful", user.getUserId());
        } else {
            return new LoginResponseDTO(401, "Invalid password", null);
        }
    }

    @Override
    public List<UserDTO> getAll() {
        List<User> allUsers = userRepository.findAll();
        if (allUsers.isEmpty()) {
            throw new ResourseNotFound("No users found");
        }

        // Map each User individually to avoid ModelMapper collection errors
        return allUsers.stream().map(user -> {
            UserDTO dto = modelMapper.map(user, UserDTO.class);
            dto.setName(user.getFirstName() + " " + user.getLastName()); // manually set name
            return dto;
        }).toList();
    }

    @Override
    public UserDTO authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourseNotFound("User not found with email: " + email));

        if (passwordEncoder.matches(password, user.getPasswordHash())) {
            UserDTO dto = modelMapper.map(user, UserDTO.class);
            dto.setName(user.getFirstName() + " " + user.getLastName());
            return dto;
        } else {
            throw new RuntimeException("Invalid credentials");
        }
    }

    @Override
    public UserDTO register(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        User savedUser = userRepository.save(user);
        return modelMapper.map(savedUser, UserDTO.class);
    }

    @Override
    public UserDTO getUserByNic(String nic) {
        User user = userRepository.findByNic(nic)
                .orElseThrow(() -> new ResourseNotFound("User not found with NIC: " + nic));

        UserDTO dto = modelMapper.map(user, UserDTO.class);
        dto.setName(user.getFirstName() + " " + user.getLastName());
        return dto;
    }

    @Override
    public UserDTO findOrCreateGoogleUser(String email) {
        // Try to find user by email
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // If user not found → create a new user with default values
            user = new User();
            user.setEmail(email);
            user.setFirstName("Google"); // You can customize this
            user.setLastName("User");
            user.setPasswordHash(passwordEncoder.encode("GOOGLE_AUTH")); // dummy hashed password

            user = userRepository.save(user);
        }

        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        userDTO.setName(user.getFirstName() + " " + user.getLastName());

        return userDTO;
    }

}
