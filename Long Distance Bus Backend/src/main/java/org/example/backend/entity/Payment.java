package org.example.backend.entity;

import jakarta.persistence.*;
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
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;

    @Column(name = "booking_ref", nullable = false, length = 20, unique = true)
    private String bookingRef;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;
//    CARD,
//    MOBILE,
//    CASH,
//    OTHER

    @Column(name = "method", nullable = false, length = 20)
    private String method;

    @Column(name = "provider", length = 50)
    private String provider;

    @Column(name = "provider_txn_id", length = 100)
    private String providerTxnId;

    @Column(name = "status", nullable = false, length = 20)
    private String status;
//    INITIATED,
//    SUCCESS,
//    FAILED,
//    REFUNDED

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
