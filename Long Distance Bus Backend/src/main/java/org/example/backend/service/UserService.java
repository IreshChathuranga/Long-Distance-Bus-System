package org.example.backend.service;

import org.example.backend.dto.LoginRequestDTO;
import org.example.backend.dto.LoginResponseDTO;
import org.example.backend.dto.UserDTO;
import org.example.backend.entity.User;

import java.util.List;

public interface UserService {
    void saveUser(UserDTO userDTO);
    public void updateUser(UserDTO userDTO);
    List<UserDTO> getAll();
    void deleteUser(Integer id);
    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);

    UserDTO authenticate(String email, String password);
    UserDTO register(User user);
    UserDTO getUserByNic(String nic);

    UserDTO findOrCreateGoogleUser(String email);
}
