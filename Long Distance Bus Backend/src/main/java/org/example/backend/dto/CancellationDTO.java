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
public class CancellationDTO {
    private Integer cancellationId;

    private Integer bookingId;

    private String reason;

    private BigDecimal feeAmount = BigDecimal.ZERO;

    private BigDecimal refundAmount = BigDecimal.ZERO;

    private LocalDateTime processedAt;

    private LocalDateTime createdAt = LocalDateTime.now();
}
