package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TripDTO {
    private Integer tripId;

    private Integer scheduleId;

    private LocalDate serviceDate;

    private LocalDateTime departDateTime;

    private LocalDateTime arrivalEta;

    private String status;
}
