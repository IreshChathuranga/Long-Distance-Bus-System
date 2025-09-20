package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TripSeatDTO {
    private Integer tripSeatId;

    private Integer tripId;

    private Integer seatId;

    private String status;

    private LocalDateTime holdExpiresAt;
}
