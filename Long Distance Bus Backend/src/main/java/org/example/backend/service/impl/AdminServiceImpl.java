package org.example.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.backend.dto.AdminDTO;
import org.example.backend.entity.Admin;
import org.example.backend.exception.ResourseAllredyFound;
import org.example.backend.exception.ResourseNotFound;
import org.example.backend.repository.AdminRepository;
import org.example.backend.service.AdminService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final AdminRepository adminRepository;
    private final ModelMapper modelMapper;

    @Override
    public void saveAdmin(AdminDTO adminDTO) {
        try {
            adminRepository.save(modelMapper.map(adminDTO, Admin.class));
        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found");
        }
    }

    @Override
    public void updateAdmin(AdminDTO adminDTO) {
        Admin existingAdmin = adminRepository.findById(adminDTO.getAdminId())
                .orElseThrow(() -> new ResourseNotFound("Admin not found with id: " + adminDTO.getAdminId()));

        try {
            Admin updatedAdmin = modelMapper.map(adminDTO, Admin.class);
            adminRepository.save(updatedAdmin);

        } catch (DataIntegrityViolationException ex) {
            throw new ResourseAllredyFound("Duplicate value found");
        }
    }

    @Override
    public List<AdminDTO> getAll() {
        List<Admin> allAdmins = adminRepository.findAll();
        if(allAdmins.isEmpty()) {
            throw new ResourseNotFound("No admins found");
        }
        return modelMapper.map(allAdmins, new TypeToken<List<AdminDTO>>(){}.getType());
    }

    @Override
    public void deleteAdmin(Integer id) {
        try {
            Admin existingAdmin = adminRepository.findById(id)
                    .orElseThrow(() -> new ResourseNotFound("Admin not found with id: " + id));

            adminRepository.delete(existingAdmin);

        } catch (ResourseNotFound ex) {
            throw ex;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to delete admin: " + ex.getMessage());
        }
    }

    @Override
    public AdminDTO authenticateAdmin(String email, String password) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new ResourseNotFound("Admin not found with email: " + email));

        if (!admin.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }

        return modelMapper.map(admin, AdminDTO.class);
    }
}
