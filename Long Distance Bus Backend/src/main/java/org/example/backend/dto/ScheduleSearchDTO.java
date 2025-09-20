package org.example.backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ScheduleSearchDTO {
    private Integer scheduleId;
    private String daysOfWeek;
    private String active;

    private Integer busId;
    private String plateNo;
    private String busType;

    private Integer routeId;
    private String routeName;

    private LocalDateTime departDateTime;
    private LocalDateTime arrivalEta;

    private BigDecimal baseFare;
    private Integer tripId;
}
