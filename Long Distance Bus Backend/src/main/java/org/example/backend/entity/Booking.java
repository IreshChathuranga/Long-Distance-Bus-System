package org.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer bookingId;

    @ManyToOne
    @JoinColumn(name = "passenger_id", nullable = false, foreignKey = @ForeignKey(name = "fk_bookings_user"))
    @JsonIgnore
    private User user;

    @ManyToOne
    @JoinColumn(name = "trip_id", nullable = false, foreignKey = @ForeignKey(name = "fk_bookings_trip"))
    @JsonIgnore
    private Trip trip;

    @Column(name = "booking_ref", nullable = false, length = 20, unique = true)
    private String bookingRef;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @PrePersist
    public void prePersist() {
        // Ensure createdAt is set
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        // Auto-generate expiresAt 30 minutes after createdAt
        if (this.expiresAt == null) {
            this.expiresAt = this.createdAt.plusMinutes(30);
        }
    }
}
