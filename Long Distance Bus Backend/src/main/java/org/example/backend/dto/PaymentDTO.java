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
public class PaymentDTO {
    private Integer paymentId;

    private String bookingRef;

    private BigDecimal amount;

    private String currency;

    private String method;

    private String provider;

    private String providerTxnId;

    private String status;

    private LocalDateTime paidAt;

    private LocalDateTime createdAt = LocalDateTime.now();
}
