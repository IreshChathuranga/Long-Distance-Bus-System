package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SeatMapDTO {
    private Integer seatMapId;

    private String name;

    private Integer rowsCount;

    private Integer colsCount;

    private String layout;
}
