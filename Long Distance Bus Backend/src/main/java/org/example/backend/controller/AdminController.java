package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.AdminDTO;
import org.example.backend.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/admin")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class AdminController {
    private final AdminService adminService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveAdmin(@Valid @RequestBody AdminDTO adminDTO){
        log.info("INFO - Admin Created");
        log.warn("WARN -  Admin Created");
        log.debug("DEBUG -  Admin Created");
        log.error("ERROR - Admin Created");
        log.trace("TRACE - Admin Created");

        adminService.saveAdmin(adminDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Admin Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyAdmin(@RequestBody AdminDTO adminDTO){
        adminService.updateAdmin(adminDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "Admin Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getAdmins(){

        List<AdminDTO> adminDTOS = adminService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        adminDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteAdmin(@PathVariable Integer id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Admin deleted successfully",
                        null
                )
        );
    }
}
