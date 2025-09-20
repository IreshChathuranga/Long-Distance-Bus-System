package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SeatDTO {
    private Integer seatId;
    private Integer seatMapId;

    private String seatNumber;

    private Integer rowNo;

    private Integer colNo;

    private String seatType;
}
