package org.example.backend.service;

import org.example.backend.dto.AdminDTO;

import java.util.List;

public interface AdminService {
    void saveAdmin(AdminDTO adminDTO);
    public void updateAdmin(AdminDTO adminDTO);
    List<AdminDTO> getAll();
    void deleteAdmin(Integer id);
    AdminDTO authenticateAdmin(String email, String password);
}
