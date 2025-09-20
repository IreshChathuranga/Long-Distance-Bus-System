package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BusDTO {
    private Integer busId;
    private Integer operatorId;
    private Integer seatMapId;
    private String plateNo;
    private String busType;
    private String amenities;
    private String active;
}
