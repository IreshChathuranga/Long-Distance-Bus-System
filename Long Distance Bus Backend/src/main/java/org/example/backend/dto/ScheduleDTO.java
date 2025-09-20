package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ScheduleDTO {
    private Integer scheduleId;

    private Integer busId;

    private Integer routeId;

    private LocalDate departTime;

    private String daysOfWeek;

    private String active;
}
