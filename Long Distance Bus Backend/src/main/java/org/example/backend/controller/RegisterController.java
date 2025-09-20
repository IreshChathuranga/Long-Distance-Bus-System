package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.Util.APIResponse;
import org.example.backend.dto.UserDTO;
import org.example.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/register")
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class RegisterController {
    private final UserService userService;

    @PostMapping("save")
    public ResponseEntity<APIResponse> saveUser(@Valid @RequestBody UserDTO userDTO){
        log.info("INFO - User Created");
        log.warn("WARN -  User Created");
        log.debug("DEBUG -  User Created");
        log.error("ERROR - User Created");
        log.trace("TRACE - User Created");

        userService.saveUser(userDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "User Created Successfully",
                        null
                ), HttpStatus.CREATED
        );
    }

    @PutMapping("modify")
    public ResponseEntity<APIResponse> modifyUser(@RequestBody UserDTO userDTO){
        userService.updateUser(userDTO);
        return new ResponseEntity(
                new APIResponse(
                        200,
                        "User Update Successfully",
                        null
                ),HttpStatus.CREATED
        );
    }

    @GetMapping("get")
    public ResponseEntity<APIResponse> getUsers(){

        List<UserDTO> userDTOS = userService.getAll();
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "Success",
                        userDTOS
                )
        );
    }

    @DeleteMapping("delete/{id}")
    public ResponseEntity<APIResponse> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(
                new APIResponse(
                        200,
                        "User deleted successfully",
                        null
                )
        );
    }

    @GetMapping("/nic/{nic}")
    public ResponseEntity<UserDTO> getUserByNic(@PathVariable String nic) {
        UserDTO userDTO = userService.getUserByNic(nic);
        return ResponseEntity.ok(userDTO);
    }
}
