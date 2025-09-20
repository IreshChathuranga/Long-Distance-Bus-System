package org.example.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AdminDTO {
    private Integer adminId;

    private String name;

    private String address;

    private String nic;

    private String email;

    private String phone;
    private String password;
    private String role = "ADMIN";
}
