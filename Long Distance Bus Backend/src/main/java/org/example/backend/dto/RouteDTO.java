package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RouteDTO {
    private Integer routeId;

    private String code;

    private String name;

    private Integer originStopId;

    private Integer destinationStopId;

    private BigDecimal distanceKm;
}
