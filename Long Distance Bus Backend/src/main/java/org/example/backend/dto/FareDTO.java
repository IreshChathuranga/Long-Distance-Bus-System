package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FareDTO {
    private Integer fareId;

    private Integer routeId;

    private String busType;

    private BigDecimal baseFare;

    private BigDecimal perKmRate;

    private String currency;

    private LocalDate effectiveFrom;

    private LocalDate effectiveTo;
}
