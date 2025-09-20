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
public class BookingItemDTO {
    private Integer bookingItemId;

    private Integer bookingId;

    private Integer tripSeatId;

    private String seatNumber;

    private BigDecimal fareAmount;

    private LocalDateTime createdAt = LocalDateTime.now();

    private Integer ticket;
}
